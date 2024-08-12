import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:7001/login', {
                email,
                password
            }).then(response => {
                if (response.data.success) {
                    navigate('/taskboard', { state: { email, password } });
                    setEmail("");
                    setPassword("");
                    setErrorMessage("");
                } else {
                    setErrorMessage("Email or password is incorrect!");
                }
            });
        } catch (error) {
            setErrorMessage('Login Failed');
        }
    };

    return (
        <main className="login">
            <section className="TitleContainer">
                <h1 className="logintitle">Login Page</h1>
            </section>

            <section className="loginContainer">
                <div className="formGroup">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                <div className="loginbutton">
                    <button onClick={handleLogin}>Log In</button>
                </div>
            </section>
        </main>
    );
};

export default Login;
