import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, {useState} from "react";
import "./Taskboard.css";

const Taskboard = () => {
    const navigate = useNavigate();
    
    return (
        <>
        <main className="Taskboard">
            <section className="taskboard">
                <div>
                    <h1>Taskboard</h1>
                </div>
                <div>
                    <ul>
                        <li className="boarditems"><a href="#">Abstract</a></li>
                        <li className="boarditems"><a href="#">Task Board</a></li>
                        <li className="boarditems"><a href="#">TaskList</a></li>
                        <li className="boarditems"><a href="#">Contact us</a></li>
                        <li className="boarditems"><a href="#">Log out</a></li>

                    </ul>

                    <button onClick={()=>navigate('/login')}>Logout</button>
                    {/* Add tasks here */}
                    <button onClick={()=>navigate('/addtask')}>Add Task</button>
                    {/* Add task form here */}
                    <button onClick={()=>navigate('/edittask')}>Edit Task</button>
                    {/* Add task form here */}
                    <button onClick={()=>navigate('/deletetask')}>Delete Task</button>
                    {/* Add task form here */}
                    <button onClick={()=>navigate('/taskhistory')}>Task History</button>
                    {/* Add task form here */}
                    <button onClick={()=>navigate('/taskfilter')}>Task Filter</button>
                    {/* Add task form here */}
                    <button onClick={()=>navigate('/tasksorting')}>Task Sorting</button>
                    {/* Add task form here */}
                    <button onClick={()=>navigate('/taskgrouping')}>Task Grouping</button>
                </div>
            </section>

            <section className="ProjectsColumn">
                <h1>项目</h1>
                {/* Add Projects Column Names from here */}
                <footer>如有差误不妥之处，<br/>请联系13934469170。</footer>
            </section>
            
        </main>
        </>
    )
}

export default Taskboard;