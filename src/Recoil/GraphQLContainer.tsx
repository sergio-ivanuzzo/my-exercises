import React, {Suspense} from "react";
import {atom, selector, useRecoilValue} from "recoil";
import {IQueryProps, IUser, UserTable} from "../GraphQL";
import {gql} from "@apollo/client";
import {client} from "../index";

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

export const GraphQLContainer = () => {
    const users = useRecoilValue(usersState) ?? [];

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <UserTable users={users} editUser={() => {}} removeUser={() => {}} />
            </Suspense>
        </div>
    );
};