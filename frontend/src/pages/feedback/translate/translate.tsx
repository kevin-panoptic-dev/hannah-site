import styles from "./translate.module.css";
import { shuffle, serialization } from "./functions";
import api from "../../../utilities/api/api";
import { TRANSLATE_FEEDBACK_PATH } from "../../../utilities/constants";
import { useState, useEffect } from "react";
import { FeedbackModelType } from "./type";
import LoadingIndicator from "../../loading/loading";
import { allType } from "./constants";
import { useDirectionContext } from "../../../components/context/direction";
import { useErrorContext } from "../../../components/context/error";
import { useNavigate } from "react-router-dom";
import CardCollection from "./card/card";
import Fade from "../../../components/fade/fade";

function Translate() {
    const { updateRoute } = useDirectionContext();
    const { updateErrorMessage } = useErrorContext();
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");

    const [loading, setLoading] = useState(false);
    const [composition, setComposition] = useState<
        FeedbackModelType[][] | undefined
    >(undefined);

    const handleClick = () => {
        updateRoute("feedback/transcribe");
        navigate("/feedback/transcribe");
    };

    useEffect(() => {
        const performFetch = async () => {
            const composition: FeedbackModelType[][] = (
                await Promise.allSettled(
                    allType.map(async (type) => {
                        const response = await api.post(
                            TRANSLATE_FEEDBACK_PATH,
                            {
                                length_type: type === "g" ? "s" : "l",
                                praise_type: type,
                            }
                        );
                        if (response.status === 200) {
                            const data = response.data.detail;
                            if (!data.length) {
                                return null; // WARN: lack in data cause many empty array
                            }

                            const serializedData = serialization(
                                shuffle(data)
                            );
                            return serializedData;
                        } else {
                            updateErrorMessage(
                                `b;${response.status} Error: ${response.data.detail}, the above error occurs in fetching the ${type} type data.`
                            );
                            toErrorPage();
                            return null; // WARN: this should not be triggered, just for typescript's checking
                        }
                    })
                )
            )
                .map((result): FeedbackModelType[] | null => {
                    if (result.status === "fulfilled") {
                        return result.value;
                    } else {
                        return null;
                    }
                })
                .filter(
                    (result): result is FeedbackModelType[] =>
                        result !== null
                );

            setComposition(composition);
        };

        const main = () => {
            try {
                setLoading(true);
                performFetch();
            } catch (error) {
                if (error instanceof Error) {
                    updateErrorMessage(
                        `f;An error occurs in fetching feedback data: ${error.message}.`
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

        composition || main();
    }, []);

    if (loading || !composition) {
        return (
            <LoadingIndicator message="wait for us fetch the feedbacks you want..."></LoadingIndicator>
        );
    } else {
        return (
            <div className={styles.change_container}>
                <Fade>
                    <h1 className={styles.snare}>
                        See genuine, sapiential praises from my
                        community
                    </h1>
                </Fade>

                <div className={styles.bodyContent}>
                    {composition.map((array, index) => {
                        return (
                            <Fade key={index}>
                                <CardCollection
                                    detailArray={array}
                                ></CardCollection>
                            </Fade>
                        );
                    })}
                </div>

                <Fade>
                    <button
                        className={styles.requestButton}
                        onClick={handleClick}
                    >
                        Leave a comment for me now!
                    </button>
                </Fade>
            </div>
        );
    }
}

export default Translate;
