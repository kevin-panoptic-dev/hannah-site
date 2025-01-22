import styles from "./course.module.css";
import requestData from "../../utilities/data";
import { CourseCardType, requestType, courseType } from "./type";
import {
    useState,
    useMemo,
    ChangeEvent,
    FormEvent,
    useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../components/context/error";
import LoadingIndicator from "../loading/loading";
import { shuffle, serialization } from "./functions";
import options from "./constants";
import CourseCardCollection from "./card/card";

// WARN: this page has a bug, drag and resize window is only available before search
// WARN: this bug potentially will never be fixed, since there's not much fancy feature in this page
function Course() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();

    const [courseData, setCourseData] = useState<
        CourseCardType | undefined
    >(undefined);
    const [loading, setLoading] = useState(false);
    const [courseInput, setCourseInput] = useState("");
    const [numberRequired, setNumberRequired] = useState(0);
    const [isResizing, setIsResizing] = useState(false);
    const [displayedCourse, setDisplayedCourse] = useState("");

    const performFetch = async (requestInfo: requestType) => {
        try {
            setLoading(true);
            const response = await requestData(requestInfo);
            if (response.status === 200) {
                return response.data.detail;
            } else {
                if (
                    response.status === 400 ||
                    response.status === 404
                ) {
                    updateErrorMessage(
                        `b;${response.statusText}: ${response.data.detail}`
                    );
                    toErrorPage();
                } else if (response.status === 207) {
                    console.log(
                        "Only a portion of data is delivered."
                    );
                    return response.data.detail;
                } else {
                    updateErrorMessage(
                        `b;Unexpected status code other than 200, 207, 400, 404: ${response.status}.`
                    );
                    toErrorPage();
                }
            }
        } catch (error) {
            updateErrorMessage(`f;${error}`);
            toErrorPage();
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (requestInfo: requestType) => {
        const courseResponse: CourseCardType = await performFetch(
            requestInfo
        );

        courseResponse ||
            (() => {
                updateErrorMessage(
                    `f; course response is empty: ${courseResponse}`
                );
                toErrorPage();
            });

        return courseResponse;
    };

    const serializedData = useMemo(() => {
        if (courseData) {
            const shuffledArray = shuffle(courseData);
            const serializedData = serialization(shuffledArray);
            return serializedData;
        } else {
            return undefined;
        }
    }, [courseData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCourseInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const type: courseType = courseInput
            .trim()
            .charAt(0)
            .toLowerCase() as courseType;
        const fullRequestData: requestType = [
            "c",
            type,
            numberRequired,
        ];
        try {
            setLoading(true);
            const courseData = await fetchData(fullRequestData);
            setCourseData(courseData);
            setDisplayedCourse(courseInput);
            setCourseInput("");
        } catch (error) {
            if (error instanceof Error) {
                updateErrorMessage(`f;${error.message}`);
                toErrorPage();
            } else {
                updateErrorMessage(
                    `f;Catch an error that is not an instance of Error: ${error}.`
                );
                toErrorPage();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const separator = document.getElementById("separator");
        const left = document.getElementById("left");

        if (separator && left) {
            // WARN: use var to reduce complication
            var mouseMoveHandler = (mouse: MouseEvent) => {
                if (!isResizing) return;

                const newWidth =
                    mouse.clientX - left.getBoundingClientRect().left;
                if (newWidth < 800) {
                    if (newWidth > 350) {
                        left.style.visibility = "visible";
                    } else {
                        left.style.visibility = "hidden";
                    }
                    left.style.width = `${newWidth}px`;
                } else if (newWidth < 350) {
                    left.style.visibility = "hidden";
                }
            };

            var mouseUpHandler = () => {
                setIsResizing(false);
                document.body.style.cursor = "default";
                document.removeEventListener(
                    "mousemove",
                    mouseMoveHandler
                );
                document.removeEventListener(
                    "mouseup",
                    mouseUpHandler
                );
            };

            separator.addEventListener("mousedown", () => {
                setIsResizing(true);
                document.body.style.cursor = "ew-resize";
            });

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        } else {
            updateErrorMessage(
                `f;vertical separator or left div not found: ${separator}, ${left}`
            );
            toErrorPage();
        }

        return () => {
            if (separator && left) {
                document.removeEventListener(
                    "mousemove",
                    mouseMoveHandler
                );
                document.removeEventListener(
                    "mouseup",
                    mouseUpHandler
                );
            }
        };
    }, [isResizing]);

    // useEffect(() => {
    //     if (!courseInput) return;

    //     const inputTag = document.getElementById(
    //         courseInput
    //     ) as HTMLInputElement;
    //     if (inputTag) {
    //         inputTag.checked = true;
    //     } else {
    //         updateErrorMessage(
    //             `f; cannot find input tag: ${inputTag}, with id: ${courseInput}`
    //         );
    //         toErrorPage();
    //     }

    //     return () => {};
    // }, [courseInput]);

    if (loading) {
        return (
            <LoadingIndicator message="wait a moment..."></LoadingIndicator>
        );
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.searchPortion} id="left">
                    <div className={styles.textContainer}>
                        <p className={styles.title}>
                            Intelligence Search Square
                        </p>
                        <p className={styles.content}>
                            Search for the course you are looking for
                        </p>
                    </div>

                    <form
                        className={styles.formContainer}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        {options.map((option) => {
                            return (
                                <label
                                    key={option}
                                    className={styles.choiceLabel}
                                >
                                    <div
                                        className={styles.inputGroup}
                                    >
                                        <p className={styles.key}>
                                            {option}
                                        </p>
                                        <input
                                            className={
                                                styles.choiceInput
                                            }
                                            type="radio"
                                            name="multiple-choice"
                                            value={option}
                                            checked={
                                                courseInput === option
                                            }
                                            onChange={(e) =>
                                                handleChange(e)
                                            }
                                        />
                                    </div>
                                </label>
                            );
                        })}
                        <label className={styles.numberLabel}>
                            <p className={styles.numberInfo}>
                                enter a integer between 1 and 25
                            </p>
                            <input
                                type="number"
                                id="number-input"
                                name="number-input"
                                min="1"
                                max="25"
                                onChange={(e) => {
                                    setNumberRequired(
                                        parseInt(e.target.value)
                                    );
                                }}
                                placeholder="the number required"
                                className={styles.numberInput}
                            />
                        </label>
                        <button
                            type="submit"
                            className={styles.formButton}
                        >
                            Search
                        </button>
                    </form>
                </div>
                <div
                    className={styles.separator}
                    id="separator"
                ></div>
                <div className={styles.contentPortion}>
                    {serializedData ? (
                        <>
                            <p className={styles.courseTitle}>
                                {displayedCourse} Course
                            </p>
                            <CourseCardCollection
                                detailArray={serializedData}
                            ></CourseCardCollection>
                        </>
                    ) : (
                        <p className={styles.awaitText}>
                            The search result will appear here...
                        </p>
                    )}
                </div>
            </div>
        );
    }
}

export default Course;
