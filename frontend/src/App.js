import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

function App() {
    const [msg, setMsg] = React.useState("");
    const getMsg = () => {
        fetch("/api/test")
            .then((result) => result.json())
            .then((data) => {
                console.log(data);
                console.log(JSON.stringify(data));
                setMsg((msg) => {
                    return JSON.stringify(data);
                });
            });
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="App">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <p>
                                Edit <code>src/App.js</code> and save to reload.
                            </p>
                            <a
                                className="App-link"
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn React
                            </a>

                            <button onClick={getMsg}>Get msg</button>
                            <p>
                                {msg.length > 0 ? "Result from BE: " + msg : ""}
                            </p>
                            <Link to={"/about"}>About Page</Link>
                            <a href="/about">
                                Tag a to about page cause reload page
                            </a>
                            <Link to={"/test"}>Test Page</Link>
                            <Link to={"/test2"}>Test2 Page</Link>
                        </header>
                    </div>
                }
            />

            <Route path="/about" element={<div>This is about page</div>} />
            <Route path="/test" element={<div>This is test page</div>} />
            <Route path="/test2" element={<div>This is test 2 page</div>} />
            <Route path="*" element={<div>404 page</div>} />
        </Routes>
    );
}

export default App;
