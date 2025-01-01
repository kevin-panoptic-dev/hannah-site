import { Routes, Route } from "react-router-dom";
import NavBar from "../components/navbar/Navbar";
import "./app.css";
import { ErrorProvider } from "../components/context/error";
import { SearchProvider } from "../components/context/search";
import { DirectionProvider } from "../components/context/direction";
import Error from "../pages/error/Error";
import Search from "../pages/search/search";
import LoginOnly from "../components/authentication/login-checker";
import DonateOnly from "../components/authentication/admin-checker";
import AdminOnly from "../components/authentication/admin-checker";
import Logout from "../components/authentication/logout";
import Login from "../pages/login/login";

function App() {
    return (
        <ErrorProvider>
            <SearchProvider>
                <DirectionProvider>
                    <NavBar />
                    <main id="main-tag">
                        <Routes>
                            <Route path="/error" element={<Error />} />
                            <Route path="*" element={<Error />} />
                            <Route
                                path="/search"
                                element={
                                    <LoginOnly>
                                        <Search />
                                    </LoginOnly>
                                }
                            />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/login" element={<Login />}></Route>
                        </Routes>
                    </main>
                </DirectionProvider>
            </SearchProvider>
        </ErrorProvider>
    );
}

export default App;
