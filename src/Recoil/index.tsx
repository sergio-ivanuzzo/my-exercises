import React, {useState} from "react";
import {atom, selector, useRecoilState, useRecoilValue} from "recoil";

const valueState = atom({
    key: "valueState",
    default: ""
});

const valueSelector = selector({
    key: "valueSelector",
    get: ({ get }) => get(valueState),
});

const Form = () => {
    const [inputValue, setInputValue] = useState("");
    const [, setValue] = useRecoilState(valueState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

    const handleClick = () => {
        setValue(inputValue);
        setInputValue("");
    }

    return (
        <div>
            <label>
                <span></span>
                <input type="text" value={inputValue} onChange={handleChange} />
            </label>
            <button onClick={handleClick}>Set New Value</button>
        </div>
    );
};

const ComponentA = () => {
    const value = useRecoilValue(valueSelector);
    return (
        <div>{value}</div>
    );
};
const ComponentB = () => {
    const value = useRecoilValue(valueSelector);
    return (
        <div>{value}</div>
    );
};
const ComponentC = () => {
    const value = useRecoilValue(valueSelector);
    return (
        <div>{value}</div>
    );
};

const Container = () => {
    return (
        <div>
            <Form />
            <ComponentA />
            <ComponentB />
            <ComponentC />
        </div>
    );
};

export default Container;