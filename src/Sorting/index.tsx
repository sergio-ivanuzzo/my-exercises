import React, {useCallback, useState} from "react";
import styles from "./index.module.css";
import {v4} from "uuid";

export type Order = "asc" | "desc";

export interface IRow {
    name: string;
    age: number;
    role: string;
    level: number;
}

type IOrder = Record<keyof IRow, Order>;

interface IFormProps {
    addRow: (row: IRow) => void;
}

interface ISortableTableProps {
    rows: IRow[];
    sortByField: (field: keyof IRow, order: Order) => void;
}

const defaultRow = { name: "", age: 0, role: "", level: 0 };

const Form = ({ addRow }: IFormProps) => {
    const [row, setRow] = useState<IRow>(defaultRow);

    const handleChange = (field: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            let value: string | number = e.target.value;
            if (field === "age" || field === "level") {
                value = parseInt(value) || 0;
            }
            setRow({ ...row, [field]: value });
        };
    };

    const handleAdd = () => {
        addRow(row);
        setRow(defaultRow);
    }

    return (
        <div>
            <input data-testid="input-name" type="text" value={row?.name} onChange={handleChange("name")} />
            <input data-testid="input-age" type="number" value={row?.age} onChange={handleChange("age")} />
            <input data-testid="input-role" type="text" value={row?.role} onChange={handleChange("role")} />
            <input data-testid="input-level" type="number" value={row?.level} onChange={handleChange("level")} />
            <button onClick={() => handleAdd()}>Add Row</button>
        </div>
    );
};

export const SortableTable = ({ rows, sortByField }: ISortableTableProps) => {
    const [order, setOrder] = useState<IOrder>({ name: "asc", age: "asc", role: "asc", level: "asc" });

    const rowsElements = rows.map(row => (
        <tr key={v4()}>
            <td data-testid="td-name">{row.name}</td>
            <td data-testid="td-age">{row.age}</td>
            <td data-testid="td-role">{row.role}</td>
            <td data-testid="td-level">{row.level}</td>
        </tr>
    ));

    const handleSort = (field: keyof IOrder) => {
        const newOrder: Order = order[field] === "asc" ? "desc" : "asc";
        sortByField(field, newOrder);
        setOrder({ ...order, [field]: newOrder });
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th data-testid="th-name" onClick={() => handleSort("name")}>name</th>
                    <th data-testid="th-age" onClick={() => handleSort("age")}>age</th>
                    <th data-testid="th-role" onClick={() => handleSort("role")}>role</th>
                    <th data-testid="th-level" onClick={() => handleSort("level")}>level</th>
                </tr>
            </thead>
            <tbody>
                {rowsElements}
            </tbody>
        </table>
    );
};

export const sortItemsByField = <T extends unknown>(items: T[]) => (field: keyof T, order: Order): T[] => {
    return items.sort((a: T, b: T) => {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        else if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        else return 0;
    });
};

const Container = () => {
    const [rows, setRows] = useState<IRow[]>([]);

    const addRow = useCallback((newRow: IRow) => setRows(prevRows => [...prevRows, newRow]), []);
    const sortByField = useCallback((field: keyof IRow, order: Order) => {
        setRows(prevRows => sortItemsByField(prevRows)(field, order));
    }, []);

    return (
        <>
            <Form addRow={addRow} />
            <SortableTable rows={rows} sortByField={sortByField} />
        </>
    );
};

export default Container;