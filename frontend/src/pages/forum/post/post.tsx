import styles from "./post.module.css";
import { useErrorContext } from "../../../components/context/error";
import { useState, FormEvent } from "react";
import api from "../../../utilities/api/api";
import { useNavigate } from "react-router-dom";
import { POST_FORUM_PATH } from "../../../utilities/constants";
import { forumCreateResponseType } from "./type";
import LoadingIndicator from "../../loading/loading";

function Post() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            setLoading(true);
            const response: forumCreateResponseType = await api.post(
                POST_FORUM_PATH,
                {
                    message: message,
                }
            );
            if (response.status === 201) {
                // INFO: successfully create the forum message
                setMessage("");
                navigate("/forum/view");
            } else {
                updateErrorMessage(
                    `b;${response.status} Error: ${response.data.detail}.`
                );
                toErrorPage();
            }
        } catch (error) {
            if (error instanceof Error) {
                updateErrorMessage(
                    `f;An error occurs when handling message submit: ${error.message}`
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
            <LoadingIndicator message="wait a second for us to process your data..."></LoadingIndicator>
        );
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.composeGroup}>
                    <div className={styles.topPortion}>
                        <p className={styles.title}>New Message</p>
                        <div className={styles.alignWrapper}>
                            <button
                                onClick={() => setMessage("")}
                                className={styles.clearButton}
                            >
                                clear
                            </button>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className={styles.messageForm}
                    >
                        <textarea
                            className={styles.inputArea}
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            placeholder="Type your message here..."
                            rows={20}
                            required
                        />
                        <button
                            type="submit"
                            className={styles.formButton}
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Post;
