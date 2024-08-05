import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const TEST_UUIDS = Array.from({ length: 10 }, (_, i) => `uuid-${i}`);

let mockV4: jest.Mock;

beforeEach(async () => {
    // adding mock_ prefix allows this variable to be used inside jest.mock
    let mockIter = TEST_UUIDS.values();
    mockV4 = jest.fn().mockImplementation(() => mockIter.next().value);

    jest.mock("uuid", () => ({
        v4: mockV4
    }))
});

const setup = async () => {
    const user = userEvent.setup();
    // Container should be imported AFTER uuid was mocked !
    // otherwise it will use origin uuid
    const { default: Container } = await import("../index");
    render(<Container />);

    return {user};
};

test("should add 10 items and then select 2 items", async() => {
    const { user } = await setup();
    const input = screen.getByPlaceholderText("Enter items amount");
    expect(input).toBeInTheDocument();
    await act(async () => {
        await user.type(input, "10");
    });
    const button = screen.getByText("Add Item(s)");
    expect(button).toBeInTheDocument();
    await act(async () => {
        await user.click(button);
    });

    await waitFor(() => {
        expect(screen.getByText(TEST_UUIDS[0])).toBeInTheDocument();
    });
    await waitFor(() => {
        expect(screen.getByText(TEST_UUIDS[9])).toBeInTheDocument();
    });

    const container = screen.getByTestId("items-container");
    let elements = screen.getAllByTestId("item");
    expect(elements.length).toBe(TEST_UUIDS.length);

    fireEvent.mouseDown(container);
    fireEvent.mouseMove(elements[0]);
    fireEvent.mouseMove(elements[1]);
    fireEvent.mouseUp(container);

    const selectionBtn = screen.getByText("Add Selection");
    await act(async () => {
        await user.click(selectionBtn);
    });

    expect(elements.filter(elem => elem.classList.contains("selected")).length).toBe(2);
    const resetBtn = screen.getByText("Reset Selection");
    await act(async () => {
        await user.click(resetBtn);
    });
    expect(elements.filter(elem => elem.classList.contains("selected")).length).toBe(0);
});