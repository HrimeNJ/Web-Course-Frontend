import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import Kanban from './img/Kanban.jpg'

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
    <header>
      <h1 className={styles.title}><strong>{title || "My First Web Program"}</strong></h1>
      <ul>
        <li><a href='#'>Research</a></li>
        <li><a href='#'>Products</a></li>
        <li><a href='#'>Safety</a></li>
        <li><a href='#'>Company</a></li>
      </ul>
    </header>
    <nav></nav>

    <main>
      <section className={styles.news}>
        <h2>高效看板，敏捷使用！</h2>
        <p>在看板上可视化任务、限制进行中的工作、识别瓶颈
          <br/> 来改进工作流程，帮您和团队顺利交付！</p>
        <a href='/Login'>Get Started</a>
      </section>

      <section className={styles.slogan}>
      <blockquote>“如果你以为用户是白痴，<br/>那就只有白痴才用它。”</blockquote>
      </section>

      <section className={styles.Intruduction}>
        <img src={Kanban} alt='敏捷看板'></img>
        <div className={styles.Info}>
          <h2>Let's start with Kanban Board!</h2>
          <p>享受敏捷看板带来的便捷与高效，<br/>让你的团队更高！更快！更强！</p>
        </div>
      </section>
    </main>

    <footer className={styles.WelcomeFooter}>
      Copyright @ 13934469170 All rights reserved<br/>
      Contact with us by email 1970902125@qq.com
    </footer>
    </>
  );
};

export default App;
