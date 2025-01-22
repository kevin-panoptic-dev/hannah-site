import styles from "./card.module.css";
import {
    forumMessageInterface,
    forumDeleteResponseType,
} from "../type";
import { useMemo, useState, useEffect } from "react";
import { useErrorContext } from "../../../../components/context/error";
import { useNavigate } from "react-router-dom";
import { getMessage, formatDate } from "./functions";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN } from "../../../../utilities/api/constants";
import { DecodedTokenType } from "../type";
import api from "../../../../utilities/api/api";
import { DELETE_FORUM_PATH } from "../../../../utilities/constants";

function ForumCardCollection({ detailArray }: forumMessageInterface) {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    const [focusCardId, setFocusCardId] = useState<
        number | undefined
    >(undefined);
    const [userinfo, setUserinfo] = useState<
        undefined | [string, boolean]
    >(undefined);

    const focusCard = useMemo(() => {
        if (!focusCardId) return undefined;
        const result = getMessage(detailArray, focusCardId);
        if (!result) {
            updateErrorMessage(
                `f;Con't find a card based on the id ${focusCardId}: ${result}`
            );
            toErrorPage();
            return undefined;
        }
        return result;
    }, [focusCardId]);

    useEffect(() => {
        if (!focusCard) return;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setFocusCardId(undefined);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener("keydown", handleKeyDown);
    }, [focusCardId]);

    useEffect(() => {
        if (userinfo) return;
        try {
            const token = localStorage.getItem(REFRESH_TOKEN);
            // WARN: who set the token to be a string!!! undefined???
            if (!token || token === "undefined") {
                localStorage.clear();
                setUserinfo(undefined);
                return;
            } else {
                const decodedToken =
                    jwtDecode<DecodedTokenType>(token);
                if (
                    !decodedToken.username ||
                    decodedToken.is_admin === undefined ||
                    decodedToken.is_admin === null
                ) {
                    updateErrorMessage(
                        `b;username attribute not found or admin attribute not found: ${decodedToken}`
                    );
                    toErrorPage();
                } else {
                    setUserinfo([
                        decodedToken.username as string,
                        decodedToken.is_admin as boolean,
                    ]);
                }
            }
        } catch (error) {
            updateErrorMessage(
                `f;An error occurs when getting the username: ${error}`
            );
            toErrorPage();
        }
    }, []);

    const handleDelete = async () => {
        try {
            if (!focusCard || !userinfo) return;
            const id = focusCard.key;
            const response: forumDeleteResponseType = await api.post(
                DELETE_FORUM_PATH,
                {
                    message_id: id,
                }
            );
            if (response.status === 200) {
                // INFO: delete successfully
                window.location.reload();
                return;
            } else {
                updateErrorMessage(
                    `b;${response.status} error: ${response.data.detail}`
                );
                toErrorPage();
            }
        } catch (error) {
            if (error instanceof Error) {
                updateErrorMessage(
                    `f;An error occurs when delete the forum message: ${error.message}`
                );
                toErrorPage();
            } else {
                updateErrorMessage(
                    `f;An unknown type error occurs: ${error}`
                );
                toErrorPage();
            }
        }
    };

    const shouldDisplayDelete: boolean = useMemo(() => {
        if (!focusCard) return false;
        if (!userinfo) return false;
        if (userinfo[1]) return true;
        if (userinfo[0] === focusCard.author) return true;
        else return false;
    }, [userinfo, focusCard]);

    // INFO: if not an id or not a real card, return this genetic content
    if (!focusCardId || !focusCard) {
        return (
            <div className={styles.cardCollection}>
                {detailArray.map((card) => (
                    <div className={styles.card} key={card.id}>
                        <div className={styles.topPortion}>
                            <p style={{ display: "inline" }}>
                                <span className={styles.author}>
                                    {card.author}
                                </span>
                                <span className={styles.date}>
                                    {" "}
                                    {formatDate(card.date)}
                                </span>
                            </p>
                            <div className={styles.alignWrapper}>
                                <svg
                                    className={styles.SVG}
                                    viewBox="0 0 36 36"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="36"
                                    height="36"
                                    onClick={() => {
                                        if (
                                            focusCardId !== undefined
                                        ) {
                                            updateErrorMessage(
                                                `f;There must not be a focus card to be able to trigger focus, not ${focusCardId}`
                                            );
                                            toErrorPage();
                                        }
                                        setFocusCardId(card.id);
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        fill="#FFFFFF"
                                        d="M16.503 16.497l.008-5.739c0-.828.672-1.498 1.589-1.498h.02c.721.001 1.391.672 1.391 1.5v.001l-.008 5.74 5.749.008c1.548.001 1.498.672 1.498 2.391v-.79c-.001.73.02 1.399-1.5 1.399h-.002l-5.75-.008-.008 5.739c-.001 1.45-.673 1.498-1.5 1.498h-.002c-.828-.001-1.498-.078-1.498-1.5v-.002l.008-5.739-5.75-.008a1.5 1.5 0 0 1-1.498-1.5v-.002a1.5 1.5 0 0 1 1.5-1.498h.002l5.751.008M17.999 0C8.58 0 0 8.58 0 18c0 9.941 8.58 17.999 17.999 17.999 9.942 0 18-8.058 18-17.999 0-9.42-8.058-18-18-18"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        <div className={styles.textPortion}>
                            <p className={styles.message}>
                                {card.message.substring(0, 1000)}{" "}
                                {card.message.length > 100 && "..."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                <div className={styles.focusCard}>
                    <div className={styles.buttonContainer}>
                        <img src="/fig.png" className={styles.fig} />

                        <div className={styles.additionWrapper}>
                            {shouldDisplayDelete && (
                                <div className={styles.deleteWrapper}>
                                    <button
                                        className={
                                            styles.deleteButton
                                        }
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}

                            <div className={styles.buttonWrapper}>
                                <button
                                    className={styles.exitButton}
                                    data-modal-close=""
                                    aria-label="Close"
                                    onClick={() =>
                                        setFocusCardId(undefined)
                                    }
                                >
                                    <svg
                                        className={styles.buttonSVG}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        width="20px"
                                        height="20px"
                                    >
                                        <path d="M12.12,10l4.07-4.06a1.5,1.5,0,1,0-2.11-2.12L10,7.88,5.94,3.81A1.5,1.5,0,1,0,3.82,5.93L7.88,10,3.81,14.06a1.5,1.5,0,0,0,0,2.12,1.51,1.51,0,0,0,2.13,0L10,12.12l4.06,4.07a1.45,1.45,0,0,0,1.06.44,1.5,1.5,0,0,0,1.06-2.56Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <p style={{ paddingLeft: "10px" }}>
                            <span className={styles.focusAuthor}>
                                {focusCard.author}
                            </span>
                            <span className={styles.focusDate}>
                                {" "}
                                {formatDate(focusCard.date)}
                            </span>
                        </p>
                        <div className={styles.textPortion}>
                            <p className={styles.focusMessage}>
                                {focusCard.message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForumCardCollection;
