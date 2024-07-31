import {act, render, screen, waitFor} from "@testing-library/react";
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
    const { default: Container } = await import("./index");
    render(<Container />);

    return { user };
};

// https://github.com/jestjs/jest/issues/8987
describe("test iterator", () => {
    test("should generate correct unique value", () => {
        jest.isolateModules(() => {
            const { v4 } = require('uuid');

            expect(v4()).toBe(TEST_UUIDS[0]);
            expect(v4()).toBe(TEST_UUIDS[1]);
        })
    });

    test("should generate correct unique value(2)", () => {
        jest.isolateModules(() => {
            const { v4 } = require('uuid');

            expect(v4()).toBe(TEST_UUIDS[0]);
            expect(v4()).toBe(TEST_UUIDS[1]);
        })
    });
})

describe("test component", () => {
    test("should add items", async() => {
        const { user } = await setup();

        let button = screen.getByText("Add Item");
        await act(async () => {
            await user.click(button);
        });

        // from the code: 1 - for key, 1 - for value
        expect(mockV4).toHaveBeenCalledTimes(2);

        await waitFor(() => {
            const element = screen.getByText(TEST_UUIDS[1]);
            expect(element).toBeInTheDocument();
        })
    });
})