import React, {useState} from "react";
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
}

const UserTable = ({ users }: IUserTableProps) => {
    const userElements = users.map(user => (
        <tr key={user.id}>
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
    query getUsers {
      users {
        id,
        name,
        age,
        role
      }
    }
`;

export const CREATE_USER_MUTATION = gql`
    mutation createUser($input: UserInput!) {
        user(input: $input) {
            name,
            age,
            role
        }
    }
`;

interface IProps {
    data?: { users: IUser[] },
    loading: boolean,
    error?: ApolloError,
}

const Container = () => {
    const queryResponse: IProps = useQuery(USERS_QUERY);
    const [createUser, mutationResponse] = useMutation(CREATE_USER_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }]
    });

    if (queryResponse.loading || mutationResponse.loading) {
        return <div>Loading...</div>
    }

    if (queryResponse.error) {
        console.error(JSON.stringify(queryResponse.error, null, 2));
        return <div>{`Query Response error: ${queryResponse.error}`}</div>
    }

    if (mutationResponse.error) {
        console.error(JSON.stringify(mutationResponse.error, null, 2));
        return <div>{`Mutation Response error: ${mutationResponse.error}`}</div>
    }

    const users = queryResponse.data?.users ?? [];

    const addUser = async (user: FormUser) => {
        await createUser({ variables: { input: { ...user } } })
    };

    return (
        <>
            <Form addUser={addUser} />
            <UserTable users={users} />
        </>
    );
};

export default Container;