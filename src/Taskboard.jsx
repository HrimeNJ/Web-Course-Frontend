import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./Taskboard.css";
import { useEffect } from "react";
import TaskList from "./Tasklist";

const Taskboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, password } = location.state || {};
    // 初始任务状态
    const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
    const [taskfiles, setTaskfiles] = useState({});
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskEvaluation, setNewTaskEvaluation] = useState('');

    useEffect(() =>{
        if(email) {
            axios.get(`http://localhost:7001/tasks?email=${email}`)
                .then(response => {
                    if(response.data.success){
                        setTasks(response.data.tasks);
                    }
                    else {
                        console.log("Tasks are nothing");
                    }
                })
                .catch(error => {
                    console.log("Error fetching tasks", error);
                });
        }
    }, [email])

    // 拖拽开始处理函数
    const handleDragStart = (event, taskId, fromColumn) => {
        event.dataTransfer.setData("taskId", taskId);
        event.dataTransfer.setData("fromColumn", fromColumn);
    };

    // 拖拽进入目标区域处理函数
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // 放置任务处理函数
    const handleDrop = (event, targetColumn) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("taskId");
        const fromColumn = event.dataTransfer.getData("fromColumn");

        if (fromColumn !== targetColumn) {
            // 处理任务从一个列到另一个列的移动
            const updatedTasks = { ...tasks };
            const taskToMove = updatedTasks[fromColumn].find(task => task.id === taskId);

            // 从原始列中移除任务
            updatedTasks[fromColumn] = updatedTasks[fromColumn].filter(task => task.id !== taskId);

            // 获取放置的位置
            const taskItems = document.querySelectorAll(`#${targetColumn} .task`);
            let insertAtIndex = taskItems.length;

            console.log("Length: ", insertAtIndex);

            // 计算插入的位置
            for (let i = 0; i < taskItems.length; i++) {
                const taskItem = taskItems[i];
                const taskItemRect = taskItem.getBoundingClientRect();

                // 调试输出位置和尺寸信息
                console.log("Task Item Rect:", taskItemRect);
                console.log("Client Y:", event.clientY);

                if (event.clientY < taskItemRect.top + taskItemRect.height / 2) {
                    insertAtIndex = i;
                    break;
                }
            }

            // 在目标列的指定位置插入任务
            updatedTasks[targetColumn].splice(insertAtIndex, 0, taskToMove);
            // console.log("update tasks", updatedTasks)

            setTasks(updatedTasks);
            // console.log("tasks", tasks);
            // console.log(updatedTasks==tasks);
        }
    };


    // 处理任务内容变化
    const handleNewTaskChange = (e) => {
        setNewTaskContent(e.target.value);
    };

    // 处理任务描述变化
    const handleNewTaskDescriptionChange = (e) => {
        setNewTaskDescription(e.target.value);
    };

    // 处理任务评论变化
    const handleNewTaskEvaluationChange = (e) => {
        setNewTaskEvaluation(e.target.value);
    };

    // 处理新增任务提交
    const handleNewTaskSubmit = (event) => {
        event.preventDefault();
        if (newTaskContent.trim() === "" ) {
            return; // 如果任务内容为空，则不添加
        }

        const newTask = {
            id: `task-${Date.now()}`,
            content: newTaskContent,
            description: newTaskDescription,
            evaluation: newTaskEvaluation,
        };

        // 将新任务添加到待办任务列表
        const updatedTasks = { ...tasks };
        updatedTasks.todo = [...updatedTasks.todo, newTask];
        setTasks(updatedTasks);

        // 清空输入框
        setNewTaskContent("");
        setNewTaskDescription("");
        setNewTaskEvaluation("");
    };

    const handleSaveTask = async (event) => {
       event.preventDefault();
        try {
            // 1. 发送普通数据 (email, password, tasks)
            const response1 = await axios.post('http://localhost:7001/tasks/', {
                email,
                password,
                tasks,
            });
            console.log('Data saved:', response1.data);
    
            // // 2. 发送文件数据
            // if (taskfiles) {
            //     const formData = new FormData();
            //     Object.keys(taskfiles).forEach(taskId => {
            //         const file = taskfiles[taskId];
            //         formData.append(`attachments[${taskId}]`, file);
            //     });
    
            //     const response2 = await axios.post('http://localhost:7001/tasks/files', formData);
            //     console.log('Files saved:', response2.data);
            // }
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };
    
    
    
    //按钮
    const handleLogoutButton = (event) => {
        handleSaveTask(event);
        navigate('/');
    }

    const handleNewButton = (event) => {
        const emptyTask = {
            "todo": [], "doing": [], "done": []
        };
        setTasks(emptyTask);
        handleSaveTask(event);
    }

    //编辑面板数据
    const updateTask = (columnId, taskId, updatedData) => {
        const updatedTasks = { ...tasks };
        const taskIndex = updatedTasks[columnId].findIndex(task => task.id === taskId);
    
        console.log(taskIndex, updatedTasks, updatedData);
        if (taskIndex !== -1) {
            if (updatedData && updatedData.content && updatedData.content.trim() !== "") {
                updatedTasks[columnId][taskIndex] = {
                    ...updatedTasks[columnId][taskIndex],
                    ...updatedData
                };
            } else {
                updatedTasks[columnId].splice(taskIndex, 1);
            }
            setTasks(updatedTasks);

        }
    };
    
    

    return (
        <>
        <main className="Taskboard">
            <section className="ProjectsColumn">
                
                <div className="h">项目</div>
                <div className="menu">
                    <ul>
                        <li><a href="http://localhost:5173/taskboard/theboard">Projects</a></li>
                        <li><a href="#">Memebers</a></li>
                        <li><a href="#">Growth</a></li>
                        <li><a href="#">WebSite</a></li>
                    </ul>
                </div>
                <div className="footer">
                    <footer>如有差误不妥之处，<br/>请联系13934469170。</footer>
                </div>

            </section>

            <section className="taskboard">
                <div className="topSection">
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

                        <button onClick={handleLogoutButton}>Logout</button>
                        <button onClick={handleNewButton}>New Board</button>
                        
                        <button onClick={()=>navigate('/addtask')}>Add Task</button>
                        {/* Add task form here */}
                        <button onClick={()=>navigate('/edittask')}>Edit Task</button>
                        {/* Add task form here */}
                        <button onClick={()=>navigate('/deletetask')}>Delete Task</button>
                        {/* Add task form here */}
                        <button onClick={()=>navigate('/taskhistory')}>Task History</button>
                        {/* Add task form here */}
                        <button onClick={(event) => handleSaveTask(event)}>Save</button>

                    </div>
                </div>

                {/* board */}
                <div className="board">
                <ul className="columns">
                    {/* ToDo 栏 */}
                    <li className="column-to-column">
                        <div className="column-header-todo">
                            <h2>To Do</h2>
                        </div>
                        <TaskList
                            tasks={tasks.todo}
                            columnId="todo"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            updateTask={updateTask}
                            taskflies={taskfiles}
                        />
                        {/* 新增任务表单 */}
                        <form onSubmit={handleNewTaskSubmit}>
                            <input
                                type="text"
                                placeholder="Add new task"
                                value={newTaskContent}
                                onChange={handleNewTaskChange}
                            />
                            <button type="submit" className="submit">Add</button>
                        </form>
                    </li>

                    {/* Doing 栏 */}
                    <li className="column-to-column">
                        <div className="column-header-doing">
                            <h2>Processing</h2>
                        </div>
                        <TaskList
                            tasks={tasks.doing}
                            columnId="doing"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            updateTask={updateTask}
                            taskflies={taskfiles}
                        />
                    </li>

                    {/* Done 栏 */}
                    <li className="column-to-column">
                        <div className="column-header-done">
                            <h2>Done</h2>
                        </div>
                        <TaskList
                            tasks={tasks.done}
                            columnId="done"
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            updateTask={updateTask}
                            taskflies={taskfiles}
                        />
                    </li>
                </ul>

        </div>
        </section>

            
            
            
        </main>
        </>
    )
}

export default Taskboard;