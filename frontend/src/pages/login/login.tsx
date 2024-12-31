import styles from "./login.module.css";
import api from "../../utilities/api/api";
import { LOGIN_PATH } from "../../utilities/constants";
import LoadingIndicator from "../loading/loading";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../components/context/error";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../utilities/api/constants";
import { useDirectionContext } from "../../components/context/direction";

function Login() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();
    const { route, updateRoute } = useDirectionContext();

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [countDown, setCountDown] = useState(3);
    const [showInvalid, setShowInvalid] = useState(false);
    const [showOption, setShowOption] = useState(false);

    /*
    0, 1, 2 principle:
    0 => username, 1 => password, 2 => email
    input type <= sum of the two numbers
    */
    const [inputType, setInputType] = useState<number>(1);
    const toEmailAndPassword = () => setInputType(3);
    const toNameAndEmail = () => setInputType(2);
    const toNameAndPassword = () => setInputType(1);

    const getInputType = () => {
        if (inputType === 1) {
            return ["text", "password"];
        } else if (inputType === 2) {
            return ["text", "email"];
        } else {
            return ["email", "password"];
        }
    };

    const getOptions = () => {
        if (inputType === 1) {
            return (
                <>
                    <p className={styles.optionText} onClick={toNameAndEmail}>
                        Username + Email
                    </p>
                    <p className={styles.optionText} onClick={toEmailAndPassword}>
                        Email + Password
                    </p>
                </>
            );
        } else if (inputType === 2) {
            return (
                <>
                    <p className={styles.optionText} onClick={toNameAndPassword}>
                        Username + Password
                    </p>
                    <p className={styles.optionText} onClick={toEmailAndPassword}>
                        Email + Password
                    </p>
                </>
            );
        } else {
            return (
                <>
                    <p className={styles.optionText} onClick={toNameAndPassword}>
                        Username + Password
                    </p>
                    <p className={styles.optionText} onClick={toNameAndEmail}>
                        Username + Email
                    </p>
                </>
            );
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            let response;
            if (inputType === 1) {
                response = await api.post(LOGIN_PATH, { username: username, password: password });
            } else if (inputType === 2) {
                response = await api.post(LOGIN_PATH, { username: username, email: email });
            } else {
                response = await api.post(LOGIN_PATH, { email: email, password: password });
            }

            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                if (route !== null) {
                    updateRoute(null);
                    navigate(route);
                } else {
                    navigate("/");
                }
            } else if (response.status === 401) {
                setCountDown((previous) => previous - 1);
                setEmail("");
                setUsername("");
                setPassword("");
                if (!countDown) {
                    updateErrorMessage("f;Too many invalid inputs.");
                    toErrorPage();
                }
                if (!showInvalid) {
                    setShowInvalid(true);
                }
            } else {
                updateErrorMessage(`b;${response.status} error: ${response.data.detail}`);
                toErrorPage();
            }
        } catch (error) {
            if (error instanceof Error) {
                updateErrorMessage(`f;${error.message}`);
            } else {
                updateErrorMessage(`f;caught error ${error} is not an instance of Error.`);
            }
            toErrorPage();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingIndicator message="you are almost logged in..."></LoadingIndicator>;
    } else {
        return (
            <div className={styles.change_container}>
                <div className={styles.container}>
                    <form onSubmit={(e) => handleSubmit(e)} className={styles.wrapperForm}>
                        <input
                            type={getInputType()[0]}
                            value={inputType === 3 ? email : username}
                            onChange={(e) => {
                                inputType === 3
                                    ? setEmail(e.target.value)
                                    : setUsername(e.target.value);
                            }}
                            placeholder={getInputType()[0] !== "text" ? getInputType()[0] : "text"}
                            className={styles.inputBox}
                        />
                        <input
                            type={getInputType()[1]}
                            value={inputType === 2 ? email : username}
                            onChange={(e) => {
                                inputType === 2
                                    ? setEmail(e.target.value)
                                    : setPassword(e.target.value);
                            }}
                            placeholder={getInputType()[1]}
                            className={styles.inputBox}
                        />
                        <button type="submit" className={styles.formButton}>
                            Login
                        </button>
                    </form>
                    {showInvalid && (
                        <p className={styles.warning}>
                            Invalid authentication credential, you have {countDown} attempt left.
                        </p>
                    )}
                    <p className={styles.option} onClick={() => setShowOption(true)}>
                        {showOption ? "Less Options" : "More Options"}
                    </p>
                    {showOption && <div className={styles.optionContainer}>{getOptions()}</div>}
                </div>
            </div>
        );
    }
}

export default Login;
