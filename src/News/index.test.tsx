import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

import NewsFetcher, {IArticle} from "./index";

const MOCK_ARTICLES: Partial<IArticle>[] = Array.from({ length: 20 }, (_, index) => ({
    author: `Author-${index}`,
    description: `Description-${index}`,
    title: `Title-${index}`,
    urlToImage: "",
}));

beforeEach(() => {
    global.fetch = jest.fn(
        (url) => {
            const page = new URL(url).searchParams.get("page") || "1";
            const pageSize = new URL(url).searchParams.get("pageSize") || "10";
            const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
            const endIndex = startIndex + parseInt(pageSize);

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ articles: MOCK_ARTICLES.slice(startIndex, endIndex) }),
            })
        }
    ) as jest.Mock;
});

const setup = async () => {
    let utils = render(<NewsFetcher />);

    return { ...utils };
};

test("should call fetchData", async() => {
    await setup();
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});

test("should articles be loaded", async() => {
    await setup();
    await waitFor(() => {
        expect(screen.getByText(MOCK_ARTICLES[0].title ?? "")).toBeInTheDocument();
    });
    await waitFor(() => {
        expect(screen.getByText(MOCK_ARTICLES[9].title ?? "")).toBeInTheDocument();
    });
});

test("should extra articles be loaded on scroll", async() => {
    const {container} = await setup();
    await waitFor(() => {
        expect(screen.getByText(MOCK_ARTICLES[0].title ?? "")).toBeInTheDocument();
    });
    await waitFor(() => {
        expect(screen.getByText(MOCK_ARTICLES[9].title ?? "")).toBeInTheDocument();
    });

    fireEvent.scroll(window, { target: { scrollY: container.scrollHeight } });

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
        expect(screen.getByText(MOCK_ARTICLES[19].title ?? "")).toBeInTheDocument();
    });
});