import React, {ChangeEvent, useMemo, useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import ReviewMe from "../Proj0";
import ReviewMe2 from "../Proj1";
import "./index.module.css";
import {DebounceInput} from "react-debounce-input";
import NewsFetcher from "../News";
import State from "../State";
import Selecting from "../Selecting";

interface IChapter {
    link: string,
    text: string,
    component: () => React.ReactElement,
}

interface IChapterProps {
    link: string,
    text: string,
}

interface ISearchBarProps {
    query: string,
    setQuery: (query: string) => void,
}

const CHAPTERS: IChapter[] = [
    {link: "/first", text: "ReviewMe with own debounce", component: ReviewMe},
    {link: "/second", text: "ReviewMe with DebouncedInput", component: ReviewMe2},
    {link: "/news", text: "News Fetcher", component: NewsFetcher},
    {link: "/state", text: "State", component: State},
    {link: "/selecting", text: "Selecting", component: Selecting},
];

const SearchBar = ({ query, setQuery }: ISearchBarProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <DebounceInput value={query} debounceTimeout={250} onChange={handleChange} placeholder="Enter query" />
    );
};

const DefaultPlaceholder = () => {
    return (
        <div className="placeholder">Select the component from list above</div>
    );
};

const NoComponentsPlaceholder = () => {
    return (
        <div className="placeholder">No components found</div>
    );
};

const Chapter = React.memo(({ link, text }: IChapterProps) => <Link to={link}>{text}</Link>);

const Contents = () => {
    const [query, setQuery] = useState("");

    const chapters = useMemo(() => CHAPTERS.filter(({ text }) => text.includes(query)).map(({ component, ...rest }) => (
        <li key={rest.link}><Chapter {...rest} /></li>
    )), [query]);

    const elements = React.useMemo(() => CHAPTERS.map(({ component: Component, link }) => (
        <Route key={link} path={link} element={<Component />}  />
    )), []);

    return (
        <div className="container">
            <div className="panel">
                <SearchBar query={query} setQuery={setQuery} />
            </div>
            <div className="items-list">
                <nav>
                    <ul>
                        {chapters.length ? chapters : <NoComponentsPlaceholder />}
                    </ul>
                </nav>
            </div>
            <div className="content">
                <Routes>
                    {elements}
                    <Route path="*" element={<DefaultPlaceholder />}></Route>
                </Routes>
            </div>
        </div>
    );
};

export default Contents;