import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TableContainer, {IRow, Order, SortableTable, sortItemsByField} from "./index";

const setup = () => {
    const user = userEvent.setup();
    render(<TableContainer />);

    return { user };
};

describe("test items adding", () => {
    const mockItems = [
        {name: "name1", age: "123", role: "role1", level: "80"},
        {name: "name2", age: "321", role: "role2", level: "81"},
    ];

    test("should add 2 items", async () => {
        const {user} = setup();

        const inputName = screen.getByTestId("input-name");
        const ageName = screen.getByTestId("input-age");
        const roleName = screen.getByTestId("input-role");
        const levelName = screen.getByTestId("input-level");
        const addButton = screen.getByText("Add Row");

        await act(async () => {
            await user.type(inputName, mockItems[0].name);
            await user.type(ageName, mockItems[0].age);
            await user.type(roleName, mockItems[0].role);
            await user.type(levelName, mockItems[0].level);
            await user.click(addButton);
        });

        await act(async () => {
            await user.type(inputName, mockItems[1].name);
            await user.type(ageName, mockItems[1].age);
            await user.type(roleName, mockItems[1].role);
            await user.type(levelName, mockItems[1].level);
            await user.click(addButton);
        });

        await waitFor(() => {
            expect(screen.getByText(mockItems[0].name)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(mockItems[1].name)).toBeInTheDocument();
        });
    });
});

describe("test sorting", () => {
    const mockItems = [
        {name: "name1", age: 1, role: "role1", level: 80},
        {name: "name2", age: 2, role: "role2", level: 1},
        {name: "name3", age: 3, role: "role3", level: 2},
        {name: "name4", age: 4, role: "role4", level: 83},
        {name: "name5", age: 5, role: "role5", level: 4},
        {name: "name6", age: 6, role: "role6", level: 185},
    ];

    const setup = () => {
        const user = userEvent.setup();

        render(
            <SortableTable
                rows={mockItems}
                sortByField={(field: keyof IRow, order: Order) => sortItemsByField(mockItems)(field, order)}
            />
        );

        return {user}
    };

    test("should sort table by name ASC", async () => {
        const FIELD = "name";
        const ORDER = "asc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by name DESC", async () => {
        const FIELD = "name";
        const ORDER = "desc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by age ASC", async () => {
        const FIELD = "age";
        const ORDER = "asc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by age DESC", async () => {
        const FIELD = "age";
        const ORDER = "desc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by role ASC", async () => {
        const FIELD = "role";
        const ORDER = "asc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by role DESC", async () => {
        const FIELD = "role";
        const ORDER = "desc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by level ASC", async () => {
        const FIELD = "level";
        const ORDER = "asc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
    test("should sort table by level DESC", async () => {
        const FIELD = "level";
        const ORDER = "desc";

        const {user} = setup();
        const th = screen.getByTestId(`th-${FIELD}`);
        await act(async () => {
            await user.click(th);
        });
        const sortedNameValues = screen.getAllByTestId(`td-${FIELD}`).map(td => td.innerHTML).join(",");
        await waitFor(() => {
            expect(sortedNameValues).toBe(sortItemsByField(mockItems)(FIELD, ORDER).map(item => item[FIELD]).join(","))
        });
    });
});