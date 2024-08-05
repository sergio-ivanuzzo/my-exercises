import React, {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 } from "uuid";
import styles from "./index.module.css";

const URL = "https://newsapi.org/v2/everything?q=tesla&from=2024-06-30&sortBy=publishedAt";
const API_KEY = "35e16e7d832b43d3a388e029b287425d";

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

const NewsFetcher = () => {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMore, setHasMore] = useState(false);

    const fetchData = async() => {
        const response = await fetch(`${URL}&apiKey=${API_KEY}&page=${page}&pageSize=${pageSize}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { articles }: { articles: IArticle[] } = await response.json();
        setArticles(prevArticles => [...prevArticles, ...articles.map(article => ({
            ...article,
            key: v4(),
        }))]);
        setHasMore(!!articles.length);
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const articlesElements = useMemo(
        () => articles.map(({ key, ...rest }) => (<Article key={key} {...rest} />)),
        [articles]
    );

    return (
        <div>
            <InfiniteScroll
                dataLength={articles.length}
                loader={<h4>Loading...</h4>}
                next={fetchData}
                hasMore={hasMore}
            >
                {articlesElements}
            </InfiniteScroll>
        </div>
    );
};

export default NewsFetcher;