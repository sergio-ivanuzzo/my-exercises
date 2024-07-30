import React, {useCallback, useEffect, useRef, useState} from "react";
import { v4 } from "uuid";

interface IItem {
    key: string;
    value: string;
}

interface IItemProps {
    children: React.ReactNode;
}


interface IFormProps {
    addItem: () => void;
    asyncAddItem: () => void;
    addNItems: (value: number) => void;
}

const Item = React.memo(({ children }: IItemProps) => {
    console.log("ITEM RENDER");

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            console.log(element.clientWidth);
        }
    }, []);

    return (
        <div ref={ref}>{children}</div>
    );
});

const Form = React.memo(({ addItem, addNItems, asyncAddItem }: IFormProps) => {
    console.log("FORM RENDER");

    const [itemsCount, setItemsCount] = useState(0);

    return (
        <>
            <div>
                <button onClick={addItem}>Add Item</button>
            </div>
            <div>
                <button onClick={asyncAddItem}>Add Item Async</button>
            </div>
            <div>
                <input type="text" value={itemsCount} onChange={(e) => setItemsCount(+e.target.value)}/>
                <button onClick={() => addNItems(itemsCount)}>Add {itemsCount} Item(s)</button>
            </div>
        </>
    );
});

// useMemo in same component takes no advantage
const State = () => {
    console.log("STATE RENDER");

    const [items, setItems] = useState<IItem[]>([]);

    const addItem = useCallback(() => {
        let newItem: IItem = {
            key: v4(),
            value: v4(),
        };

        setItems([...items, newItem])
    }, [items]);

    // this: setItems([...items, newItem]) -> will not work as expected bc of stale state
    // const asyncAddItem = useCallback(() => {
    //     setTimeout(() => {
    //         console.log("CLICKED:", items);
    //         let newItem: IItem = {
    //             key: v4(),
    //             value: v4(),
    //         };
    //
    //         setItems([...items, newItem])
    //     }, 500);
    // }, [items]);

    // this approach prevents stale state
    const asyncAddItem = useCallback(() => {
        setTimeout(() => {
            let newItem: IItem = {
                key: v4(),
                value: v4(),
            };

            setItems(prevItems => [...prevItems, newItem])
        }, 500);
    }, []);

    const addNItems = useCallback((itemsCount: number) => {
        if (itemsCount > 5000) {
            return;
        }

        let newItems: IItem[] = Array.from({ length: itemsCount }, () => ({
            key: v4(),
            value: v4(),
        }));

        setItems([...items, ...newItems])

        // setItems(prevItems => [...prevItems, ...newItems])
    }, []);

    const itemsElements = items.map(({ key, value }) => (<Item key={key}>{value}</Item>));

    return (
        <div>
            <div>
                {itemsElements}
            </div>
            <Form addItem={addItem} addNItems={addNItems} asyncAddItem={asyncAddItem} />
        </div>
    );
};

const Container = () => {
    console.log("CONTAINER RENDER");

    return (
        <div>
            <div>Container for State Component</div>
            <p>This Component is created to test re-render</p>
            <State />
        </div>
    );
}

export default Container;