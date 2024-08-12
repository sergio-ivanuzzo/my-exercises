import React, {useCallback, useState} from "react";

interface IButtonProps {
    callback: () => void;
    children: React.ReactNode;
}

const Button = React.memo(({ callback, children }: IButtonProps) => {
    console.log("render");
    return (
        <button onClick={() => callback()}>{children}</button>
    )
});

const Counter = () => {
    const [value, setValue] = useState(0);

    const decrement = useCallback(() => setValue(prevValue => prevValue - 1), []);
    const increment = useCallback(() => setValue(prevValue => prevValue + 1), []);

    return (
        <>
            <span>{value}</span>
            <Button callback={decrement}>-1</Button>
            <Button callback={increment}>+1</Button>
        </>
    );
};

export default Counter;