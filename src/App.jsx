import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './App.module.css';

const App = () => {
  const [title, setTitle] = useState("");
  const [wsMessage, setWsMessage] = useState("");
  const navigate = useNavigate();
  let socket;

  const handleLogIn = async () => {
    try {
      if (socket) socket.close();
      const response = await axios.post("http://localhost:7001/Create");
      console.log(response.data);
      navigate('/Login');
    } catch (error) {
      console.error("Here is something wrong!", error);
    }
  };

  const handleExit = () => {
    if (socket) {
      socket.close();
      console.log('Exit Successfully!');
    }
  };

  const getTitle = async () => {
    try {
      const response = await axios.get("http://localhost:7001");
      setTitle(response.data);
    } catch (error) {
      console.log("GetTitle is wrong!", error);
    }
  };

  useEffect(() => {
    getTitle();
  }, []);

  useEffect(() => {
    console.log(wsMessage);
  });

  return (
    <>
      <h1 className={styles.title}><strong>{title || "My First Web Program"}</strong></h1>
      <div className={styles.card}>
        <p>
          You can <button id='LoginButton' className={styles.button} onClick={handleLogIn}>Log In</button> Here.
        </p>
        <p>
          Exit My Web from <button id='LeaveButton' className={styles.button} onClick={handleExit}>here</button>.
        </p>
        <button className={styles.button} onClick={handleLogIn}>Let's begin!</button>
        <p>{wsMessage}</p>
      </div>
      <p className={styles.readTheDocs}>
        Click on the Details to learn more
      </p>
    </>
  );
};

export default App;
