import styles from "./view.module.css";
import { useErrorContext } from "../../../components/context/error";
import { useState, useEffect } from "react";
import api from "../../../utilities/api/api";
import { useNavigate } from "react-router-dom";
import { useDirectionContext } from "../../../components/context/direction";
import { GET_FORUM_PATH } from "../../../utilities/constants";
import { forumMessageType, forumGetResponseType } from "./type";
import LoadingIndicator from "../../loading/loading";
import ForumCardCollection from "./card/card";

function View() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    const { updateRoute } = useDirectionContext();
    const [forumMessage, setForumMessage] = useState<
        forumMessageType[] | undefined
    >(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performFetch = async () => {
            try {
                setLoading(true);
                const response: forumGetResponseType = await api.get(
                    GET_FORUM_PATH
                );
                if (response.status === 200) {
                    // INFO: OK
                    const serialization = (
                        response: forumMessageType[]
                    ) => {
                        let i = 1;
                        const cards = [...response].slice(-100);
                        for (const card of cards) {
                            card.key = card.id; // INFO: use for deletion
                            card.id = i;
                            i++;
                        }
                        return cards;
                    };
                    const serializedData = serialization(
                        response.data.detail
                    );
                    setForumMessage(serializedData);
                } else {
                    updateErrorMessage(
                        `b;${response.status} error: ${response.data.detail}.`
                    );
                    toErrorPage();
                }
            } catch (error) {
                if (error instanceof Error) {
                    updateErrorMessage(
                        `f;An error occurs when calling the forum get api: ${error.message}`
                    );
                    toErrorPage();
                } else {
                    updateErrorMessage(
                        `f;An abnormal error occurs ${error}`
                    );
                    toErrorPage();
                }
            } finally {
                setLoading(false);
            }
        };
        forumMessage || performFetch();
    }, []);

    const handleCompose = () => {
        updateRoute("forum/post");
        navigate("/forum/post");
    };

    const handleSearch = () => {
        updateRoute("search");
        navigate("/search");
    };

    if (loading) {
        return (
            <LoadingIndicator message="the forum messages are flying toward you!"></LoadingIndicator>
        );
    } else {
        if (forumMessage) {
            return (
                <div className={styles.change_container}>
                    <div className={styles.sidebar}>
                        <div
                            className={styles.composeContainer}
                            onClick={handleCompose}
                        >
                            <img
                                className={styles.compose}
                                src="/compose.png"
                            ></img>
                            <p className={styles.composeText}>
                                create
                            </p>
                        </div>
                        <div
                            className={styles.searchContainer}
                            onClick={handleSearch}
                        >
                            <svg
                                className={styles.SVG}
                                focusable="false"
                                height="30px"
                                viewBox="0 0 30 30"
                                width="30px"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"></path>
                                <path
                                    d="M0,0h24v24H0V0z"
                                    fill="none"
                                ></path>
                            </svg>
                            <p className={styles.searchText}>
                                search
                            </p>
                        </div>
                        <div
                            className={styles.inboxContainer}
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            <img
                                className={styles.inbox}
                                src="/inbox.png"
                            ></img>
                            <p className={styles.inboxText}>
                                messages
                            </p>
                        </div>
                    </div>
                    <div className={styles.rightPortion}>
                        <ForumCardCollection
                            detailArray={forumMessage}
                        ></ForumCardCollection>
                    </div>
                </div>
            );
        }
    }
}

export default View;
