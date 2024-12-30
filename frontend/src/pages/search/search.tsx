import styles from "./search.module.css";
import match from "../../utilities/match";
import { generateRandomDates, generatePercentages } from "../../utilities/random";
import { chatWithGemini } from "../../utilities/gemini";
import LoadingIndicator from "../loading/loading";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../components/context/error";
import { useSearchContext } from "../../components/context/search";
import { PAGES } from "../../utilities/constants";

function Search() {
    const { message, searchWith } = useSearchContext();
    const { updateErrorMessage } = useErrorContext();
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState<string | undefined>(undefined);
    const [response, setResponse] = useState<string | undefined>(undefined);
    const [thinkingTime, setThinkingTime] = useState<string>(""); // pretend to be thinking...
    const [relatedContent, setRelatedContent] = useState<[string, string, string][] | undefined>(
        undefined
    );
    const [contentText, setContentText] = useState("");
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
                setThinkingTime(((finish - start) / 1000).toFixed(3));
                setResponse(responseArray[1]);
            }
        } catch (error) {
            updateErrorMessage(`b;${error}`);
            console.log(error);
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
                // setUserInput("");
            }
        } else {
            // setUserInput("");
            // updateErrorMessage(`f;Initial userInput should be undefined, not ${userInput}.`);
            // toErrorPage();
        }
    }, []);

    useEffect(() => {
        if (response) {
            const text = response.split("");
            let i = -1;

            const interval = setInterval(() => {
                if (i < text.length - 1) {
                    setContentText((prev) => prev + text[i]);
                    i++;
                }
            }, Math.random() * 50);

            return () => clearInterval(interval);
        }
    }, [response]);

    if (isLoading) {
        return <LoadingIndicator message="Out AI model is thinking, please wait..." />;
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.topPortion}>
                    <p className={styles.you}>You: </p>
                    <input
                        type="text"
                        placeholder="Press `Return` to use AI powered search"
                        value={userInput !== undefined ? userInput : ""}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setRelatedContent(undefined);
                                setContentText("");
                                handleSubmit();
                            }
                        }}
                        className={styles.searchBox}
                    />
                    <hr className={styles.underlineBreaker} />
                    {response ? (
                        <>
                            <p className={styles.ai}>AI assistant: </p>
                            <p className={styles.think}>Thinking for {thinkingTime} seconds</p>
                            <div className={styles.searchWrapper}>
                                <p className={styles.searchContent}>{contentText}</p>
                            </div>
                            <hr className={styles.breaker} />
                        </>
                    ) : (
                        <>
                            <p className={styles.ai}>AI assistant: </p>
                            <div className={styles.searchWrapper}>
                                <p className={styles.searchContent}>
                                    Type anything, and I'm ready to help!
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.bottomPortion}>
                    {response && relatedContent && (
                        <>
                            <p className={styles.title}>Your suggested results</p>
                            <div className={styles.resultWrapper}>
                                {relatedContent.map((array, index) => (
                                    <div key={index} className={styles.resultCard}>
                                        {array.map((item, index) => (
                                            <p key={index} className={`${styles.items}${index}`}>
                                                {index === 0
                                                    ? `released date: ${item}`
                                                    : index === 1
                                                    ? item
                                                    : `${item}% match`}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default Search;
