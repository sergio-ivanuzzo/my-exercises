import React, {Suspense} from "react";
import {atom, atomFamily, DefaultValue, selector, selectorFamily, useRecoilValue, useSetRecoilState} from "recoil";
import {IQueryProps, IUser} from "../GraphQL";
import {gql} from "@apollo/client";
import {client} from "../index";
import styles from "../GraphQL/index.module.css";

export const USERS_QUERY = gql`
    {
      users {
        id,
        name,
        age,
        role
      }
    }
`;

export const UPDATE_USER_MUTATION = gql`
    mutation updateUser($id: String!, $input: UpdateUserInput!) {
        user(id: $id, input: $input) {
            name,
            age,
            role
        }
    }
`;

export const DELETE_USER_MUTATION = gql`
    mutation deleteUser($id: String!) {
        deleteUser(id: $id)
    }
`;

const usersSelector = selector({
    key: "usersSelector",
    get: async () => {
        const response: IQueryProps = await client.query({
            query: USERS_QUERY,
        });

        return response?.data?.users ?? [];
    },
});

const usersState = atom<IUser[]>({
    key: "usersState",
    default: usersSelector
});

// second param "string" related to user.id which is "string"
const userState = atomFamily<IUser | undefined, string>({
    key: "userState",
});

interface IRowProps {
    user: IUser;
}

const Row = ({ user }: IRowProps) => {
    const setUsersState = useSetRecoilState(usersState);
    const setUserState = useSetRecoilState(userState(user.id));

    const editUser = async () => {
        const response = await client.mutate({
            mutation: UPDATE_USER_MUTATION,
            variables: { id: user.id, input: { name: "UPDATED", age: user.age } }
        });

        React.startTransition(() => {
            const updatedUsers: IUser[] = response?.data?.users ?? [];
            const updatedUser = updatedUsers.find(u => u.id === user.id);

            setUsersState(updatedUsers);

            if (updatedUser) {
                setUserState(updatedUser);
            }
        });

        const usersResponse = await client.query({ query: USERS_QUERY });
        setUsersState(usersResponse?.data?.users ?? []);
    };

    const removeUser = async () => {
        await client.mutate({
            mutation: DELETE_USER_MUTATION,
            variables: { id: user.id },
        });

        const usersResponse = await client.query({ query: USERS_QUERY });
        setUsersState(usersResponse?.data?.users ?? []);
    };

    return (
        <tr key={user.id} onClick={editUser} onContextMenu={removeUser}>
            <td data-testid="td-name">{user.name}</td>
            <td data-testid="td-age">{user.age}</td>
            <td data-testid="td-role">{user.role}</td>
        </tr>
    );
};

interface IUserTableProps {
    users: IUser[];
}

export const UserTable = ({users}: IUserTableProps) => {
    const userElements = users.map(user => (
        <Row user={user} />
    ));

    return (
        <table className={styles.table}>
            <thead>
            <tr>
                <th data-testid="th-name">Name</th>
                <th data-testid="th-age">Age</th>
                <th data-testid="th-role">Role</th>
            </tr>
            </thead>
            <tbody>
            {userElements}
            </tbody>
        </table>
    );
};

export const GraphQLContainer = () => {
    const users = useRecoilValue(usersState) ?? [];

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <UserTable users={users} />
            </Suspense>
        </div>
    );
};