import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:7001/login', {
                email,
                password
            });
            console.log("Logging in with", { email, password });
            navigate('/');
        } catch (error) {
            console.log('Login Failed', error.response ? error.response.data : error.message);
            navigate('/');
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Login Page</h1>
            <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin}>Log In</button>
            <p>
                Don't have an account? <button onClick={handleSignUp}>Sign Up</button>
            </p>
        </div>
    );
};

export default Login;
