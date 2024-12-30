import { Routes, Route } from "react-router-dom";
import NavBar from "../components/navbar/Navbar";
import "./app.css";
import { ErrorProvider } from "../components/context/error";
import { SearchProvider } from "../components/context/search";
import Error from "../pages/error/Error";
import Search from "../pages/search/search";

function App() {
    return (
        <ErrorProvider>
            <SearchProvider>
                <NavBar />
                <main id="main-tag">
                    <Routes>
                        <Route path="/error" element={<Error />} />
                        <Route path="*" element={<Error />} />
                        <Route path="/search" element={<Search />} />
                    </Routes>
                </main>
            </SearchProvider>
        </ErrorProvider>
    );
}

export default App;
