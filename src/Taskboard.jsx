import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";
import "./Taskboard.css";

const Taskboard = () => {
    const navigate = useNavigate();
    
    // 初始任务状态
    const [tasks, setTasks] = useState({
        todo: [
            { id: 'task-1', content: 'Analysis' },
            { id: 'task-2', content: 'Design' },
            { id: 'task-3', content: 'Development' },
            { id: 'task-4', content: 'Testing' }
        ],
        doing: [
            { id: 'task-5', content: 'Implement' },
            { id: 'task-6', content: 'Bug Fixing' }
        ],
        done: [
            { id: 'task-7', content: 'Release' },
            { id: 'task-8', content: 'Review' }
        ]
    });

    const [newTaskContent, setNewTaskContent] = useState("");

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

            // 计算插入的位置
            for (let i = 0; i < taskItems.length; i++) {
                const taskItem = taskItems[i];
                const taskItemRect = taskItem.getBoundingClientRect();

                if (event.clientY < taskItemRect.top + taskItemRect.height / 2) {
                    insertAtIndex = i;
                    break;
                }
            }

            // 在目标列的指定位置插入任务
            updatedTasks[targetColumn].splice(insertAtIndex, 0, taskToMove);
            setTasks(updatedTasks);
        }
    };


    // 处理新增任务输入框内容变化
    const handleNewTaskChange = (event) => {
        setNewTaskContent(event.target.value);
    };

    // 处理新增任务提交
    const handleNewTaskSubmit = (event) => {
        event.preventDefault();
        if (newTaskContent.trim() === "") {
            return; // 如果任务内容为空，则不添加
        }

        const newTask = {
            id: `task-${Date.now()}`,
            content: newTaskContent
        };

        // 将新任务添加到待办任务列表
        const updatedTasks = { ...tasks };
        updatedTasks.todo = [...updatedTasks.todo, newTask];
        setTasks(updatedTasks);

        // 清空输入框
        setNewTaskContent("");
    };

    const handlieSaveTask = (event) => {
        event.preventDefault();
        // 保存任务列表
        // TODO: 实现任务列表的持久化
        axios.post('http://localhost:7001/tasks', tasks => tasks)
       .then(response => console.log(response))

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
                        <button onClick={()=>navigate('/taskgrouping')}>Task Grouping</button>
                        <button onClick={(event) => handlieSaveTask(event)}>Save</button>

                    </div>
                </div>

                {/* board */}
                <div className="board">
            <ul className="columns">
                {/* ToDo 栏 */}
                <li className="column-to-column">
                    <div className="column-header-to-do">
                        <h2>To Do</h2>
                    </div>
                    <ul className="tasklist" id="to-do"
                        onDragOver={(event) => handleDragOver(event)}
                        onDrop={(event) => handleDrop(event, 'todo')}>
                        {tasks.todo.map((task) => (
                            <li key={task.id} className="task"
                                draggable
                                onDragStart={(event) => handleDragStart(event, task.id, 'todo')}>
                                <p>{task.content}</p>
                            </li>
                        ))}
                    </ul>
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
                    <ul className="tasklist" id="doing"
                        onDragOver={(event) => handleDragOver(event)}
                        onDrop={(event) => handleDrop(event, 'doing')}>
                        {tasks.doing.map((task) => (
                            <li key={task.id} className="task"
                                draggable
                                onDragStart={(event) => handleDragStart(event, task.id, 'doing')}>
                                <p>{task.content}</p>
                            </li>
                        ))}
                    </ul>
                </li>

                {/* Done 栏 */}
                <li className="column-to-column">
                    <div className="column-header-done">
                        <h2>Done</h2>
                    </div>
                    <ul className="tasklist" id="done"
                        onDragOver={(event) => handleDragOver(event)}
                        onDrop={(event) => handleDrop(event, 'done')}>
                        {tasks.done.map((task) => (
                            <li key={task.id} className="task"
                                draggable
                                onDragStart={(event) => handleDragStart(event, task.id, 'done')}>
                                <p>{task.content}</p>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
            </section>

            
            
            
        </main>
        </>
    )
}

export default Taskboard;