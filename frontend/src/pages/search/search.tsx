import styles from "./search.module.css";
import api from "../../utilities/api/api";
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
        const keywords = Object.keys(PAGES) as (keyof typeof PAGES)[];
        const words = userInput!.split(" ");
        setRelatedContent([]);
        for (const key of keywords) {
            if (key === "undefined") continue;
            for (const word of words) {
                const result = match(word, key);
                if (result >= 0.75) {
                    const name = PAGES[key];
                    const date = generateRandomDates(1)[0];
                    const percentage = generatePercentages(1)[0];
                    setRelatedContent((previous) =>
                        previous
                            ? [...previous, [date, name, percentage]]
                            : [[date, name, percentage]]
                    );
                }
            }
        }
    };

    const handleSubmit = async () => {
        if (userInput === undefined) {
            updateErrorMessage(`f:Used userInput must not be undefined, must be string.`);
            toErrorPage();
        } else {
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
                    if (relatedContent === undefined) {
                        updateErrorMessage(
                            `f:Related Content must not be undefined after provideSearchResult.`
                        );
                        toErrorPage();
                    } else if (relatedContent.length < 3) {
                        const name = PAGES.undefined;
                        const date = generateRandomDates(1)[0];
                        const percentage = generatePercentages(1)[0];
                        setRelatedContent((previous) =>
                            previous
                                ? [...previous, [date, name, percentage]]
                                : [[date, name, percentage]]
                        );
                    }
                    const finish = performance.now();
                    setThinkingTime((finish - start) / 1000);
                    setResponse(responseArray[1]);
                }
            } catch (error) {
                updateErrorMessage(`b:${error}`);
                toErrorPage();
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (userInput === undefined) {
            setUserInput(message);
            searchWith("");
            handleSubmit();
        } else {
            updateErrorMessage(`f:Initial userInput should be undefined, not ${userInput}.`);
            toErrorPage();
        }
    }, []);

    if (isLoading) {
        return <LoadingIndicator message="Out AI model is thinking, please wait..." />;
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.result_section}>
                    <div className={styles.search_stats}>
                        <span className={styles.search_query}>Search: {userInput}</span>
                        {thinkingTime > 0 && (
                            <span className={styles.response_time}>
                                Response time: {thinkingTime.toFixed(2)}s
                            </span>
                        )}
                    </div>

                    <div className={styles.ai_response}>
                        {response ? (
                            <div className={styles.response_content}>
                                {response.split("\n").map((paragraph, index) => (
                                    <p
                                        key={`response-${index}`}
                                        className={styles.response_paragraph}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.no_response}>No results available</div>
                        )}
                    </div>
                    <div className={styles.related_section}>
                        <h2 className={styles.related_title}>Related Content</h2>
                        <div className={styles.related_content}>
                            {relatedContent === undefined ? (
                                <div className={styles.no_related}>
                                    Press Return, and the results will appear here
                                </div>
                            ) : (
                                relatedContent.map(([date, name, percentage], index) => (
                                    <div key={`related-${index}`} className={styles.related_card}>
                                        <div className={styles.card_date}>{date}</div>
                                        <div className={styles.card_name}>{name}</div>
                                        <div
                                            className={styles.card_percentage}
                                        >{`${percentage}% match`}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;
