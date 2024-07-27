import {render, screen, waitFor, act} from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewMe from "../Proj0";
import userEvent from "@testing-library/user-event";
import Contents from "../Proj2";
import {BrowserRouter} from "react-router-dom";

const setup = async () => {
    const user = userEvent.setup({ delay: 250 });
    render(<ReviewMe />);
    const input = await screen.findByPlaceholderText("Enter a new task");
    const button = await screen.findByText("Add Task");

    return { input, button, user };
};

// timeout (2nd param) is added for this test, bc of this is long-running test
test("task creation on enter and mouse click", async () => {
    const TEST_VALUE = "task text";
    const TEST_VALUE2 = "task text2";
    const { input, button, user } = await setup();

    expect(input).toHaveValue("");

    await act(async () => {
        await user.type(input, TEST_VALUE);
    });
    await waitFor(() => {
        expect(input).toHaveValue(TEST_VALUE)
    });

    const title = screen.getByText("Proj0");
    expect(title).toBeInTheDocument();

    await act(async () => {
        await user.keyboard("{enter}");
        // await user.click(button);
    });
    const addedTask = screen.getByText(TEST_VALUE);
    expect(addedTask).toBeInTheDocument();
    await waitFor(() => {
        expect(input).toHaveValue("");
    });

    // on mouse click
    await act(async () => {
        await user.type(input, TEST_VALUE2);
    });
    await waitFor(() => {
        expect(input).toHaveValue(TEST_VALUE2)
    });

    await act(async () => {
        await user.click(button);
    });
    const addedTask2 = screen.getByText(TEST_VALUE2);
    expect(addedTask2).toBeInTheDocument();
    await waitFor(() => {
        expect(input).toHaveValue("");
    });

    const counter = screen.getByText("Total Tasks: 2");
    expect(counter).toBeInTheDocument();
}, 10000);

test("full path from link click to component", async() => {
    const user = userEvent.setup();

    // attention! wrap into router is required (same as in react code), otherwise test error happens
    render(
        <BrowserRouter>
            <Contents />
        </BrowserRouter>
    );

    const link = await screen.findByText(/with own debounce/i);
    expect(link).toBeInTheDocument();

    // queryBy returns null so it is useful to check if smth not in doc
    let title = screen.queryByText("Proj0");
    expect(title).not.toBeInTheDocument();

    await act(async () => {
        await user.click(link);
    });

    title = screen.queryByText("Proj0");
    expect(title).toBeInTheDocument()
});