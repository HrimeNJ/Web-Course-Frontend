import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Login.module.css";

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
            }).then(response =>{
                if(response.data.success){
                    console.log("Logging in with", { email, password });
                    navigate('/taskboard', { state: { email, password } });
                    setEmail("")
                    setPassword("")
                    setErrorMessage("")
                }else{
                    setErrorMessage("Email or password is incorrect!")
                }

            });
        } catch (error) {
            console.log('Login Failed', error.response ? error.response.data : error.message);
            navigate('/');
        }
    };

    const handleSignUp = () => {
        // navigate('/signup');
        handleLogin()
    };

    return (
        <>
        <main className={styles.login}>
            <section>
                <h1 className={styles.logintitle}>Login Page</h1>
            </section>

            <section className={styles.loginContainer}>
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
                {errorMessage && <p className={styles.errorMessage}> {errorMessage} </p>}

            </section>

            <section className={styles.loginbutton}>
                <button onClick={handleLogin}>Log In</button>
                <button onClick={handleSignUp}>Sign Up</button>
            </section>
        </main>
        </>
    );
};

export default Login;
