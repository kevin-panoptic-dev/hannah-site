import { jwtDecode } from "jwt-decode";
import { useState, useEffect, ReactNode } from "react";
import { REFRESH_TOKEN } from "../../utilities/api/constants";
import { useNavigate, Navigate } from "react-router-dom";
import { useErrorContext } from "../context/error";
import LoadingIndicator from "../../pages/loading/loading";
import { JwtPayload } from "jwt-decode";

interface childrenType {
    children: ReactNode;
}

interface decodedTokenType extends JwtPayload {
    is_donator: boolean | any;
}

function DonateOnly({ children }: childrenType) {
    const [isDonated, setIsDonated] = useState<undefined | boolean>(undefined);
    const { updateErrorMessage } = useErrorContext();
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");

    useEffect(() => {
        guard().catch((error) => {
            setIsDonated(false);
            updateErrorMessage(`f;${error}`);
            toErrorPage();
        });
    }, []);

    const guard = async () => {
        const token = localStorage.getItem(REFRESH_TOKEN);

        if (!token) {
            setIsDonated(false);
            navigate("/login");
            return;
        }
        const decodedToken = jwtDecode<decodedTokenType>(token);
        const is_donator = decodedToken.is_donator;

        if (typeof is_donator === "boolean") {
            if (is_donator) {
                setIsDonated(true);
            } else {
                setIsDonated(false);
                navigate("/donate");
                return;
            }
        } else {
            updateErrorMessage(`b;invalid donator status: ${is_donator}`);
            toErrorPage();
        }
    };
    if (isDonated === undefined) {
        return <LoadingIndicator message="next page is more excited..." />;
    }
    return isDonated ? children : <Navigate to="/donate"></Navigate>;
}

export default DonateOnly;
