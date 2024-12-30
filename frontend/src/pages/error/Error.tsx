import { useErrorContext } from "../../components/context/error";
import { useState, useEffect } from "react";
import styles from "./error.module.css";

const notfoundMessages = [
    "Where the page should be, Empty space and missing words— A void in the code.",
    "Welcome, traveler. You've reached a page that doesn't exist, a place where content used to be—or maybe never was. Let's take this moment to pause and reflect.",
    "Where we are, there's only air, A page misplaced, it isn't there. In the void where data fades, Questions linger, answers evade. Not all paths lead where we care.",
    "In the heat of day, The path dissolves to nothing— An empty mirage.",
    "Paths cross empty void, Seeking what once existed- Silence answers all.",
    "Lost in the vast web, Where you sought, there's only void—Nothingness awaits.",
    "The link was a dream, A shadow of what once was— Now, nothing remains.",
];

const chooseRandomMessage = () =>
    notfoundMessages[Math.floor(Math.random() * notfoundMessages.length)];

function Error() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [contentText, setContentText] = useState("");
    const { error } = useErrorContext();

    useEffect(() => {
        if (error === null) {
            setErrorMessage(`404 Not Found:;${chooseRandomMessage()}`);
        } else {
            const errorArray = error?.split(";");
            if (errorArray === undefined) {
                setErrorMessage(`Unknown Type Error:;${error}.`);
            } else if (errorArray[0] === "b") {
                setErrorMessage(`BackendError:;${errorArray[1]}.`);
            } else {
                setErrorMessage(`FrontendError:;${errorArray[1]}.`);
            }
        }
    }, []);

    useEffect(() => {
        if (errorMessage) {
            const content = errorMessage.split(";")[1];
            let i = -1;

            const interval = setInterval(() => {
                if (i < content.length - 1) {
                    setContentText((prev) => prev + content[i]);
                    i++;
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [errorMessage]);

    return (
        <div className={styles.change_container}>
            <div className={styles.alignWrapper}>
                <p className={styles.title}>{errorMessage?.split(";")[0]}</p>
                <p className={styles.content}>{contentText}</p>
            </div>
        </div>
    );
}

export default Error;
