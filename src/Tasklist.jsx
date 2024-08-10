import { useEffect } from "react";
import React, { useState } from "react";
import "./Tasklist.css";


const TaskList = ({ tasks, columnId, onDragStart, onDragOver, onDrop, updateTask }) => {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskEditContent, setTaskEditContent] = useState("");
    const [showOptions, setShowOptions] = useState(null);
    const [showButton, setShowButton] = useState(true);

    const handleTaskEditChange = (event) => {
        setTaskEditContent(event.target.value);
    };

    const handleTaskEditSubmit = (taskId) => {
        updateTask(columnId, taskId, taskEditContent);
        setEditingTaskId(null); 
        setShowButton(true);
    };

    const handleOptionsClick = (taskId) => {
        setShowOptions(showOptions === taskId ? null : taskId);
    };

    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setTaskEditContent(task.content);
        setShowOptions(null);
        setShowButton(false);
        // console.log(showOptions);
    };

    const handleViewClick = (task) => {
        alert(`查看任务: ${task.content}`);
        setShowOptions(null);
        setShowButton(true);
    };

    const handleDeleteClick = (taskId) => {
        updateTask(columnId, taskId, null);
        setShowOptions(null);
        setShowButton(true);
    };

    const handleKeyDown = (event, taskId) => {
        if (event.key === "Enter") {
            handleTaskEditSubmit(taskId);
        }
    };
    

    return (
        <ul className="tasklist" id={columnId}
            onDragOver={(event) => onDragOver(event)}
            onDrop={(event) => onDrop(event, columnId)}>
            {tasks && tasks.length > 0 ? 
                (tasks.map((task) => (
                    <li key={task.id} className="task"
                        draggable
                        onDragStart={(event) => onDragStart(event, task.id, columnId)}>
                        
                        {editingTaskId === task.id ? (
                            <form className="taskform">
                            <input
                                type="text"
                                value={taskEditContent}
                                onChange={handleTaskEditChange}
                                onKeyDown={(event) => handleKeyDown(event, task.id)}
                                onBlur={() => handleTaskEditSubmit(task.id)}
                            />
                            <button className="tasksubmit" onClick={() => handleTaskEditSubmit(task.id)}>Submit</button>
                            </form>
                        ) : (
                            <p>{task.content}</p>
                        )}
                        
                        {showButton && <button 
                            className="options-button" onClick={() => handleOptionsClick(task.id)}>⋮</button>}
                        
                        {showOptions === task.id && (
                            <div className="options-menu">
                                <button onClick={() => handleViewClick(task)}>查看</button>
                                <button onClick={() => handleEditClick(task)}>修改</button>
                                <button onClick={() => handleDeleteClick(task)}>删除</button>
                            </div>
                        )}
                    </li>
                )))
                : (<li className="task" id="Notask"> No tasks </li>)
            }
        </ul>
    );
};

export default TaskList;
