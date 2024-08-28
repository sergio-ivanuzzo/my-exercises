import React from "react";
import {createMachine} from "xstate";
import styles from "./index.module.css";
import {useMachine} from "@xstate/react";

enum Light {
    GREEN = "green",
    YELLOW = "yellow",
    RED = "red",
};

const lightMachine = createMachine({
    id: "light",
    initial: Light.GREEN,
    states: {
        [Light.GREEN]: {
            on: {
                TIMER: Light.YELLOW,
            }
        },
        [Light.YELLOW]: {
            on: {
                TIMER: Light.RED,
            }
        },
        [Light.RED]: {
            on: {
                TIMER: Light.GREEN,
            }
        },
    },
});

const Container = () => {
    const [state, send] = useMachine(lightMachine);
    console.log(state.value)
    return (
        <>
            <div>
                <button onClick={() => send({ type: "TIMER" })}>Change</button>
            </div>
            <div className={styles.container}>
                <div className={state.value === Light.GREEN ? styles.green : ""}>1</div>
                <div className={state.value === Light.YELLOW ? styles.yellow : ""}>2</div>
                <div className={state.value === Light.RED ? styles.red : ""}>3</div>
            </div>
        </>
    );
};

export default Container;