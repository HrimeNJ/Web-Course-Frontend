import React, { useState } from "react";
import "./Tasklist.css";
// import Modal from './Modal'; 

const TaskList = ({ tasks, columnId, onDragStart, onDragOver, onDrop, updateTask }) => {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskEditContent, setTaskEditContent] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskEvaluation, setTaskEvaluation] = useState("");
    const [showOptions, setShowOptions] = useState(null);
    const [showButton, setShowButton] = useState(true);
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [showModal, setShowModal] = useState(false);


    //任务编辑
    const handleTaskEditChange = (event) => {
        setTaskEditContent(event.target.value);
    };

    //任务描述
    const handleDescriptionChange = (event) => {
        setTaskDescription(event.target.value);
    };

    //任务评论
    const handleEvaluationChange = (event) => {
        setTaskEvaluation(event.target.value);
    };

    //任务附件
    const handleAttachmentChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setAttachmentFile(event.target.files[0]);
            console.log("File uploaded: ", event.target.files[0].name);
        } else {
            console.log("No file selected");
        }
    };
    

    //任务编辑提交
    const handleTaskEditSubmit = (taskId) => {
        const updatedTask = {
            content: taskEditContent,
            description: taskDescription,
            evaluation: taskEvaluation,
            hasattachmentFile: attachmentFile ? true : false,
        };
        updateTask(columnId, taskId, updatedTask);
        setEditingTaskId(null); 
        setShowButton(true);
        console.log(attachmentFile.name);

        if (attachmentFile) {
            const sanitizedFileName = attachmentFile.name.replace(/[^a-zA-Z0-9.\-]/g, '_'); // 替换非法字符
            const formData = new FormData();
            formData.append("attachment", attachmentFile, sanitizedFileName);
            console.log(formData.get("attachment"));
            
            fetch(`http://localhost:7001/upload/${taskId}`, {
                method: "POST",
                body: formData,
            })
            .then((response) => response.json())
            .then((data) => console.log("File uploaded successfully: ", data))
            .catch(error => console.log("File upload fail ", error));
        }

        setAttachmentFile(null);
        setShowModal(false);
    };

    //任务选择的点击
    const handleOptionsClick = (taskId) => {
        setShowOptions(showOptions === taskId ? null : taskId);
    };

    //任务编辑的点击
    const handleEditClick = (task) => {
        //先保存现有的task
        setEditingTaskId(task.id);
        setTaskEditContent(task.content);
        setTaskDescription(task.description);
        setTaskEvaluation(task.evaluation);
        setAttachmentFile(attachmentFile);  //这个地方应该是task本身的attachment而不是attachment变量，先这样后面改

        setShowOptions(null);
        setShowButton(false);
        setShowModal(true);
    };

    //任务查看的点击
    const handleViewClick = (task) => {
        alert(`任务: ${task.content}\n描述: ${task.description}\n评价: ${task.evaluation}\n
            附件: ${task.attachment ? task.attachment.name : '无'}`);
        setShowOptions(null);
        setShowButton(true);
    };

    //任务删除的点击
    const handleDeleteClick = (task) => {
        updateTask(columnId, task.id, null);
        setShowOptions(null);
        setShowButton(true);
    };

    //回车处理
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
                            <form className="taskform" onSubmit={(event) => 
                                {event.preventDefault(); handleTaskEditSubmit(task.id)} }>
                                <input
                                    type="text"
                                    value={taskEditContent}
                                    onChange={handleTaskEditChange}
                                    onKeyDown={(event) => handleKeyDown(event, task.id)}
                                    onBlur={() => handleTaskEditSubmit(task.id)}
                                />
                                <textarea
                                    placeholder="任务描述"
                                    value={taskDescription}
                                    onChange={handleDescriptionChange}
                                    onBlur={() => handleTaskEditSubmit(task.id)}
                                />
                                <input
                                    type="text"
                                    placeholder="任务评价"
                                    value={taskEvaluation}
                                    onChange={handleEvaluationChange}
                                    onBlur={() => handleTaskEditSubmit(task.id)}
                                />
                                <input
                                    type="file"
                                    onChange={handleAttachmentChange}
                                />
                                <button className="tasksubmit" type="submit">提交</button>
                            </form>
                        ) : (
                            <>
                                <p>{task.content}</p>
                                {attachmentFile && (
                                        <a href={URL.createObjectURL(attachmentFile)} download>
                                            {attachmentFile.name}
                                        </a>
                                )}
                            </>
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
                : (<li className="task" id="Notask">没有任务</li>)
            }
        </ul>
    );
};

export default TaskList;
