import React, {useRef, useState} from "react";
import { v4 } from "uuid";
import styles from "./index.module.css";

interface IFormProps {
    setItems: (items: IItem[]) => void;
}

const Form = ({ setItems }: IFormProps) => {
    const [length, setLength] = useState(0);

    return (
        <div>
            <input type="text"
                   placeholder="Enter items amount"
                   value={length}
                   onChange={(e) => setLength(parseInt(e.target.value))}
            />
            <button onClick={() => setItems(Array.from({ length }, () => ({ value: v4() })))}>
                Add Item(s)
            </button>
        </div>
    );
};

interface IItem {
    value: string;
}

const Item = ({ value }: IItem) => {
    return (
        <div data-testid="item">{value}</div>
    );
};

const Container = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsContainerRef = useRef<HTMLDivElement>(null);
    let elements = useRef<Set<HTMLElement>>(new Set());

    const itemsContainer = itemsContainerRef.current as HTMLDivElement;
    let isSelecting = false;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const currentElement = e.target as HTMLElement;
        if (currentElement.tagName.toLowerCase() !== "button") {
            isSelecting = true;
            elements.current.clear();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSelecting) {
            const currentElement = e.target as HTMLElement;
            const tagName = currentElement.tagName.toLowerCase();
            if (tagName === "div" && currentElement !== itemsContainer && itemsContainer.contains(currentElement)) {
                elements.current.add(currentElement);
            }
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        isSelecting = false;
        console.log("SELECTED:", elements.current, "ELEMENTS")
    };

    const itemsElements = items.map(({ value }) => (<Item key={value} value={value.slice(0, 10)} />));

    const addSelection = () => elements.current.forEach(elem => elem.classList.add(styles.selected));
    const resetSelection = () => {
        elements.current.forEach(elem => elem.classList.remove(styles.selected))
        elements.current.clear();
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={styles.container}
            ref={containerRef}
        >
            <Form setItems={setItems} />
            <div className={styles.itemsList} ref={itemsContainerRef} data-testid="items-container">
                {itemsElements}
            </div>
            <button onClick={addSelection}>Add Selection</button>
            <button onClick={resetSelection}>Reset Selection</button>
        </div>
    );
};

export default Container;