import React, {useEffect, useState} from "react";
import styles from "./index.module.css"
import useDebounce from "../Proj0/hooks";

const URL = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

interface IWeatherAPIResponse {
    clouds: { all: number },
    coord: { lat: number, lon: number },
    main: {
        sea_level: number,
        humidity: number,
        temp: number,
        temp_max: number,
        temp_min: number,
        pressure: number,
    },
    name: string,
    timezone: number,
    weather: Array<{
        description: string,
        icon: string,
        id: number,
        main: string,
    }>,
    wind: {
        deg: number,
        speed: number,
    }
}

async function fetchWeather(
    options: { latitude?: number, longitude?: number, city?: string }
): Promise<IWeatherAPIResponse | never> {
    let response;

    if (options.city) {
        console.log("Fetching weather on", `${URL}&q=${options.city}`);
        response = await fetch(`${URL}&q=${options.city}`);
    } else if (options.latitude && options.longitude) {
        console.log("Fetching weather on", `${URL}&lat=${options.latitude}&lon=${options.longitude}`);
        response = await fetch(`${URL}&lat=${options.latitude}&lon=${options.longitude}`);
    } else {
        throw new Error("Incorrect parameters");
    }

    return await response.json();
}

interface IWeatherDisplayProps {
    city?: string;
}

const WeatherDisplay = ({ city }: IWeatherDisplayProps) => {
    const [error, setError] = useState("");
    const [response, setResponse] = useState<IWeatherAPIResponse>();

    const handleResponse = (newResponse: IWeatherAPIResponse) => {
        console.log({newResponse});
        setResponse(newResponse);
    };

    const handleError = (error: unknown) => {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError(`Error: ${error}`);
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather({latitude, longitude}).then(handleResponse).catch(handleError);
            },
            (err) => {
                setError(`Unable to get the position, reason: ${err}`);
            },
        );
    }, []);

    useEffect(() => {
        if (city) {
            fetchWeather({ city }).then(handleResponse).catch(handleError);
        }
    }, [city]);

    const isEmpty = !response?.weather && !response?.name && !response?.wind;

    return (
        <>
            {error && (<div className={styles.error}>{error}</div>)}
            {!error && !isEmpty && (
                <div>
                    <div>Weather: {response.weather?.[0]?.main ?? ""} in {response?.name ?? ""}</div>
                    <div>{response?.wind?.speed}</div>
                    <div>{response?.main?.pressure}</div>
                </div>
            )}
        </>
    );
};

export const WeatherWithSearch = () => {
    const [city, setCity] = useState("");
    const [inputValue, setValue] = useState("");

    const debouncedChange = useDebounce((value: string) => {
        setCity(value);
    }, 250);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedChange(e.target.value);
        setValue(e.target.value);
    };

    return (
        <>
            <input type="text" value={inputValue} onChange={handleChange} />
            <WeatherDisplay city={city} />
        </>
    );
};

export default WeatherDisplay;