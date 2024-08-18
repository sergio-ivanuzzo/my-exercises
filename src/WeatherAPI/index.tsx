import React, {useEffect, useState} from "react";
import styles from "./index.module.css"

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

async function fetchWeather(latitude: number, longitude: number): Promise<IWeatherAPIResponse> {
    console.log("Fetching weather on", `${URL}&lat=${latitude}&lon=${longitude}`);
    let response = await fetch(`${URL}&lat=${latitude}&lon=${longitude}`);
    return await response.json();
}

const WeatherDisplay = () => {
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
                fetchWeather(latitude, longitude).then(handleResponse).catch(handleError);
            },
            (err) => {
                setError(`Unable to get the position, reason: ${err}`);
            },
        );
    }, []);
    return (
        <>
            {error && (<div className={styles.error}>{error}</div>)}
            {!error && response && (
                <div>
                    <div>Weather: {response.weather[0].main} in {response.name}</div>
                    <div>{response.wind.speed}</div>
                    <div>{response.main.pressure}</div>
                </div>
            )}
        </>
    );
};

export default WeatherDisplay;