import React, {useState} from "react";
import useDebounce from "../Proj0/hooks";
import styles from "./index.module.css";

const METADATA: { [key: string]: number } = {
    "EUR_USD": 1.1,
    "USD_EUR": 0.91,
}

const CurrencyConverter = () => {
    const [data, setData] = useState({ from: "EUR", value: 0, to: "USD" });
    const [inputValue, setInputValue] = useState("");
    const [isDirty, markDirty] = useState(false);

    const debouncedInputChange = useDebounce((value: string) => {
        markDirty(true);
        setData({ ...data, value: parseFloat(value) });
    }, 250);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedInputChange(e.target.value);
        setInputValue(e.target.value);
    };

    const handleExchange = () => {
        markDirty(false);
        setInputValue("");
    };

    const handleSwitch = () => {
        if (data.from === "EUR") {
            setData({ ...data, from: "USD", to: "EUR" });
        } else {
            setData({ ...data, from: "EUR", to: "USD" });
        }
    };

    const showValue = !isDirty && !!data.value;

    return (
        <div className={styles.container}>
            <label>
                <span>{data.from}</span>
                <input type="text" value={inputValue} onChange={handleInputChange}/>
            </label>
            <button onClick={handleSwitch}>{`${data.from} TO ${data.to}`}</button>
            <button onClick={handleExchange}>Exchange</button>
            {showValue && (
                <div className={styles.value}>
                    {data.value * METADATA[`${data.from}_${data.to}`]}
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;