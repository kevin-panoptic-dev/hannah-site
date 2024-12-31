import { Navigate, useNavigate } from "react-router-dom";
import api from "../../utilities/api/api";
import { LOGOUT_PATH } from "../../utilities/constants";
import { REFRESH_TOKEN } from "../../utilities/api/constants";
import { useErrorContext } from "../context/error";

function Logout() {
    const navigate = useNavigate();
    const toErrorPage = () => navigate("/error");
    const { updateErrorMessage } = useErrorContext();

    const token = localStorage.getItem(REFRESH_TOKEN);
    localStorage.clear();

    const blacklistToken = async () => await api.post(LOGOUT_PATH, { refresh_token: token });

    if (token) {
        blacklistToken()
            .then((response) => {
                if (response.status !== 200) {
                    updateErrorMessage(`b;Status ${response.status}: ${response.data.detail}`);
                    toErrorPage();
                }
            })
            .catch((error) => {
                updateErrorMessage(`b;${error.message}`);
                toErrorPage();
            });
    }
    return <Navigate to="/login"></Navigate>;
}

export default Logout;
