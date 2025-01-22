import styles from "./styles/course.module.css";
import Fade from "../../components/fade/fade";

interface courseDetail {
    id: number;
    date: string;
    reason: string;
    course_name: string;
}

interface courseCardType {
    detailArray: courseDetail[];
}

function CourseCardCollection({ detailArray }: courseCardType) {
    return (
        <div className={styles.cardCollection}>
            <div className={styles.group}>
                {detailArray.map((course) => (
                    <div
                        key={course.id}
                        className={styles.courseCard}
                    >
                        <Fade>
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
                        </Fade>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseCardCollection;
