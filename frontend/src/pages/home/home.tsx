import styles from "./styles/home.module.css";
import requestData from "../../utilities/data";
import { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../components/context/error";
import {
    GRADIENT_MOVE_INTERVAL,
    X_GRADIENT_MOVE_SPEED,
    Y_GRADIENT_MOVE_SPEED,
    GRADIENT_WIDTH,
    GRADIENT_MARGIN,
    positiveOutOfBoard,
    negativeOutOfBoard,
    CRITICAL_VALUE,
    INITIAL_LENGTH,
    INITIAL_SPEED,
    calSpeed,
} from "./constants";
import LoadingIndicator from "../loading/loading";
import { getCourseType } from "./random";
import Expand from "../../components/expand/expand";
import CourseCardCollection from "./course";
import ExtracurricularCardCollection from "./extracurricular";
import Fade from "../../components/fade/fade";
// import { useNavbarContext } from "../../components/context/navbar";

type gradientType = [
    [number, number, number],
    [number, number, number],
    [number, number, number],
    [number, number, number]
];

type requestType = ["c", courseType, number] | "e";
type courseType = "e" | "s" | "m" | "c" | "g";

interface courseDetail {
    id: number;
    date: string;
    reason: string;
    course_name: string;
}

interface extraDetail {
    id: number;
    date: string;
    extracurricular_name: string;
    reason: string;
    image: string | null;
}

function Home() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    // const { show } = useNavbarContext();
    // show();

    /*   ***   *** Gradient Portion ***   ***   */
    const [onFirstPage, setOnFirstPage] = useState(true);
    const [gradient, setGradient] = useState<gradientType>([
        [0 + GRADIENT_MARGIN, 1, 1],
        [0, 1, 0],
        [window.innerWidth - GRADIENT_MARGIN, 0, 1],
        [window.innerHeight, 0, 0],
    ]);
    const [timeToUpdate, setTimeToUpdate] = useState(0);
    const gradientRef = useRef<HTMLDivElement>(null);

    // INFO: centers = [[x1, direction, condition], [y1, direction, condition] ; [x2, direction, condition], [y2, direction, condition]]
    // INFO: x: direction == 0 ==> move left, direction == 1 ==> move right
    // INFO: y: direction == 0 ==> move up, direction == 1 ==> move down
    // INFO: condition: x == static ; y == dynamic

    const moveGradient = () => {
        if (!onFirstPage) return;
        let x1 = gradient[0][0];
        let y1 = gradient[1][0];
        let x2 = gradient[2][0];
        let y2 = gradient[3][0];

        let x1Condition = gradient[0][2];
        let y1Condition = gradient[1][2];
        let x2Condition = gradient[2][2];
        let y2Condition = gradient[3][2];

        let x1Direction = gradient[0][1];
        let y1Direction = gradient[1][1];
        let x2Direction = gradient[2][1];
        let y2Direction = gradient[3][1];

        if (x1Condition) {
            if (x1Direction) {
                if (
                    positiveOutOfBoard(
                        x1,
                        window.innerWidth - GRADIENT_MARGIN,
                        X_GRADIENT_MOVE_SPEED
                    )
                ) {
                    x1Condition = +!x1Condition;
                    x1Direction = +!x1Direction;
                    y1 += Y_GRADIENT_MOVE_SPEED;
                } else {
                    x1 += X_GRADIENT_MOVE_SPEED;
                }
            } else {
                if (
                    negativeOutOfBoard(
                        x1,
                        GRADIENT_MARGIN,
                        X_GRADIENT_MOVE_SPEED
                    )
                ) {
                    x1Condition = +!x1Condition;
                    x1Direction = +!x1Direction;
                    y1Condition = +!y1Condition;
                } else {
                    x1 -= X_GRADIENT_MOVE_SPEED;
                }
            }
        } else {
            if (y1Direction) {
                if (
                    positiveOutOfBoard(
                        y1,
                        window.innerHeight,
                        Y_GRADIENT_MOVE_SPEED
                    )
                ) {
                    y1Condition = +!y1Condition;
                    y1Direction = +!y1Direction;
                    x1Condition = +!x1Condition;
                } else {
                    y1 += Y_GRADIENT_MOVE_SPEED;
                }
            } else {
                if (
                    negativeOutOfBoard(y1, 0, Y_GRADIENT_MOVE_SPEED)
                ) {
                    y1Condition = +!y1Condition;
                    y1Direction = +!y1Direction;
                    x1Condition = +!x1Condition;
                } else {
                    y1 -= Y_GRADIENT_MOVE_SPEED;
                }
            }
        }

        if (x2Condition) {
            if (x2Direction) {
                if (
                    positiveOutOfBoard(
                        x2,
                        window.innerWidth - GRADIENT_MARGIN,
                        X_GRADIENT_MOVE_SPEED
                    )
                ) {
                    x2Condition = +!x2Condition;
                    x2Direction = +!x2Direction;
                    y2 += Y_GRADIENT_MOVE_SPEED;
                } else {
                    x2 += X_GRADIENT_MOVE_SPEED;
                }
            } else {
                if (
                    negativeOutOfBoard(
                        x2,
                        GRADIENT_MARGIN,
                        X_GRADIENT_MOVE_SPEED
                    )
                ) {
                    x2Condition = +!x2Condition;
                    x2Direction = +!x2Direction;
                    y2Condition = +!y2Condition;
                } else {
                    x2 -= X_GRADIENT_MOVE_SPEED;
                }
            }
        } else {
            if (y2Direction) {
                if (
                    positiveOutOfBoard(
                        y2,
                        window.innerHeight,
                        Y_GRADIENT_MOVE_SPEED
                    )
                ) {
                    y2Condition = +!y2Condition;
                    y2Direction = +!y2Direction;
                    x2Condition = +!x2Condition;
                } else {
                    y2 += Y_GRADIENT_MOVE_SPEED;
                }
            } else {
                if (
                    negativeOutOfBoard(y2, 0, Y_GRADIENT_MOVE_SPEED)
                ) {
                    y2Condition = +!y2Condition;
                    y2Direction = +!y2Direction;
                    x2Condition = +!x2Condition;
                } else {
                    y2 -= Y_GRADIENT_MOVE_SPEED;
                }
            }
        }
        setGradient([
            [x1, x1Direction, x1Condition],
            [y1, y1Direction, y1Condition],
            [x2, x2Direction, x2Condition],
            [y2, y2Direction, y2Condition],
        ]);
    };

    // WARN: this code is never tested
    useEffect(() => {
        let animationFrameId: number;
        let frameCount = 0;

        const updateState = () => {
            frameCount++;
            if (frameCount % 5 === 0) {
                setTimeToUpdate((previous) => +!previous);
            }
            animationFrameId = requestAnimationFrame(updateState);
        };

        if (onFirstPage) {
            animationFrameId = requestAnimationFrame(updateState);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [onFirstPage]); // INFO: This flag is crucial to terminate the state updating

    // useEffect(() => {
    //     let interval: NodeJS.Timeout;

    //     if (onFirstPage) {
    //         interval = setInterval(() => {
    //             setTimeToUpdate((previous) => +!previous);
    //         }, GRADIENT_MOVE_INTERVAL);
    //     }

    //     return () => {
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //     };
    // }, [onFirstPage]);

    useEffect(() => {
        if (onFirstPage) moveGradient();
    }, [timeToUpdate]);

    useEffect(() => {
        if (gradientRef.current) {
            gradientRef.current.style.background = `radial-gradient(circle ${GRADIENT_WIDTH}px at ${gradient[0][0]}px ${gradient[1][0]}px, #204881 0%, #0f2766 50%, transparent 100%),
                              radial-gradient(circle ${GRADIENT_WIDTH}px at ${gradient[2][0]}px ${gradient[3][0]}px, #204881 0%, #0f2766 50%, #091326 100%)`;
        }
    }, [gradient]);
    /*   ***   *** Gradient Portion ***   ***   */

    /*   ***   *** First Page Animation ***   ***   */
    const [zoomSpeed, setZoomSpeed] = useState<number>(INITIAL_SPEED);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [secondaryFix, setSecondaryFix] = useState<boolean>(true);
    const scrollFix = () => {
        if (onFirstPage) {
            // SAFE: message is not printed on second page
            window.scrollTo({
                top: 0,
                left: 0,
            });
        }
    };

    useEffect(() => {
        if (onFirstPage) {
            // INFO: using exponential model to determine the zoomSpeed
            const speed = calSpeed(zoomLevel);
            setZoomSpeed(speed);
        }
    }, [zoomLevel]);

    useEffect(() => {
        if (onFirstPage) {
            const handleScroll = (event: globalThis.WheelEvent) => {
                if (event.deltaY > 0) {
                    setZoomLevel((prev) =>
                        Math.min(prev + zoomSpeed, CRITICAL_VALUE)
                    );
                } else {
                    if (zoomLevel < CRITICAL_VALUE * 0.95) {
                        setZoomLevel((prev) =>
                            Math.max(prev - zoomSpeed, 1)
                        );
                    } else {
                        null;
                    }
                }
            };
            window.addEventListener("wheel", handleScroll);

            return () => {
                window.removeEventListener("wheel", handleScroll);
            };
        }
    }, [zoomLevel]);
    /*   ***   *** First Page Animation ***   ***   */

    /*   ***   *** API Portion ***   ***   */
    const [extraData, setExtraData] = useState<
        extraDetail[] | undefined
    >(undefined);
    const [courseData, setCourseData] = useState<
        courseDetail[] | undefined
    >(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performFetch = async (type: requestType) => {
            try {
                setLoading(true);
                const response = await requestData(type);
                if (response.status === 200) {
                    // INFO: regardless the type of the request, 200 is a success
                    return response.data.detail;
                } else {
                    if (type === "e") {
                        // WARN: All the unsuccessful status 500 server error
                        if (response.status === 500) {
                            updateErrorMessage(
                                `b;${response.data.detail}`
                            );
                            toErrorPage();
                        } else {
                            updateErrorMessage(
                                `b;An unexpected status is received other than 500: ${response.status}`
                            );
                            toErrorPage();
                        }
                    } else {
                        // WARN: All the unsuccessful status:
                        // INFO: 400 bad request, frontend error
                        // INFO: 404 no found, not a single data byte is sent back
                        // INFO: 207 multi status, only partially successful
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
                }
            } catch (error) {
                updateErrorMessage(`f;${error}`);
                toErrorPage();
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            if (courseData !== undefined || extraData !== undefined) {
                updateErrorMessage(
                    `f;Course Data and Extra Data must not be undefined in order to perform initial data fetch.`
                );
                toErrorPage();
                return;
            } else {
                // INFO: Perform extracurricular data fetch first
                const extraResponse: extraDetail[] =
                    await performFetch("e");

                extraResponse ||
                    (() => {
                        updateErrorMessage(
                            `f; extra response is empty: ${extraResponse}`
                        );
                        toErrorPage();
                    });
                setExtraData(extraResponse);

                const courseType = getCourseType();
                const courseResponse: courseDetail[] =
                    await performFetch([
                        "c",
                        courseType,
                        INITIAL_LENGTH,
                    ]);
                courseResponse ||
                    (() => {
                        updateErrorMessage(
                            `f; course response is empty: ${courseResponse}`
                        );
                        toErrorPage();
                    });
                setCourseData(courseResponse);
            }
        };

        fetchData();
    }, []);

    /*   ***   *** API Portion ***   ***   */

    if (loading)
        return (
            <LoadingIndicator message="The data is coming, please wait..."></LoadingIndicator>
        );
    else {
        if (zoomLevel < CRITICAL_VALUE) {
            if (!secondaryFix) {
                setSecondaryFix(true);
            }
            if (secondaryFix) {
                scrollFix();
            }
            return (
                <div className={styles.change_container}>
                    <div
                        className={styles.wrapper}
                        style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: "center",
                            transition: "transform 0s linear",
                        }}
                    >
                        <div
                            className={styles.prelude}
                            ref={gradientRef}
                        >
                            <div className={styles.firstWrapper}>
                                <p className={styles.firstTitle}>
                                    Hannah's website
                                </p>
                                <p className={styles.firstSubtitle}>
                                    Scroll to Explore
                                </p>
                            </div>
                            <div className={styles.arrowWrapper}>
                                <img
                                    src="./arrow.png"
                                    className={styles.firstArrow}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            if (secondaryFix) {
                scrollFix();
                setSecondaryFix(false);
            }
            if (onFirstPage) setOnFirstPage(false);
            return (
                <Expand>
                    <div className={styles.change_second_page}>
                        <Fade>
                            <p className={styles.title}>My Courses</p>
                        </Fade>
                        {courseData && (
                            <CourseCardCollection
                                detailArray={courseData}
                            />
                        )}
                        <Fade>
                            <button
                                className={styles.navigateButton}
                                onClick={() => navigate("/course")}
                            >
                                Explore More
                            </button>
                        </Fade>
                        <Fade>
                            <p className={styles.title}>
                                My Activities
                            </p>
                        </Fade>
                        {extraData && (
                            <ExtracurricularCardCollection
                                detailArray={extraData}
                            />
                        )}
                        <Fade>
                            <button
                                className={styles.navigateButton}
                                onClick={() =>
                                    navigate("/extracurricular")
                                }
                            >
                                Explore More
                            </button>
                        </Fade>
                    </div>
                </Expand>
            );
        }
    }
}

export default Home;
