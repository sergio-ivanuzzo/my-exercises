import React, {useCallback, useEffect, useRef, useState} from "react";
import {v4} from "uuid";

interface IItemProps {
    value: string;
    updateItem?: (oldValue: string, newValue: string) => void;
}

const Item = React.memo(({ value, updateItem }: IItemProps) => {
    const [counter, setCounter] = useState(1);
    console.log("render:", value);

    // component will trigger this each time key prop is changed
    useEffect(() => {
        console.log("mounted", value);

        return () => {
            console.log("unmounted", value);
        };
    }, [value]);

    const handleClick = () => {
        updateItem && updateItem(value, `${value}${counter}`);
        setCounter(counter + 1);
    };

    return (
        <div onClick={handleClick}>{value}</div>
    );
});

const Container = () => {
    const [items, setItems] = useState(["a", "b", "c", "d", "e"]);
    const [flag, setFlag] = useState(false);
    const ref = useRef<string>("TEST");

    const updateItem = useCallback((oldValue: string, newValue: string) => {
        setItems(prevItems => {
            let index = prevItems.findIndex(item => item === oldValue);
            return [
                ...prevItems.slice(0, index),
                newValue,
                ...prevItems.slice(index + 1)
            ];
        });
    }, []);

    // if Item in list has non-unique key, starting from affected item all next items
    // also will be re-rendered on this fn call
    const addItem = useCallback(() => {
        setItems([
            ...items.slice(0, 3),
            "TEST",
            ...items.slice(3)
        ]);
    }, [items]);

    const handleRefresh = () => setFlag(!flag);
    const handleValueChange = () => {
        ref.current = v4();
        console.log(ref.current);
    };

    // pass () => {} instead of undefined will trigger re-render on each Container update
    return (
        <>
            <div>
                Test Update: <Item key={`${flag}`} value={ref.current} updateItem={undefined} />
            </div>
            <div>
                <button onClick={handleValueChange}>Change Value</button>
                <button onClick={handleRefresh}>Refresh Item</button>
                <button onClick={addItem}>Add Item</button>
            </div>
            {items.map(item => (
                <Item key={item} value={item} updateItem={updateItem} />
            ))}
        </>
    );
};

export default Container;