import React, {useEffect, useState} from "react";

const K = 1.1;

const CurrencyConverter = () => {
    const [from, setFrom] = useState(0.0);
    const [to, setTo] = useState(0.0);

    useEffect(() => {
        setTo(K * from);
    }, [from]);

    return (
        <>
            <label>
                <span>USD</span>
                <input type="text" value={from} onChange={(e) => setFrom(+e.target.value)}/>
            </label>
            <label>
                <span>EUR</span>
                <input type="text" value={to}/>
            </label>
        </>
    );
};

export default CurrencyConverter;