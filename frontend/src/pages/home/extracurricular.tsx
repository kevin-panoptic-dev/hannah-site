import styles from "./styles/extracurricular.module.css";
import Fade from "../../components/fade/fade";
import { shouldInverse } from "./random";
import React from "react";
import { useMemo } from "react";

interface extraDetail {
    id: number;
    date: string;
    extracurricular_name: string;
    reason: string;
    image: string | null;
}

interface extracurricularCardType {
    detailArray: extraDetail[];
}

function ExtracurricularCardCollection({
    detailArray,
}: extracurricularCardType) {
    const sortedArray = useMemo(() => {
        return detailArray.sort((a, b) => {
            if (a.image && !b.image) {
                return -1;
            }
            if (!a.image && b.image) {
                return 1;
            }
            return 0;
        });
    }, [detailArray]);

    return (
        <div className={styles.cardCollection}>
            <div className={styles.group}>
                {sortedArray.map((extra) => (
                    <React.Fragment key={extra.id}>
                        {extra.image ? (
                            <div
                                className={styles.imageCard}
                                key={extra.id}
                            >
                                {shouldInverse() ? (
                                    <>
                                        <div
                                            className={
                                                styles.imageContainer
                                            }
                                        >
                                            <Fade>
                                                <img
                                                    src={extra.image}
                                                    className={
                                                        styles.image
                                                    }
                                                />
                                            </Fade>
                                        </div>

                                        <div
                                            className={
                                                styles.textContainer
                                            }
                                        >
                                            <Fade>
                                                <p
                                                    className={
                                                        styles.extracurricularName
                                                    }
                                                >
                                                    {
                                                        extra.extracurricular_name
                                                    }
                                                </p>
                                                <p
                                                    className={
                                                        styles.date
                                                    }
                                                >
                                                    Date: {extra.date}
                                                </p>
                                                <p
                                                    className={
                                                        styles.reason
                                                    }
                                                >
                                                    Reason:{" "}
                                                    {extra.reason}
                                                </p>
                                            </Fade>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className={
                                                styles.textContainer
                                            }
                                        >
                                            <Fade>
                                                <p
                                                    className={
                                                        styles.extracurricularName
                                                    }
                                                >
                                                    {
                                                        extra.extracurricular_name
                                                    }
                                                </p>
                                                <p
                                                    className={
                                                        styles.date
                                                    }
                                                >
                                                    Date: {extra.date}
                                                </p>
                                                <p
                                                    className={
                                                        styles.reason
                                                    }
                                                >
                                                    Reason:{" "}
                                                    {extra.reason}
                                                </p>
                                            </Fade>
                                        </div>

                                        <div
                                            className={
                                                styles.imageContainer
                                            }
                                        >
                                            <Fade>
                                                <img
                                                    src={extra.image}
                                                    className={
                                                        styles.image
                                                    }
                                                />
                                            </Fade>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className={styles.textCard}>
                                <Fade>
                                    <p
                                        className={
                                            styles.extracurricularName
                                        }
                                    >
                                        {extra.extracurricular_name}
                                    </p>
                                    <p className={styles.date}>
                                        Date: {extra.date}
                                    </p>
                                    <p className={styles.reason}>
                                        Reason: {extra.reason}
                                    </p>
                                </Fade>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ExtracurricularCardCollection;
