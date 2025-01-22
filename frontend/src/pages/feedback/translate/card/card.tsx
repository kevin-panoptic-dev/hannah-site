import styles from "./card.module.css";
import { translateResponseFunctionType } from "../type";
import { useMemo } from "react";
import { match } from "../functions";

function CardCollection({
    detailArray,
}: translateResponseFunctionType) {
    const title = useMemo(() => {
        const dtype = detailArray[0].praise_type;
        return match(dtype);
    }, [detailArray]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.alignWrapper}>
                <h2 className={styles.title}>{title}</h2>
            </div>

            <div className={styles.collection}>
                {detailArray.map((feedback) => {
                    return (
                        <div
                            className={styles.card}
                            key={feedback.id}
                        >
                            <p>
                                <span className={styles.decorator}>
                                    “
                                </span>
                                <span className={styles.praiseTitle}>
                                    {feedback.title}
                                </span>
                            </p>
                            <p className={styles.content}>
                                {feedback.content}
                            </p>
                            <p className={styles.from}>
                                by {feedback.author}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CardCollection;
