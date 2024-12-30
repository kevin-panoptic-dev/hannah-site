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
            updateErrorMessage(`f;Used userInput must not be undefined, must be string.`);
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
                            `f;Related Content must not be undefined after provideSearchResult.`
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
                updateErrorMessage(`b;${error}`);
                toErrorPage();
            } finally {
                setIsLoading(false);
            }
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
                <div className={styles.topPortion}></div>
                <div className={styles.bottomPortion}></div>
            </div>
        );
    }
}

export default Search;
