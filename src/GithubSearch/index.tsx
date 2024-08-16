import React, {useEffect, useState} from "react";
import useDebounce from "../Proj0/hooks";

interface IGithubResponse {
    login: string;
    name: string;
    public_repos: number;
    followers: number;
    avatar_url: string;
    type: string;
}

async function fetchUser(username: string): Promise<IGithubResponse> {
    let response = await fetch(`https://api.github.com/users/${username}`);
    return await response.json();
}

const GithubSearch = () => {
    const [inputValue, setInputValue] = useState("");
    const [username, setUsername] = useState<string>("");
    const [response, setResponse] = useState<IGithubResponse>();

    const handleResponse = (newResponse: IGithubResponse) => {
        console.log({newResponse});
        setResponse(newResponse);
    };

    useEffect(() => {
        if (username) {
            fetchUser(username).then(handleResponse);
        }
    }, [username]);

    const debouncedSetUsername = useDebounce((username: string) => {
        setUsername(username);
    }, 250);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        debouncedSetUsername(e.target.value);
    };

    return (
        <>
            <input type="text" value={inputValue} onChange={handleChange} />
            {response?.login && (
                <div>
                    <div>Login: {response?.login}</div>
                    <div>Name: {response?.name}</div>
                    <div>Repos: {response?.public_repos}</div>
                    <div><img src={response?.avatar_url} alt="avatar"/></div>
                    <div>Followers: {response?.followers}</div>
                    <div>This is {response.type}</div>
                </div>
            )}
        </>
    );
};

export default GithubSearch;