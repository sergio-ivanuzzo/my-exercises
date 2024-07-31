import React from "react";
import useDebounce from "./hooks";
import styles from "./index.module.css";

const SPECIAL_KEYS = [
    "Shift", "Control", "Escape", "Delete", "Home", "End",
    "Insert", "PageDown", "PageUp", "CapsLock", "Tab"
];

interface IIconProps {
    width: number | string,
    height: number | string,
}

interface Task {
    id: number,
    text: string,
}

const Icon = ({ width = "100%", height = "100%" }: Partial<IIconProps>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
            <circle cx="4" cy="12" r="3" fill="currentColor">
                <animate id="svgSpinners3DotsFade0" fill="freeze" attributeName="opacity"
                         begin="0;svgSpinners3DotsFade1.end-0.25s" dur="0.75s" values="1;0.2"/>
            </circle>
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4">
                <animate fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.15s" dur="0.75s"
                         values="1;0.2"/>
            </circle>
            <circle cx="20" cy="12" r="3" fill="currentColor" opacity="0.3">
                <animate id="svgSpinners3DotsFade1" fill="freeze" attributeName="opacity"
                         begin="svgSpinners3DotsFade0.begin+0.3s" dur="0.75s" values="1;0.2"/>
            </circle>
        </svg>
    );
};

const ReviewMe = () => {
    const [taskText, setTaskText] = React.useState("");
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [isTyping, setIsTyping] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (!taskText && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [taskText]);

    const textIsEmpty = React.useMemo(() => taskText.trim() === "", [taskText]);

    const addTask = React.useCallback(() => {
        if (textIsEmpty) return;

        const newTask = { id: tasks.length, text: taskText };
        setTasks([...tasks, newTask]);
        setTaskText("");
        setIsTyping(false);
    }, [textIsEmpty, tasks, taskText]);

    const handleKeydown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") addTask();
        else {
            if (!isTyping && !SPECIAL_KEYS.includes(event.key)) setIsTyping(true);
        }
    };

    const handleChange = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskText(e.target.value);
        setIsTyping(false);
    }, 250);

    return (
        <div onKeyDown={handleKeydown}>
            <div>Proj0</div>
            <div className="input-container">
                <label>
                    <input
                        ref={inputRef}
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter a new task"
                    />
                    {isTyping && <Icon width={20}/>}
                </label>
                <button onClick={addTask} disabled={textIsEmpty}>Add Task</button>
            </div>
            <div>
                {tasks.map((task) => (
                    <div key={task.id}>{task.text}</div>
                ))}
            </div>
            <p>Total Tasks: {tasks.length}</p>
        </div>
    );
};

export default ReviewMe;