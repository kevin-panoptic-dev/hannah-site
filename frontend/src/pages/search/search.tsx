import styles from "./search.module.css";
import match from "../../utilities/match";
import { generateRandomDates, generatePercentages } from "../../utilities/random";
import { chatWithGemini } from "../../utilities/gemini";
import LoadingIndicator from "../loading/loading";
import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useErrorContext } from "../../components/context/error";
import { useSearchContext } from "../../components/context/search";
import { PAGES } from "../../utilities/constants";

function Search() {
    const { message, searchWith } = useSearchContext();
    const { updateErrorMessage } = useErrorContext();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState("");
    const [userInput, setUserInput] = useState<string | undefined>(undefined);
    const [response, setResponse] = useState<string | undefined>(undefined);
    const [thinkingTime, setThinkingTime] = useState<number>(0); // pretend to be thinking...
    const [relatedContent, setRelatedContent] = useState<[string, string, string][] | undefined>(
        undefined
    );
    const navigate = useNavigate();

    const toErrorPage = () => navigate(`/error`);

    const provideSearchResult = () => {
        let count = 0;
        const keywords = Object.keys(PAGES) as (keyof typeof PAGES)[];
        if (userInput === undefined) {
            updateErrorMessage("userInput must not be undefined");
            toErrorPage();
            return;
        }
        const words = userInput.split(" ") !== undefined ? userInput?.split(" ") : [userInput];
        const newRelatedContent: [string, string, string][] = [];

        for (const key of keywords) {
            if (key === "undefined") continue;
            for (const word of words) {
                const result = match(word, key);
                if (result >= 0.75) {
                    const name = PAGES[key];
                    const date = generateRandomDates(1)[0];
                    const percentage = generatePercentages(1)[0];
                    newRelatedContent.push([date, name, percentage]);
                    count++;
                }
            }
        }
        if (count < 3) {
            const name = PAGES.undefined;
            const date = generateRandomDates(1)[0];
            const percentage = generatePercentages(1)[0];
            newRelatedContent.push([date, name, percentage]);
        }

        setRelatedContent(newRelatedContent);
    };

    const handleSubmit = async () => {
        if (userInput === undefined) {
            updateErrorMessage(`f;Used userInput must not be undefined, must be string.`);
            toErrorPage();
            return;
        }

        try {
            setIsLoading(true);
            const start = performance.now();
            const responseArray = await chatWithGemini(userInput);
            if (responseArray[0] === "ERROR") {
                setResponse(
                    `Sorry, but our AI model cannot answer your question, detail: ${responseArray[1]}`
                );
            } else {
                provideSearchResult();
                const finish = performance.now();
                setThinkingTime((finish - start) / 1000);
                setResponse(responseArray[1]);
            }
        } catch (error) {
            updateErrorMessage(`b;${error}`);
            toErrorPage();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userInput === undefined) {
            if (userInput) {
                setUserInput(message);
                searchWith("");
                handleSubmit();
            } else {
                setUserInput("");
            }
        } else {
            setUserInput("");
            // updateErrorMessage(`f;Initial userInput should be undefined, not ${userInput}.`);
            // toErrorPage();
        }
    }, []);

    if (isLoading) {
        return <LoadingIndicator message="Out AI model is thinking, please wait..." />;
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.topPortion}>
                    <p className={styles.you}>You</p>
                    <input
                        type="text"
                        placeholder="Press `Return` to use AI powered search"
                        value={userInput !== undefined ? userInput : ""}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </div>
                <div className={styles.bottomPortion}></div>
            </div>
        );
    }
}

export default Search;
