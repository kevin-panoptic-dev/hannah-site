import { jwtDecode } from "jwt-decode";
import api from "../../utilities/api/api";
import { useState, useEffect, ReactNode } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utilities/api/constants";
import { useNavigate, Navigate } from "react-router-dom";
import { useErrorContext } from "../context/error";
import LoadingIndicator from "../../pages/loading/loading";
import { REFRESH_TOKEN_PATH } from "../../utilities/constants";

interface childrenType {
    children: ReactNode;
}

function LoginOnly({ children }: childrenType) {
    const [isAuthorized, setIsAuthorized] = useState<undefined | boolean>(undefined);
    const { updateErrorMessage } = useErrorContext();
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");

    useEffect(() => {
        auth().catch((error) => {
            setIsAuthorized(false);
            updateErrorMessage(`b;${error}`);
            toErrorPage();
        });
    }, []);

    const refresh = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post(REFRESH_TOKEN_PATH, { refresh: refreshToken });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decodedToken = jwtDecode(token);
        const tokenExpiration = decodedToken.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration) {
            if (tokenExpiration < now) {
                await refresh();
            } else {
                setIsAuthorized(true);
            }
        } else {
            updateErrorMessage(`b;invalid token expiration date ${tokenExpiration}`);
            toErrorPage();
        }
    };
    if (isAuthorized === undefined) {
        return <LoadingIndicator message="next page is more excited..." />;
    }
    return isAuthorized ? children : <Navigate to="/login"></Navigate>;
}

export default LoginOnly;
