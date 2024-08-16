import React, {useEffect, useRef, useState} from "react";

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [started, setStarted] = useState(false);
    const timer = useRef<NodeJS.Timer | undefined>();

    useEffect(() => {
        if (seconds > 0 && started) {
            timer.current = setTimeout(() => {
                setSeconds(prevValue => prevValue - 1);
            }, 1000);
        }

        return () => {
            clearTimeout(timer.current);
        };
    }, [seconds, started]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeconds(parseInt(e.target.value));
    };

    return (
        <>
            <span>{seconds}</span>
            <input type="text" value={seconds} onChange={handleChange} />
            <button onClick={() => setStarted(true)}>Start</button>
        </>
    );
};

export default Timer;