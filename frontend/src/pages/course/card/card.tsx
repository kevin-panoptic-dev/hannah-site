import styles from "./card.module.css";
import { courseCardType } from "../type";

function CourseCardCollection({ detailArray }: courseCardType) {
    return (
        <div className={styles.cardCollection}>
            <div className={styles.group}>
                {detailArray.map((course) => (
                    <div
                        key={course.id}
                        className={styles.courseCard}
                    >
                        <p>
                            <span className={styles.subtitle}>
                                course;
                            </span>
                            <span className={styles.date}>
                                Date: {course.date}
                            </span>
                        </p>

                        <p className={styles.courseName}>
                            {course.course_name}
                        </p>

                        <p className={styles.reason}>
                            Reason: {course.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseCardCollection;
