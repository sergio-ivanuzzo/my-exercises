import React, {Suspense, useState} from "react";
import styles from "./index.module.css";
import {ApolloError, gql, useMutation, useQuery} from "@apollo/client";

export interface IUser {
    id: string;
    name: string;
    age: number;
    role: string;
}

interface IFormProps {
    addUser: (user: FormUser) => void;
}

type FormUser = Omit<IUser, "id">;

const DEFAULT_USER: FormUser = { name: "", age: 0, role: "" };

const Form = ({ addUser }: IFormProps) => {
    const [user, setUser] = useState<FormUser>(DEFAULT_USER);

    const handleChange = (field: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            let value: string | number = e.target.value;
            if (field === "age" || field === "level") {
                value = parseInt(value) || 0;
            }
            setUser({ ...user, [field]: value });
        };
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addUser({...user, role: user.role.toUpperCase()});
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <fieldset>
                <legend>Create User</legend>
                <div>
                    <label>
                        <span>Name</span>
                        <input type="text" value={user.name} placeholder="Enter name" onChange={handleChange("name")}/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Age</span>
                        <input type="number" value={user.age} placeholder="Enter age" onChange={handleChange("age")}/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Role</span>
                        <input type="text" value={user.role} placeholder="Enter role" onChange={handleChange("role")}/>
                    </label>
                </div>
                <div>
                    <button type="submit">Create</button>
                </div>
            </fieldset>
        </form>
    );
};

interface IUserTableProps {
    users: IUser[];
    editUser: (user: IUser) => void;
    removeUser: (id: string) => void;
}

export const UserTable = ({ users, editUser, removeUser }: IUserTableProps) => {
    const handleEdit = (user: IUser) => editUser({
        ...user,
        name: "UPDATED"
    });

    const userElements = users.map(user => (
        <tr key={user.id} onClick={() => handleEdit(user)} onContextMenu={() => removeUser(user.id)}>
            <td data-testid="td-name">{user.name}</td>
            <td data-testid="td-age">{user.age}</td>
            <td data-testid="td-role">{user.role}</td>
        </tr>
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

export const EXT_USERS_QUERY = gql`
    {
      oddUsers {
        ...fields
      },
      evenUsers {
        ...fields
      }
    }
    
    fragment fields on User {
        id, name, age, role
    }
`;

export const CREATE_USER_MUTATION = gql`
    mutation createUser($input: CreateUserInput!) {
        newUser(input: $input) {
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

export interface IQueryProps {
    data?: { users: IUser[] },
    loading: boolean,
    error?: ApolloError,
}

const Container = () => {
    const queryResponse: IQueryProps = useQuery(USERS_QUERY);
    const extQueryResponse: IQueryProps = useQuery(EXT_USERS_QUERY);

    console.log(extQueryResponse.data);

    const [createUser, createMutationResponse] = useMutation(CREATE_USER_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }]
    });

    const [updateUser, updateMutationResponse] = useMutation(UPDATE_USER_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }]
    });

    const [deleteUser, deleteMutationResponse] = useMutation(DELETE_USER_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }]
    });

    if (queryResponse.loading
        || createMutationResponse.loading
        || updateMutationResponse.loading
        || deleteMutationResponse.loading
    ) {
        return <div>Loading...</div>
    }

    if (queryResponse.error) {
        console.error(JSON.stringify(queryResponse.error, null, 2));
        return <div>{`Query Response error: ${queryResponse.error}`}</div>
    }

    if (createMutationResponse.error) {
        console.error(JSON.stringify(createMutationResponse.error, null, 2));
        return <div>{`Create Mutation Response error: ${createMutationResponse.error}`}</div>
    }

    if (updateMutationResponse.error) {
        console.error(JSON.stringify(updateMutationResponse.error, null, 2));
        return <div>{`Update Mutation Response error: ${updateMutationResponse.error}`}</div>
    }

    if (deleteMutationResponse.error) {
        console.error(JSON.stringify(deleteMutationResponse.error, null, 2));
        return <div>{`Delete Mutation Response error: ${deleteMutationResponse.error}`}</div>
    }

    const users = queryResponse.data?.users ?? [];

    const addUser = async (user: FormUser) => {
        await createUser({ variables: { input: { ...user } } })
    };

    const editUser = async ({ id, name, age, role }: IUser) => {
        await updateUser({ variables: { id, input: { name, age, role } } })
    };

    const removeUser = async(id: string) => {
        await deleteUser({ variables: { id } });
    }

    return (
        <>
            <Form addUser={addUser} />
            <UserTable users={users} editUser={editUser} removeUser={removeUser} />
        </>
    );
};

export default Container;