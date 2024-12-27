import { Routes, Route } from "react-router-dom";
import NavBar from "../navbar/Navbar";
import "./app.css";

function App() {
    return (
        <>
            <NavBar route="upload/gpa/get/"></NavBar>
            <main id="main-tag">
                <Routes>
                    <Route></Route>
                </Routes>
            </main>
        </>
    );
}

export default App;
