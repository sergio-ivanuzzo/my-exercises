import React, {useCallback, useEffect, useRef, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactModal from "react-modal";
import {v4} from "uuid";
import styles from "./index.module.css";

const URL = `https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}`;

interface IImage {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    previewURL: string;
    previewWidth: number;
    previewHeight: number;
    largeImageURL: string;
    fullHDURL: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: number;
    views: number;
    downloads: number;
    likes: number;
    user: string;
    userImageURL: string;
    webformatWidth: string;
    key: string;
}

export enum Category {
    BACKGROUNDS = "backgrounds",
    FASHION = "fashion",
    NATURE = "nature",
    SCIENCE = "science",
    EDUCATION = "education",
    FEELINGS = "feelings",
    HEALTH = "health",
    PEOPLE = "people",
    RELIGION = "religion",
    PLACES = "places",
    ANIMALS = "animals",
    INDUSTRY = "industry",
    COMPUTER = "computer",
    FOOD = "food",
    SPORTS = "sports",
    TRANSPORTATION = "transportation",
    TRAVEL = "travel",
    BUILDINGS = "buildings",
    BUSINESS = "business",
    MUSIC = "music"
}

async function fetchImages(category: Category, page: number): Promise<IImage[] | never> {
    console.log(`${URL}&category=${category}&page=${page}`)
    let response = await fetch(`${URL}&category=${category}&page=${page}`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { hits: images }: { hits: IImage[] } = await response.json();
    console.log({images});

    return images;
}

interface ICategorySelectorProps {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategorySelector = ({ onChange }: ICategorySelectorProps) => {
    const options = Object.values(Category).map(category => (
        <option key={category}>{category}</option>
    ))
    return (
        <select onChange={onChange}>
            {options}
        </select>
    );
};

interface IImageCardProps extends IImage {
    onClick: (image: IImage) => void;
}

const ImageCard = ({onClick, ...data}: IImageCardProps) => {
    const handleClick = () => {
        onClick(data);
    };

    return (
        <div className={styles.imageCard}>
            <div>Posted by: {data.user}</div>
            <div>
                <img src={data.previewURL} width={data.previewWidth} alt={data.tags} onClick={handleClick} />
            </div>
            <div>
                Downloads: {data.downloads}
            </div>
        </div>
    );
};

const ImageGallery = () => {
    const [images, setImages] = useState<IImage[]>([]);
    const [category, setCategory] = useState(Category.ANIMALS);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<IImage>();

    const handleFetch = useCallback(() => {
        fetchImages(category, page).then(images => {
            setImages(prevImages => [...prevImages, ...images.map(image => ({
                ...image,
                key: v4(),
            }))]);
            setHasMore(!!images.length);
            setPage(prevPage => prevPage + 1);
        });
    }, [category, page]);

    useEffect(() => {
        handleFetch();
    }, []);

    const parentRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value as Category);
    }

    const openModal = useCallback((image: IImage) => {
        setModalOpen(true);
        setSelectedImage(image);
    }, []);
    const closeModal = useCallback(() => setModalOpen(false), []);

    const imageElements = images.map(({key, ...data}) => (
        <ImageCard key={key} {...data} onClick={openModal} />
    ));

    return (
        <div ref={parentRef}>
            <div>
                <CategorySelector onChange={handleChange} />
            </div>
            <ReactModal isOpen={isModalOpen} onRequestClose={closeModal} appElement={parentRef.current as HTMLElement}>
                <img
                    src={selectedImage?.largeImageURL}
                    width={selectedImage?.webformatWidth}
                    alt={selectedImage?.tags}
                />
            </ReactModal>
            <InfiniteScroll
                dataLength={images.length}
                loader={<h4>Loading...</h4>}
                next={handleFetch}
                hasMore={hasMore}
                className={styles.container}
            >
                {imageElements}
            </InfiniteScroll>
        </div>
    );
};

export default ImageGallery;