import api from "../../utilities/api/api";
import styles from "./register.module.css";
import { REGISTER_PATH, LOGIN_PATH } from "../../utilities/constants";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../components/context/error";
import { useDirectionContext } from "../../components/context/direction";
import {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
} from "../../utilities/api/constants";
import LoadingIndicator from "../loading/loading";

function Register() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    const { route, updateRoute } = useDirectionContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showInvalid, setShowInvalid] = useState(false);
    const [warningMessage, setWarningMessage] =
        useState("placeholder");

    const login = async () =>
        await api.post(LOGIN_PATH, { username: username });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.post(
                REGISTER_PATH,
                {
                    username: username,
                    password: password,
                    email: email,
                },
                { validateStatus: () => true }
            );

            // INFO: Check all the possible response status from rest genetic api
            // WARN: Only three cases are tested
            // WARN: Password has no restrictions, "1234567890" is also valid
            // WARN: Unknown response status (OK || CREATED)
            if (response.status === 200 || response.status === 201) {
                setEmail("");
                setPassword("");
                setUsername("");
                login()
                    .then((tokenData) => {
                        const accessToken = tokenData.data.access;
                        const refreshToken = tokenData.data.refresh;
                        localStorage.setItem(
                            ACCESS_TOKEN,
                            accessToken
                        );
                        localStorage.setItem(
                            REFRESH_TOKEN,
                            refreshToken
                        );
                        if (route) {
                            const direction = route;
                            updateRoute(null);
                            navigate(direction);
                        } else {
                            navigate("/");
                        }
                    })
                    .catch((error) => {
                        // SAFE
                        updateErrorMessage(`f;${error.message}`);
                        toErrorPage();
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else if (response.status === 400) {
                setShowInvalid(true);
                if (response.data.username !== undefined) {
                    setWarningMessage(
                        `${response.data.username[0]} Try again.`
                    );
                } else if (response.data.email !== undefined) {
                    setWarningMessage(
                        `${response.data.email[0]} Try again.`
                    );
                } else {
                    // console.log(1);
                    updateErrorMessage(`b;${response}`);
                    toErrorPage();
                }
                // INFO: Error resolved
                // ERROR: An unresolved, unknown [object Object] error occurs.
                // console.error(
                //     `BackendError: status=${response.status}, error=${response.data.detail}.`
                // );
                // updateErrorMessage(`b;${response.status} error: ${response.data.detail}`);
                // toErrorPage();
            } else {
                // console.log(2);
                updateErrorMessage(`b;${response}`);
                toErrorPage();
            }
        } catch (error) {
            // SAFE
            if (error instanceof Error) {
                updateErrorMessage(`f;${error.message}`);
            } else {
                updateErrorMessage(
                    `f;caught error ${error} is not an instance of Error.`
                );
            }
            toErrorPage();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LoadingIndicator message="you are almost there..."></LoadingIndicator>
        );
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.leftHalf}>
                    <div className={styles.leftContainer}>
                        <p className={styles.leftTitle}>
                            Support My Dream!
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (password.length >= 8) {
                                    username.trim() &&
                                        password.trim() &&
                                        email.trim() &&
                                        handleSubmit(e);
                                } else {
                                    setWarningMessage(
                                        "Password must be at least 8 characters long."
                                    );
                                    setShowInvalid(true);
                                }
                            }}
                            className={styles.wrapperForm}
                        >
                            <div className={styles.alignWrapper}>
                                <p className={styles.subtitle}>
                                    Username
                                </p>
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                                className={styles.inputBox}
                            />
                            <div className={styles.alignWrapper}>
                                <p className={styles.subtitle}>
                                    Organization Email
                                </p>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                className={styles.inputBox}
                            />
                            <div className={styles.alignWrapper}>
                                <p className={styles.subtitle}>
                                    Password
                                </p>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                className={styles.inputBox}
                            />
                            <button
                                type="submit"
                                className={styles.formButton}
                            >
                                Get Start Today
                            </button>
                        </form>
                        {showInvalid && (
                            <p className={styles.warning}>
                                {warningMessage}
                            </p>
                        )}
                    </div>
                    <p className={styles.forOld}>
                        Already have an account?{" "}
                        <span
                            className={styles.leftSpan}
                            onClick={() => navigate("/login")}
                        >
                            Login {">"}
                        </span>
                    </p>
                </div>
                <div className={styles.rightHalf}>
                    <p className={styles.rightTitle}>
                        Build our future together
                    </p>
                    <div className={styles.rightContainer}>
                        <div className={styles.rightBoxes}>
                            <svg
                                className={styles.SVG}
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                            >
                                <g clipPath="url(#clip0_1_172)">
                                    <path
                                        d="M15.8335 7.50001L16.8752 5.20834L19.1668 4.16668L16.8752 3.12501L15.8335 0.833344L14.7918 3.12501L12.5002 4.16668L14.7918 5.20834L15.8335 7.50001Z"
                                        fill="white"
                                    ></path>
                                    <path
                                        d="M15.8335 12.5L14.7918 14.7917L12.5002 15.8333L14.7918 16.875L15.8335 19.1667L16.8752 16.875L19.1668 15.8333L16.8752 14.7917L15.8335 12.5Z"
                                        fill="white"
                                    ></path>
                                    <path
                                        d="M9.5835 7.91668L7.50016 3.33334L5.41683 7.91668L0.833496 10L5.41683 12.0833L7.50016 16.6667L9.5835 12.0833L14.1668 10L9.5835 7.91668ZM8.32516 10.825L7.50016 12.6417L6.67516 10.825L4.8585 10L6.67516 9.17501L7.50016 7.35834L8.32516 9.17501L10.1418 10L8.32516 10.825Z"
                                        fill="white"
                                    ></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_172">
                                        <rect
                                            fill="white"
                                            height="20"
                                            width="20"
                                        ></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={styles.contentWrapper}>
                                <p className={styles.innerTitle}>
                                    Join my community
                                </p>
                                <p
                                    className={
                                        styles.innerDescription
                                    }
                                >
                                    Join a community of aspiring
                                    students and gain access to tools
                                    and resources to simplify your or
                                    your child's college admissions
                                    process.
                                </p>
                            </div>
                        </div>
                        <div className={styles.rightBoxes}>
                            <svg
                                className={styles.SVG}
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M15.8333 4.16667H14.1667V2.5H5.83333V4.16667H4.16667C3.25 4.16667 2.5 4.91667 2.5 5.83333V6.66667C2.5 8.79167 4.1 10.525 6.15833 10.7833C6.68333 12.0333 7.80833 12.975 9.16667 13.25V15.8333H5.83333V17.5H14.1667V15.8333H10.8333V13.25C12.1917 12.975 13.3167 12.0333 13.8417 10.7833C15.9 10.525 17.5 8.79167 17.5 6.66667V5.83333C17.5 4.91667 16.75 4.16667 15.8333 4.16667ZM4.16667 6.66667V5.83333H5.83333V9.01667C4.86667 8.66667 4.16667 7.75 4.16667 6.66667ZM10 11.6667C8.625 11.6667 7.5 10.5417 7.5 9.16667V4.16667H12.5V9.16667C12.5 10.5417 11.375 11.6667 10 11.6667ZM15.8333 6.66667C15.8333 7.75 15.1333 8.66667 14.1667 9.01667V5.83333H15.8333V6.66667Z"
                                    fill="white"
                                ></path>
                            </svg>
                            <div
                                className={styles.contentWrapper}
                                style={{ marginLeft: "-10px" }}
                            >
                                <p className={styles.innerTitle}>
                                    Be my friend
                                </p>
                                <p
                                    className={
                                        styles.innerDescription
                                    }
                                >
                                    Stay in touch, and get
                                    professional, helpful advice from
                                    successful student.
                                </p>
                            </div>
                        </div>
                        <div className={styles.rightBoxes}>
                            <svg
                                className={styles.SVG}
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M5.00033 12.4997C4.30866 12.4997 3.68366 12.783 3.23366 13.233C2.25033 14.2163 1.66699 18.333 1.66699 18.333C1.66699 18.333 5.78366 17.7497 6.76699 16.7663C7.21699 16.3163 7.50033 15.6913 7.50033 14.9997C7.50033 13.6163 6.38366 12.4997 5.00033 12.4997ZM5.59199 15.5913C5.35866 15.8247 3.78366 16.2247 3.78366 16.2247C3.78366 16.2247 4.17533 14.658 4.41699 14.4163C4.55866 14.258 4.76699 14.1663 5.00033 14.1663C5.45866 14.1663 5.83366 14.5413 5.83366 14.9997C5.83366 15.233 5.74199 15.4413 5.59199 15.5913ZM14.517 11.3747C19.817 6.07467 18.0503 1.94967 18.0503 1.94967C18.0503 1.94967 13.9253 0.183 8.62533 5.483L6.55033 5.06633C6.00866 4.958 5.44199 5.133 5.04199 5.52467L1.66699 8.908L5.83366 10.6913L9.30866 14.1663L11.092 18.333L14.467 14.958C14.8587 14.5663 15.0337 13.9997 14.9253 13.4497L14.517 11.3747ZM6.17533 9.02467L4.58366 8.34133L6.22533 6.69967L7.42533 6.94133C6.95033 7.633 6.52533 8.358 6.17533 9.02467ZM11.6587 15.4163L10.9753 13.8247C11.642 13.4747 12.367 13.0497 13.0503 12.5747L13.292 13.7747L11.6587 15.4163ZM13.3337 10.1997C12.2337 11.2997 10.517 12.1997 9.96699 12.4747L7.52533 10.033C7.79199 9.49133 8.69199 7.77467 9.80033 6.66633C13.7003 2.76633 16.6587 3.34133 16.6587 3.34133C16.6587 3.34133 17.2337 6.29967 13.3337 10.1997ZM12.5003 9.16633C13.417 9.16633 14.167 8.41633 14.167 7.49967C14.167 6.583 13.417 5.833 12.5003 5.833C11.5837 5.833 10.8337 6.583 10.8337 7.49967C10.8337 8.41633 11.5837 9.16633 12.5003 9.16633Z"
                                    fill="white"
                                ></path>
                            </svg>
                            <div className={styles.contentWrapper}>
                                <p className={styles.innerTitle}>
                                    Make progress with me
                                </p>
                                <p
                                    className={
                                        styles.innerDescription
                                    }
                                >
                                    Partner with a mentor who
                                    understands your goals and will
                                    guide you step-by-step toward
                                    achieving them, empowering you to
                                    succeed in your academic journey
                                    and beyond.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
