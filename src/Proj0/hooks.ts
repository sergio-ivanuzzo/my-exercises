import React from "react";

const useDebounce = (fn: Function, delay: number) => {
    let timeoutID = React.useRef<NodeJS.Timeout>();

    return React.useCallback((...args: unknown[]) => {
        if (timeoutID.current) clearTimeout(timeoutID.current);
        timeoutID.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
};

export default useDebounce;