import { Routes, Route } from "react-router-dom";
import NavBar from "../navbar/Navbar";
import "./app.css";
import { ErrorProvider } from "../context/error";
import { SearchProvider } from "../context/search";

function App() {
    return (
        <ErrorProvider>
            <SearchProvider>
                <NavBar route="upload/gpa/get/"></NavBar>
                <main id="main-tag">
                    <Routes>
                        <Route></Route>
                    </Routes>
                </main>
            </SearchProvider>
        </ErrorProvider>
    );
}

export default App;
