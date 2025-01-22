import styles from "./extracurricular.module.css";
import requestData from "../../utilities/data";
import {
    Parallax,
    ParallaxLayer,
    IParallax,
} from "@react-spring/parallax";
import extracurricularCardsType from "./type";
import { useErrorContext } from "../../components/context/error";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../loading/loading";
import { LAYER_VIEW_HEIGHT } from "./constants";
import {
    shuffle,
    filtration,
    serialization,
    // addDebugId,
} from "./functions";

// WARN: The parallax function have three major errors:
// INFO: After one day of debug I decided not to waste any more time
// ERROR: One page is not rendered successfully, so after slicing only 9 page exists
// ERROR: The final page has an ambiguous, and the speed prop is not doing anything
// ERROR: So that the final page's scroll is been locked
// WARN: The final three "next" button is also commented deliberately, as the 10th parallax layer is also never rendered successfully
// INFO: If anybody see this comment, contact epistula.kunyu@gmail.com and I will fix it as soon as possible!

function Extracurricular() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    const [extracurricularData, setExtracurricularData] = useState<
        extracurricularCardsType | undefined
    >(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performFetch = async () => {
            try {
                setLoading(true);
                const response = await requestData("e");
                if (response.status === 200) {
                    return response.data.detail;
                } else {
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
                }
            } catch (error) {
                updateErrorMessage(`f;${error}`);
                toErrorPage();
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            if (extracurricularData !== undefined) {
                updateErrorMessage(
                    `f;Extra Data must be undefined in order to perform initial data fetch, not ${extracurricularData}`
                );
                toErrorPage();
            } else {
                const extraResponse: extracurricularCardsType =
                    await performFetch();

                extraResponse ||
                    (() => {
                        updateErrorMessage(
                            `f; extra response is empty: ${extraResponse}`
                        );
                        toErrorPage();
                    });

                const filteredData = filtration(extraResponse).slice(
                    1,
                    15
                );
                const shuffledArray = shuffle(filteredData);
                // addDebugId()
                const serializedData = serialization(shuffledArray);

                setExtracurricularData(serializedData);
            }
        };

        extracurricularData || fetchData();
    }, []);

    const [suspend, setSuspend] = useState(false);
    // const [scrollPosition, setScrollPosition] = useState(0);
    const stop = useRef(null);
    const [timeToUpdate, setTimeToUpdate] = useState(0);
    const parallax = useRef<IParallax>(null);
    const scrollToTop = () => {
        if (parallax.current) {
            setSuspend(false);
            parallax.current.scrollTo(0);
        }
    };
    const scrollToBottom = () => {
        if (parallax.current) {
            const totalPages = 11;
            setSuspend(true);
            parallax.current.scrollTo(totalPages - 1 - 0.01);
        }
    };

    const scrollToPage = (page: number) => {
        if (page == 10) {
            return; // ERROR: this bug cannot be solved
        }
        if (parallax.current) {
            parallax.current.scrollTo(page + 0.04);
        }
    };

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.isIntersecting) {
    //                 setSuspend(true);
    //                 observer.unobserve(entry.target);
    //             }
    //         },

    //         {
    //             threshold: 0,
    //             root: document.getElementById("parallaxWrapper"),
    //         }
    //     );

    //     if (stop.current) {
    //         observer.observe(stop.current);
    //     }

    //     return () => observer.disconnect();
    // }, []);
    //

    // WARN: This code here is never tested to to be updated later
    useEffect(() => {
        let animationFrameId: number;

        const updateState = () => {
            setTimeToUpdate((previous) => +!previous);
            animationFrameId = requestAnimationFrame(updateState);
        };

        if (!suspend) {
            animationFrameId = requestAnimationFrame(updateState);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [suspend]);
    // useEffect(() => {
    //     let interval: NodeJS.Timeout;
    //     if (!suspend) {
    //         interval = setInterval(() => {
    //             setTimeToUpdate((previous) => +!previous);
    //         }, 1);
    //     }
    //     return () => {
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //     };
    // }, []);

    // const handleSuspend = () => {
    //     if (parallax.current) {
    //         const currentScrollPosition = parallax.current.offset;
    //         console.log(currentScrollPosition);

    //         if (currentScrollPosition >= 1) {
    //             setSuspend(true);
    //         } else {
    //             setSuspend(false);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     handleSuspend();
    // }, [timeToUpdate]);

    // const handleScroll = () => {
    //     const container = parallax.current?.container;
    //     if (container) {
    //         const scrollTop = container.scrollTop;
    //         const scrollHeight =
    //             container.scrollHeight - container.clientHeight;
    //         const normalizedScrollPosition = scrollTop / scrollHeight;
    //         setScrollPosition(normalizedScrollPosition);
    //         console.log("Scroll Position:", normalizedScrollPosition);
    //     }
    // };

    // INFO: This works!
    // INFO: Infinite re-render is literally GOD, despite it may blow up my mac...
    // WARN: (use significant amount of energy)
    // WARN: despite the strenuous effort, user is still able to exfiltrate the infinite loop tactic...
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSuspend(true);
                }
            },
            {
                threshold: 0.95,
            }
        );
        if (stop.current) {
            observer.observe(stop.current);
        }
        return () => observer.disconnect();
    }, [timeToUpdate]); // WARN: infinitely re-trigger this useEffect

    if (loading || !extracurricularData) {
        return (
            <LoadingIndicator message="Wait a second..."></LoadingIndicator>
        );
    } else {
        return (
            <Parallax
                className={styles.change_container}
                pages={extracurricularData.length + 2}
                ref={parallax}
                enabled={suspend ? false : true}
                id="parallaxWrapper"
            >
                <ParallaxLayer
                    className={styles.titleLayer}
                    sticky={{
                        start: 0.0,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                    factor={1}
                    offset={0}
                    speed={0}
                >
                    <p className={styles.title}>
                        Extracurricular Activities
                    </p>
                    <p
                        className={styles.scrollText}
                        onClick={scrollToBottom}
                    >
                        wanna to scroll faster? <br />
                        click me
                    </p>

                    <p className={styles.firstSubtitle}>
                        Scroll to Explore
                    </p>
                    <div className={styles.arrowWrapper}>
                        <img
                            src="./black-arrow.png"
                            className={styles.firstArrow}
                        />
                    </div>
                </ParallaxLayer>
                {/* // WARN: Map does not work due to an unexplainable
                // WARN: potentially due to react spring error
                // INFO: This is main content */}
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[0].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[0].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[0].id % 2 === 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[0].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[0]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[0].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[0].reason}
                                </p>

                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(2)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[0]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[0].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[0].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(2)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[0].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[1].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[1].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[1].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[1].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[1]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[1].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[1].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(3)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[1]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[1].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[1].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(3)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[1].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[2].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[2].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[2].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[2].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[2]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[2].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[2].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(4)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[2]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[2].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[2].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(4)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[2].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[3].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[3].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[3].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[3].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[3]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[3].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[3].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(5)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[3]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[3].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[3].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(5)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[3].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[4].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[4].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[4].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[4].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[4]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[4].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[4].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(6)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[4]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[4].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[4].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(6)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[4].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[5].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[5].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[5].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[5].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[5]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[5].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[5].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(7)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[5]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[5].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[5].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(7)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[5].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[6].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[6].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[6].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[6].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[6]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[6].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[6].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(8)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[6]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[6].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[6].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    onClick={() => scrollToPage(8)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[6].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[7].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[7].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[7].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[7].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[7]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[7].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[7].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    // onClick={() => scrollToPage(9)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[7]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[7].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[7].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    // onClick={() => scrollToPage(9)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[7].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[8].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[8].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[8].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[8].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[8]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[8].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[8].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    // onClick={() => scrollToPage(10)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[8]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[8].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[8].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    // onClick={() => scrollToPage(10)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[8].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>
                <ParallaxLayer
                    className={styles.oneLayer}
                    offset={extracurricularData[9].id}
                    factor={LAYER_VIEW_HEIGHT}
                    sticky={{
                        start:
                            extracurricularData[9].id *
                            LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                >
                    {extracurricularData[9].id % 2 == 0 ? (
                        <>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[9].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[9]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[9].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[9].reason}
                                </p>
                                <p
                                    className={styles.scrollText}
                                    // onClick={() => scrollToPage(11)}
                                >
                                    next
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.textContainer}>
                                <p
                                    className={
                                        styles.extracurricularName
                                    }
                                >
                                    {
                                        extracurricularData[9]
                                            .extracurricular_name
                                    }
                                </p>
                                <p className={styles.date}>
                                    Date:{" "}
                                    {extracurricularData[9].date}
                                </p>
                                <p className={styles.reason}>
                                    Reason:{" "}
                                    {extracurricularData[9].reason}
                                </p>
                                {/* 
                                    // INFO: cannot enable the 10 and 11 next
                                */}
                                <p
                                    className={styles.scrollText}
                                    // onClick={() => scrollToPage(11)}
                                >
                                    next
                                </p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        extracurricularData[9].image!
                                    }
                                    className={styles.image}
                                />
                            </div>
                        </>
                    )}
                    ;
                </ParallaxLayer>

                {
                    // INFO: This is the bottom
                }
                <ParallaxLayer
                    className={styles.redirectLayer}
                    offset={
                        extracurricularData[
                            extracurricularData.length - 1
                        ].id + 1
                    }
                    factor={1}
                    sticky={{
                        start:
                            extracurricularData[
                                extracurricularData.length - 1
                            ].id * LAYER_VIEW_HEIGHT,
                        end: Number.MAX_SAFE_INTEGER,
                    }}
                    speed={0}
                    onClick={() => navigate("/gallery")}
                >
                    <div className={styles.finalText} ref={stop}>
                        <div className={styles.text}>
                            <p className={styles.instructions}>
                                click anywhere to see more...
                            </p>
                            <p
                                className={styles.scrollText}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    scrollToTop();
                                }}
                            >
                                go back
                            </p>
                        </div>
                    </div>
                </ParallaxLayer>
            </Parallax>
        );
    }
}

export default Extracurricular;
