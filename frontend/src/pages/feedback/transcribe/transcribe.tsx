import styles from "./transcribe.module.css";
import { useState, ChangeEvent, FormEvent } from "react";
import { feedbackFormType, transcribeResponseType } from "./type";
import api from "../../../utilities/api/api";
import { TRANSCRIBE_FEEDBACK_PATH } from "../../../utilities/constants";
import { useErrorContext } from "../../../components/context/error";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../loading/loading";
import count from "./functions";

function Transcribe() {
    const { updateErrorMessage } = useErrorContext();
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const [feedback, setFeedback] = useState<feedbackFormType>({
        title: "",
        content: "",
    });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "title" && value.length > 40) {
            return;
        }

        const wordCount = count(feedback.content);

        if (wordCount >= 30) {
            setError("");
        } else {
            if (error) {
                setError(
                    `Please provide at least 30 words. Current word count: ${wordCount}`
                );
            }
        }

        setFeedback((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const wordCount = count(feedback.content);
        if (wordCount < 30) {
            setError(
                `Please provide at least 30 words. Current word count: ${wordCount}`
            );
            return;
        }

        try {
            setLoading(true);
            const response: transcribeResponseType = await api.post(
                TRANSCRIBE_FEEDBACK_PATH,
                {
                    title: feedback.title,
                    content: feedback.content,
                }
            );
            if (response.status === 201) {
                // INFO: this is a hard success...
                setFeedback({ content: "", title: "" });
                navigate("/feedback/translate");
                return;
            } else {
                console.error(`Error status: ${response.status}`);
                console.error(`Error info: ${response.data.detail}`);
                switch (response.status) {
                    case 400:
                        // WARN: serializer error, gemini error & feedback error
                        updateErrorMessage(
                            `b; ${response.status} Error: ${response.data.detail}.`
                        );
                        toErrorPage();
                        break;

                    case 406:
                        // WARN: length <= 25, this should not be triggered
                        updateErrorMessage(
                            `b; ${response.status} Error: ${response.data.detail}.`
                        );
                        toErrorPage();
                        break;

                    case 500:
                        // WARN: an error occurs in gemini model, third party error
                        updateErrorMessage(
                            `b; An error occurs, possibly because of Google Policy Update: ${response.data.detail}.`
                        );
                        toErrorPage();
                        break;

                    case 422:
                        // WARN: user input is not good
                        alert(
                            "Please Provide relevant information regarding Hannah, if you believe there's an error, please contact the developer."
                        );
                        updateErrorMessage(
                            `b; ${response.status} Error: ${response.data.detail}`
                        );
                        toErrorPage();
                        break;

                    default:
                        // WARN: unknown error occurs:
                        updateErrorMessage(
                            `b;${response.status} Error: ${response.data.detail}`
                        );
                        toErrorPage();
                        break;
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                updateErrorMessage(
                    `f;An error occurs in submitting feedback data: ${error.message}.`
                );
                toErrorPage();
            } else {
                updateErrorMessage(
                    `f;An unknown type error occurs: ${error}`
                );
                toErrorPage();
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LoadingIndicator message="your feedback is undergoing censorship, please wait..."></LoadingIndicator>
        );
    } else {
        return (
            <div className={styles.change_container}>
                <h1 className={styles.bigTitle}>Thank You!</h1>
                <div className={styles.alignWrapper}>
                    <form
                        onSubmit={handleSubmit}
                        className={styles.feedbackForm}
                    >
                        <div className={styles.titlePortion}>
                            <label
                                htmlFor="title"
                                className={styles.titleLabel}
                            >
                                Title
                            </label>
                            <input
                                className={styles.titleBox}
                                type="text"
                                id="title"
                                name="title"
                                value={feedback.title}
                                onChange={handleInputChange}
                                maxLength={40}
                                placeholder="Enter feedback title (max 40 characters)"
                                required
                            />
                            <span className="character-count">
                                {feedback.title.length}/40
                            </span>
                        </div>

                        <div className={styles.contentPortion}>
                            <label
                                htmlFor="content"
                                className={styles.contentLabel}
                            >
                                Content
                            </label>
                            <textarea
                                className={styles.inputArea}
                                id="content"
                                name="content"
                                value={feedback.content}
                                onChange={handleInputChange}
                                placeholder="Enter your feedback"
                                rows={10}
                                required
                            />
                            {error !== "" && (
                                <p className={styles.errorMessage}>
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Click me to submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Transcribe;
