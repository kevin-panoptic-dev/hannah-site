import { Routes, Route } from "react-router-dom";
import NavBar from "../components/navbar/Navbar";
import "./app.css";
import { ErrorProvider } from "../components/context/error";
import { SearchProvider } from "../components/context/search";
import Error from "../pages/error/Error";
import Search from "../pages/search/search";
import LoginOnly from "../components/authentication/login-checker";
import DonateOnly from "../components/authentication/admin-checker";
import AdminOnly from "../components/authentication/admin-checker";
import Logout from "../components/authentication/logout";

function App() {
    return (
        <ErrorProvider>
            <SearchProvider>
                <NavBar />
                <main id="main-tag">
                    <Routes>
                        <Route path="/error" element={<Error />} />
                        <Route path="*" element={<Error />} />
                        <LoginOnly>
                            <Route path="/search" element={<Search />} />
                        </LoginOnly>
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </main>
            </SearchProvider>
        </ErrorProvider>
    );
}

export default App;
