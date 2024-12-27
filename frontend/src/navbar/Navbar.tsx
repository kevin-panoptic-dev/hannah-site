import api from "../api/api";
import styles from "./navbar.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent, useRef } from "react";

interface navbarType {
    route: string;
}

function NavBar({ route }: navbarType) {
    const navigate = useNavigate();
    const redirect = (place: string): void => {
        navigate(`/${place}`);
    };
    /*
    hoveredText === null -> nothing is hovered, set black
    hoveredText !== null && hoveredText !== start char -> not it, set gray
    hoveredText !== null && hoveredText === start char -> targeted set black, display content
    set black as default
    */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [gpaGraphUrl, setGpaGraphUrl] = useState<undefined | string>(undefined);
    const [hoveredText, setHoveredText] = useState<string | null>(null);
    const [userInput, setUserInput] = useState<string>("");
    const [shouldDisableScroll, setShouldDisableScroll] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInput.trim()) {
            alert("Please enter a valid search input.");
            return;
        }
        navigate("/ai/search", { state: userInput.trim() });
    };

    const handleMouseIn = (firstCharacter: string): void => {
        setHoveredText(firstCharacter);
    };

    const handleSearchClick = () => {
        if (hoveredText !== "f") {
            setHoveredText("f");
        } else {
            setHoveredText(null);
        }
    };

    useEffect(() => {
        const handleMouseOut = (event: MouseEvent) => {
            const windowHeight = window.innerHeight;
            const mouseY = event.clientY;
            const bottom40Threshold = windowHeight * 0.6;
            if (mouseY >= bottom40Threshold) {
                setHoveredText(null);
            }
        };
        const handleMouseEscape = () => {
            setHoveredText(null);
        };
        document.addEventListener("mouseleave", handleMouseEscape);
        document.addEventListener("mousemove", handleMouseOut);
        return () => {
            document.removeEventListener("mousemove", handleMouseOut);
            document.removeEventListener("mouseleave", handleMouseEscape);
        };
    }, []);

    useEffect(() => {
        const getGpaResponse = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(route, { responseType: "blob" });
                if (response.status === 500) {
                    if (typeof response.data === "object") {
                        const text = await response.data.text();
                        const jsonData = JSON.parse(text);
                        throw new Error(jsonData);
                    } else {
                        throw new Error("An unknown error occurs.");
                    }
                } else {
                    const url = URL.createObjectURL(response.data);
                    setGpaGraphUrl(url);
                }
            } catch (error) {
                alert(error);
            } finally {
                setIsLoading(false);
            }
        };
        getGpaResponse();
    }, [route]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [hoveredText]);

    useEffect(() => {
        if (hoveredText === null) {
            setShouldDisableScroll(false);
        } else {
            setShouldDisableScroll(true);
        }
    }, [hoveredText]);

    useEffect(() => {
        if (shouldDisableScroll) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [shouldDisableScroll]);

    useEffect(() => {
        const handleZoomOut = () => {
            const mainTag = document.querySelector<HTMLElement>("#main-tag");
            if (mainTag) {
                mainTag.style.transition = "transform 0.5s ease";
                mainTag.style.transform = "scale(0.9)";
            }
        };
        const handleZoomBack = () => {
            const mainTag = document.querySelector<HTMLElement>("#main-tag");
            if (mainTag) {
                // console.log("perform some transformation");
                mainTag.style.transition = "transform 0.3s ease";
                mainTag.style.transform = "scale(1)";
            } else {
                throw new Error("Unable to perform transformation.");
            }
        };
        if (shouldDisableScroll) {
            handleZoomOut();
        } else {
            handleZoomBack();
        }
    }, [shouldDisableScroll]);

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return (
            <nav>
                <ul className={styles.container}>
                    <div className={styles.home}>
                        <p className={styles.heading} onClick={() => redirect("")}>
                            Hannah's website
                        </p>
                    </div>

                    <div className={styles.middle}>
                        <p
                            className={`${styles.academic} 
                                ${hoveredText && hoveredText !== "a" ? styles.togray : ""} 
                                ${hoveredText === "a" ? styles.ontarget : ""}`}
                            onMouseEnter={() => handleMouseIn("a")}
                        >
                            Academic
                        </p>
                        <div
                            className={`${styles.academicDropdown} ${
                                hoveredText === "a" ? styles.show : ""
                            }`}
                        >
                            <div className={styles.academicDropdownContent}>
                                <div className={styles.academicAlignWrapper}>
                                    <div className={styles.testContainer}>
                                        <p className={styles.testHeader}>Test Score</p>
                                        <p className={styles.testContent}>SAT</p>
                                        <p className={styles.testContent}>ACT</p>
                                        <p className={styles.testContent}>AP</p>
                                    </div>
                                </div>

                                <div className={styles.courseContainer}>
                                    <p className={styles.CourseHeader}>Course Details</p>
                                    <p className={styles.CourseContent}>My Math courses ↗</p>
                                    <p className={styles.CourseContent}>My Science courses ↗</p>
                                    <p className={styles.CourseContent}>My English courses ↗</p>
                                    <p className={styles.CourseContent}>Other ↗</p>
                                </div>
                                {gpaGraphUrl && (
                                    <div className={styles.gpaGraphContainer}>
                                        <img src={gpaGraphUrl} className={styles.gpaGraph} />
                                        <p className={styles.gpaHeader}>GPA Trend</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p
                            className={`${styles.school} 
                                ${hoveredText && hoveredText !== "s" ? styles.togray : ""} 
                                ${hoveredText === "s" ? styles.ontarget : ""}`}
                            onMouseEnter={() => handleMouseIn("s")}
                        >
                            School Life
                        </p>
                        <div
                            className={`${styles.schoolDropdown} ${
                                hoveredText === "s" ? styles.show : ""
                            }`}
                        >
                            <div className={styles.schoolDropdownContent}>
                                <div className={styles.schoolAlignWrapper}>
                                    <div className={styles.clubContainer}>
                                        <p className={styles.clubHeader}>Clubs & Activities</p>
                                        <p className={styles.clubContent}>Student Council ↗</p>
                                        <p className={styles.clubContent}>Debate Team ↗</p>
                                        <p className={styles.clubContent}>Sports Teams ↗</p>
                                    </div>
                                </div>

                                <div className={styles.eventContainer}>
                                    <p className={styles.eventHeader}>School Events</p>
                                    <p className={styles.eventContent}>Competitions ↗</p>
                                    <p className={styles.eventContent}>Performances ↗</p>
                                    <p className={styles.eventContent}>Exhibitions ↗</p>
                                </div>
                            </div>
                        </div>
                        <p
                            className={`${styles.beyond} 
                                ${hoveredText && hoveredText !== "b" ? styles.togray : ""} 
                                ${hoveredText === "b" ? styles.ontarget : ""}`}
                            onMouseEnter={() => handleMouseIn("b")}
                        >
                            Beyond Studying
                        </p>
                        <div
                            className={`${styles.beyondDropdown} ${
                                hoveredText === "b" ? styles.show : ""
                            }`}
                        >
                            <div className={styles.beyondDropdownContent}>
                                <div className={styles.beyondAlignWrapper}>
                                    <div className={styles.hobbyContainer}>
                                        <p className={styles.hobbyHeader}>Hobbies</p>
                                        <p className={styles.hobbyContent}>Art Gallery ↗</p>
                                        <p className={styles.hobbyContent}>Music ↗</p>
                                        <p className={styles.hobbyContent}>Travel ↗</p>
                                    </div>
                                </div>

                                <div className={styles.projectContainer}>
                                    <p className={styles.projectHeader}>Personal Projects</p>
                                    <p className={styles.projectContent}>Coding Projects ↗</p>
                                    <p className={styles.projectContent}>Writing ↗</p>
                                    <p className={styles.projectContent}>Photography ↗</p>
                                </div>
                            </div>
                        </div>

                        <p
                            className={`${styles.contact} 
                                ${hoveredText && hoveredText !== "c" ? styles.togray : ""} 
                                ${hoveredText === "c" ? styles.ontarget : ""}`}
                            onMouseEnter={() => handleMouseIn("c")}
                        >
                            Contact Me
                        </p>
                        <div
                            className={`${styles.contactDropdown} ${
                                hoveredText === "c" ? styles.show : ""
                            }`}
                        >
                            <div className={styles.contactDropdownContent}>
                                <div className={styles.contactAlignWrapper}>
                                    <div className={styles.socialContainer}>
                                        <p className={styles.socialHeader}>Social Media</p>
                                        <p className={styles.socialContent}>LinkedIn ↗</p>
                                        <p className={styles.socialContent}>GitHub ↗</p>
                                        <p className={styles.socialContent}>Instagram ↗</p>
                                    </div>
                                </div>

                                <div className={styles.messageContainer}>
                                    <p className={styles.messageHeader}>Get in Touch</p>
                                    <p className={styles.messageContent}>Email Me ↗</p>
                                    <p className={styles.messageContent}>Schedule Meeting ↗</p>
                                    <p className={styles.messageContent}>Leave Message ↗</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.search} onClick={handleSearchClick}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.searchIcon}
                        >
                            <path d="M 15,8 A 7,7 0 1,1 1,8 A 7,7 0 1,1 15,8"></path>
                            <path d="M 13,13 L 20,20"></path>
                        </svg>
                    </div>
                    <div
                        className={`${styles.searchDropdownContent} ${
                            hoveredText && hoveredText === "f" ? styles.show : ""
                        }`}
                    >
                        <form onSubmit={(e) => handleSubmitSearch(e)}>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Press `Return` to use AI powered search"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                ref={inputRef}
                            />
                        </form>
                    </div>
                </ul>
            </nav>
        );
    }
}

export default NavBar;
