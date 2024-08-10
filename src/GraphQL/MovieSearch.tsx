import React, {useState} from "react";
import {ApolloError, gql, useQuery} from "@apollo/client";
import useDebounce from "../Proj0/hooks";

const MOVIE_QUERY = gql`
    query GetOMDBMoviesByQuery($query: String!) {
      movies(query: $query) {
        Title,
        Year,
        imdbID
      }
    }
`;

interface IMovie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

interface IQueryProps {
    data?: { movies: IMovie[] };
    loading: boolean;
    error?: ApolloError;
}

interface IMoviesListProps {
    movies: IMovie[];
}

interface IMovieItemProps {
    movie: IMovie;
}

const MovieItem = ({ movie }: IMovieItemProps) => {
    return (
        <div>
            <div>{movie.Title}</div>
            <div><img src={movie.Poster} alt=""/></div>
        </div>
    );
};

const MoviesList = ({ movies }: IMoviesListProps) => {
    return (
        <>
            {movies.map(movie => (
                <MovieItem key={movie.imdbID} movie={movie} />
            ))}
        </>
    );
};

export const MovieSearch = () => {
    const [inputValue, setInputValue] = useState("");
    const [query, setQuery] = useState("");
    const movieResponse: IQueryProps = useQuery(MOVIE_QUERY, { variables: { query } });

    const movies = React.useMemo(() => movieResponse.data?.movies ?? [], [movieResponse.data?.movies]);

    const debouncedSetQuery = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), 250);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        debouncedSetQuery(e);
    };

    if (movieResponse.loading) {
        return <div>Loading...</div>
    }

    if (movieResponse.error) {
        console.error(JSON.stringify(movieResponse.error, null, 2));
        return <div>{`Movie Response error: ${movieResponse.error}`}</div>
    }

    return (
        <>
            <input type="text" value={inputValue} onChange={handleChange} />
            <MoviesList movies={movies} />
        </>
    );
};