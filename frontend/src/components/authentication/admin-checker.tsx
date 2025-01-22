import { jwtDecode } from "jwt-decode";
import { useState, useEffect, ReactNode } from "react";
import { REFRESH_TOKEN } from "../../utilities/api/constants";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../context/error";
import LoadingIndicator from "../../pages/loading/loading";
import { JwtPayload } from "jwt-decode";

interface childrenType {
    children: ReactNode;
}

interface decodedTokenType extends JwtPayload {
    is_admin: boolean | any;
}

function AdminOnly({ children }: childrenType) {
    const [isAdmin, setIsAdmin] = useState<undefined | boolean>(undefined);
    const { updateErrorMessage } = useErrorContext();
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");

    useEffect(() => {
        guard().catch((error) => {
            setIsAdmin(false);
            updateErrorMessage(`f;${error}`);
            toErrorPage();
        });
    }, []);

    const guard = async () => {
        const token = localStorage.getItem(REFRESH_TOKEN);

        if (!token) {
            setIsAdmin(false);
            updateErrorMessage("Permission Denied");
            toErrorPage();
            return;
        }
        const decodedToken = jwtDecode<decodedTokenType>(token);
        const is_admin = decodedToken.is_admin;

        if (typeof is_admin === "boolean") {
            if (is_admin) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                updateErrorMessage("Permission Denied");
                toErrorPage();
                return;
            }
        } else {
            updateErrorMessage(`b;invalid donator status: ${is_admin}`);
            toErrorPage();
        }
    };
    if (isAdmin === undefined) {
        return <LoadingIndicator message="checking for admin status..." />;
    }
    if (isAdmin) return children;
    else {
        updateErrorMessage("Permission Denied");
        toErrorPage();
        return <></>;
    }
}

export default AdminOnly;
