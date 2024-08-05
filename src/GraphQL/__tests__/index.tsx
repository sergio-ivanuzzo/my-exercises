import {act, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Container, {USERS_QUERY, IUser, CREATE_USER_MUTATION} from "../index";
import {MockedProvider} from "@apollo/client/testing";

const MOCK_USERS: IUser[] = [
    { id: "1", name: "Alex", age: 22, role: "USER" },
    { id: "2", name: "Tanya", age: 21, role: "USER" },
    { id: "3", name: "Masha", age: 23, role: "MODERATOR" },
    { id: "4", name: "Sveta", age: 22, role: "USER" },
    { id: "5", name: "Bot", age: 0, role: "ADMIN" },
];

const CREATED_USER: Omit<IUser, "id"> = {
    // id: "6",
    name: "Test",
    age: 123,
    role: "USER"
}

let queryCalled = false;

const mocks = [
    {
        request: {
            query: USERS_QUERY,
        },
        result: {
            data: {
                users: MOCK_USERS,
            }
        }
    },
    {
        request: {
            query: CREATE_USER_MUTATION,
            variables: {
                input: { ...CREATED_USER }
            }
        },
        result: {
            data: {
                user: CREATED_USER
            },
        }
    }
];

const setup = () => {
    const user = userEvent.setup();
    render(
        <MockedProvider mocks={mocks}>
            <Container />
        </MockedProvider>
    );

    return { user };
};

test("should return users", async () => {
    setup();

    await waitFor(() => {
        const items = screen.getAllByTestId("td-name").map(item => item.innerHTML).join(",");
        expect(items).toBe(MOCK_USERS.map(user => user.name).join(","));
    })
});