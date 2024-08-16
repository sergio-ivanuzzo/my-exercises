import React, {useState} from "react";

const ColorButton = () => {
    const [background, setBackground] = useState("white");

    return (
        <button
            onClick={() => setBackground('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'))}
            style={{ background }}>
            Click Me
        </button>
    );
};

export default ColorButton;