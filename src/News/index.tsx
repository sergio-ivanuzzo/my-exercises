import React, {useCallback, useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 } from "uuid";
import styles from "./index.module.css";

enum CATEGORIES {
    BUSINESS = "business",
    ENTERTAINMENT = "entertainment",
    GENERAL = "general",
    HEALTH = "health",
    SCIENCE = "science",
    SPORTS = "sports",
    TECHNOLOGY = "technology"
}

interface INewsFetcherProps {
    category?: CATEGORIES;
}

const URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.REACT_APP_NEWS_API}`;

export interface IArticle {
    author: string,
    content: string,
    description: string,
    publishedAt: string,
    source: { id?: number, name: string },
    title: string,
    url: string,
    urlToImage: string,
    key: string,
}

const Article = ({ author, title, description, urlToImage }: IArticle) => {
    return (
        <article className={styles.article}>
            <header>
                <h1>{title}</h1>
                <p>{author}</p>
            </header>
            <p>{description}</p>
            <figure>
                <img src={urlToImage} alt={description}/>
                <figcaption>{description}</figcaption>
            </figure>
        </article>
    );
};

async function fetchData(category: string, page: number, pageSize: number): Promise<IArticle[] | never> {
    const response = await fetch(`${URL}&category=${category}&page=${page}&pageSize=${pageSize}`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { articles }: { articles: IArticle[] } = await response.json();
    return articles;
}

const NewsFetcher = ({ category = CATEGORIES.BUSINESS }: INewsFetcherProps) => {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMore, setHasMore] = useState(false);

    const handleFetch = useCallback(() => {
        fetchData(category, page, pageSize).then(articles => {
            setArticles(prevArticles => [...prevArticles, ...articles.map(article => ({
                ...article,
                key: v4(),
            }))]);
            setHasMore(!!articles.length);
            setPage(prevPage => prevPage + 1);
        });
    }, [category, page, pageSize]);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    const articlesElements = useMemo(
        () => articles.map(({ key, ...rest }) => (<Article key={key} {...rest} />)),
        [articles]
    );

    return (
        <div>
            <InfiniteScroll
                dataLength={articles.length}
                loader={<h4>Loading...</h4>}
                next={handleFetch}
                hasMore={hasMore}
            >
                {articlesElements}
            </InfiniteScroll>
        </div>
    );
};

export const NewsFetcherWithCategorySelector = () => {
    const [category, setCategory] = useState<CATEGORIES>(CATEGORIES.BUSINESS);

    const categoriesElements = Object.values(CATEGORIES).map(category => (
        <option key={category}>{category}</option>
    ));

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value as CATEGORIES);
    };

    return (
        <>
            <select value={category} onChange={handleSelect}>{categoriesElements}</select>
            <NewsFetcher category={category} />
        </>
    );
};

export default NewsFetcher;