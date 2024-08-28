import React, {ChangeEvent, Suspense, useMemo, useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import ReviewMe from "../Proj0";
import ReviewMe2 from "../Proj1";
import "./index.module.css";
import {DebounceInput} from "react-debounce-input";
import State from "../State";
import Selecting from "../Selecting";
import TableContainer from "../Sorting";
import UserTableGraphQL from "../GraphQL";
import {MovieSearch} from "../GraphQL/MovieSearch";
import Counter from "../Counter";
import ColorButton from "../ColorButton";
import Timer from "../Timer";
import GithubSearch from "../GithubSearch";
import WeatherDisplay, {WeatherWithSearch} from "../WeatherAPI";
import CurrencyConverter from "../CurrencyConverter";
import {NewsFetcherWithCategorySelector} from "../News";
import ImageGallery from "../ImageGallery";
import RecoilTask1 from "../Recoil";
import {GraphQLContainer} from "../Recoil/GraphQLContainer";
import KeysContainer from "../Keys";
import Feed from "../Feed";
import StateMachineContainer from "../StateMachine";

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

const LazyFetcher = React.lazy(() => import("../News"));
const LazyContainer = () => <Suspense fallback={<div>Loading...</div>}><LazyFetcher /></Suspense>;

const CHAPTERS: IChapter[] = [
    {link: "/first", text: "ReviewMe with own debounce", component: ReviewMe},
    {link: "/second", text: "ReviewMe with DebouncedInput", component: ReviewMe2},
    {link: "/news", text: "News Fetcher", component: LazyContainer},
    {link: "/state", text: "State", component: State},
    {link: "/selecting", text: "Selecting", component: Selecting},
    {link: "/sorting", text: "Sortable Table", component: TableContainer},
    {link: "/graphql1", text: "UserTable GraphQL", component: UserTableGraphQL},
    {link: "/graphql2", text: "GraphQL Movie Search", component: MovieSearch},
    {link: "/counter", text: "Counter", component: Counter},
    {link: "/colorbutton", text: "ColorButton", component: ColorButton},
    {link: "/timer", text: "Timer with setInterval", component: Timer},
    {link: "/githubsearch", text: "GithubSearch", component: GithubSearch},
    {link: "/weather", text: "WeatherDisplay", component: () => <WeatherDisplay />},
    {link: "/weatherwithsearchandnews", text: "WeatherWithSearch + News", component: () => {
            return (
                <>
                    <WeatherWithSearch />
                    <NewsFetcherWithCategorySelector />
                </>
            );
        }},
    {link: "/currency", text: "CurrencyConverter", component: CurrencyConverter},
    {link: "/imagegallery", text: "ImageGallery", component: ImageGallery},
    {link: "/recoil1", text: "Recoil Task 1", component: RecoilTask1},
    {link: "/recoil2", text: "Users graphql table + recoil", component: GraphQLContainer},
    {link: "/keys", text: "Keys experiments", component: KeysContainer},
    {link: "/feed", text: "Feed", component: Feed},
    {link: "/statemachine1", text: "State Machine with XState: light switcher", component: StateMachineContainer},
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