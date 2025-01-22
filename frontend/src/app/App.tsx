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
import Register from "../pages/register/register";
import Home from "../pages/home/home";
import { Navigate } from "react-router-dom";
import Extracurricular from "../pages/extracurricular/extracurricular";
import Course from "../pages/course/course";
import View from "../pages/forum/view/view";
import Post from "../pages/forum/post/post";
import Translate from "../pages/feedback/translate/translate";
import Transcribe from "../pages/feedback/transcribe/transcribe";
import Gallery from "../pages/gallery/react/gallery";
// import { NavbarProvider } from "../components/context/navbar";
// import { useNavbarContext } from "../components/context/navbar";
// import { GalleryProvider } from "../components/context/gallery";

function App() {
    return (
        <ErrorProvider>
            <SearchProvider>
                {/* <NavbarProvider> */}
                <DirectionProvider>
                    {/* <GalleryProvider> */}
                    <NavBar />
                    <main id="main-tag">
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/home" />}
                            />
                            <Route path="/home" element={<Home />} />
                            <Route
                                path="/error"
                                element={<Error />}
                            />
                            <Route path="*" element={<Error />} />
                            <Route
                                path="/search"
                                element={
                                    <LoginOnly>
                                        <Search />
                                    </LoginOnly>
                                }
                            />
                            <Route
                                path="/logout"
                                element={<Logout />}
                            />
                            <Route
                                path="/login"
                                element={<Login />}
                            ></Route>
                            <Route
                                path="/register"
                                element={<Register />}
                            ></Route>
                            <Route
                                path="/extracurricular"
                                element={<Extracurricular />}
                            ></Route>
                            <Route
                                path="/course"
                                element={<Course />}
                            ></Route>
                            <Route
                                path="/gallery"
                                element={<Gallery />}
                            ></Route>
                            <Route
                                path="/forum/view"
                                element={<View />}
                            ></Route>
                            <Route
                                path="/forum/view"
                                element={<View />}
                            ></Route>
                            <Route
                                path="/feedback/translate"
                                element={<Translate />}
                            ></Route>
                            <Route
                                path="/forum/post"
                                element={
                                    <LoginOnly>
                                        <Post />
                                    </LoginOnly>
                                }
                            ></Route>
                            <Route
                                path="/feedback/transcribe"
                                element={
                                    <LoginOnly>
                                        <Transcribe />
                                    </LoginOnly>
                                }
                            ></Route>
                        </Routes>
                    </main>
                    {/* </GalleryProvider> */}
                </DirectionProvider>
                {/* </NavbarProvider> */}
            </SearchProvider>
        </ErrorProvider>
    );
}

export default App;
