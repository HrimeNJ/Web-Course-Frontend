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
    const email = location.state?.email || localStorage.getItem('email');
    const password = location.state?.password || localStorage.getItem('password');

    // 初始任务状态
    const [panels, setPanels] = useState([{ todo: [], doing: [], done: [] }]);
    const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
    const [taskfiles, setTaskfiles] = useState({});
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskEvaluation, setNewTaskEvaluation] = useState('');
    const [showProjects, setShowProjects] = useState(false); 
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (email && password) {
            // 将 email 和 password 保存到 localStorage
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
        }
    }, [email, password]);
    
    useEffect(() => {
        if (email) {
            // 将 email 和 password 保存到 localStorage
            const email = location.state?.email || localStorage.getItem('email');
            const password = location.state?.password || localStorage.getItem('password');
            axios.get(`http://localhost:7001/tasks?email=${email}`)
                .then(response => {
                    if(response.data.success){
                        const fetchedPanels = response.data.panels;
                        setPanels(fetchedPanels);
                        if (fetchedPanels.length > 0) {
                            const firstPanelTasks = fetchedPanels[0];  // 获取第一个面板
                            setTasks(firstPanelTasks);
                          }
    
                        // 获取所有有附件的任务ID
                        const taskIdsWithAttachments = [];
                        
                        for(let i = 0; i < fetchedPanels.length; i++) {
                            const fetchedTasks = fetchedPanels[i];
                            Object.keys(fetchedTasks).forEach(stage => {
                                fetchedTasks[stage].forEach(task => {
                                    if (task.hasattachmentFile) {
                                        taskIdsWithAttachments.push(task.id);
                                    }
                                });
                            });
                        }
                        // 并行获取所有附件
                        Promise.all(taskIdsWithAttachments.map(taskId => fetchTaskFiles(taskId)))
                            .then(() => {
                                console.log('All files fetched and taskfiles updated');
                                setLoading(false);
                            })
                            .catch(error => {
                                console.error('Error fetching task files:', error);
                                setLoading(false);
                            });
                    }
                    else {
                        console.log("Panels are nothing");
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.log("Error fetching tasks", error);
                    setLoading(false);
                });
        }
    }, [email]);
    
    // 获取附件的函数
    const fetchTaskFiles = (taskId) => {
        return axios.get(`http://localhost:7001/tasks/${taskId}/attachments`, { responseType: 'blob' })
            .then(response => {
                const url = URL.createObjectURL(new Blob([response.data]));
                setTaskfiles(prevState => ({
                    ...prevState,
                    [taskId]: url
                }));
            })
            .catch(error => {
                console.log(`Error fetching files for task ${taskId}`, error);
            });
    };
    
    useEffect(() => {
        if (Object.keys(taskfiles).length > 0) {
            console.log('Task files updated:', taskfiles);
            setLoading(false);
        }
    }, [taskfiles]);

    //得到附件
    const getTaskFile = (taskId) => {
        return taskfiles[taskId] ? taskfiles[taskId] : null;
    };

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
            // 深拷贝 tasks，避免直接引用
            const updatedTasks = {
                ...tasks,
                [fromColumn]: [...tasks[fromColumn]], // 深拷贝来源列
                [targetColumn]: [...tasks[targetColumn]] // 深拷贝目标列
            };
    
            // 找到并从来源列中移除任务
            const taskToMove = updatedTasks[fromColumn].find(task => task.id === taskId);
            updatedTasks[fromColumn] = updatedTasks[fromColumn].filter(task => task.id !== taskId);
    
            // 计算要插入的索引
            const taskItems = document.querySelectorAll(`#${targetColumn} .task`);
            let insertAtIndex = taskItems.length;
    
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
    
            // 更新状态
            setTasks(updatedTasks);
            const updatedPanels = [...panels];
            updatedPanels[index] = updatedTasks; // 更新面板
            setPanels(updatedPanels);
        }

        console.log("Current Index: ", index);
    };
    

      // 切换显示项目的任务列表
    const handleProjectsClick = () => {
        setShowProjects(!showProjects);
    };

    const handleTaskClick = (panelIndex) => {
        const selectedTasks = panels[panelIndex]; // 获取对应面板的任务
        setTasks(selectedTasks); // 设置当前的tasks
        setIndex(panelIndex); // 设置面板的 index
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
            hasattachment: false,
        };

        // 将新任务添加到待办任务列表
        const updatedTasks = { ...tasks };
        updatedTasks.todo = [...updatedTasks.todo, newTask];
        setTasks(updatedTasks);

        // 更新对应的panels
        const updatedPanels = [...panels];
        updatedPanels[index].todo = [...updatedPanels[index].todo, newTask];
        setPanels(updatedPanels); // 更新panels状态

        // 清空输入框
        setNewTaskContent("");
        setNewTaskDescription("");
        setNewTaskEvaluation("");
    };

    const handleSaveTask = async (event) => {
       event.preventDefault();
        try {
            // 1. 发送普通数据 (email, password, tasks)
            const storedEmail = email || localStorage.getItem('email');
            const storedPassword = password || localStorage.getItem('password');
            const response1 = await axios.post('http://localhost:7001/tasks/', {
                email: storedEmail,
                password: storedPassword,
                panels: [...panels]  // 将当前的 tasks 面板也添加进去
            });
            console.log('Email Saved: ', email);
            console.log('Password Saved:', password);
            console.log('Panels saved:', panels);

            console.log('Data saved Return:', response1.data);
    
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
            alert('Saved successfully!');
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
        const newtasks = {
            todo: [], doing: [], done: []
        };
        // 将原有的panels追加新的任务面板来更新panels
        const updatedPanels = [...panels, { ...newtasks }]; 
        setPanels(updatedPanels); 

        // 创建新的空任务面板
        setTasks(newtasks);

        const updateTaskIndex = panels.length;
        setIndex(updateTaskIndex);

        console.log("updatedPanels: ", updatedPanels);
        console.log("updateTaskIndex: ", updateTaskIndex);
        console.log("Email: ", email);
        console.log("Password: ", password);

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
    
    if(loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
        <main className="Taskboard">
            <section className="ProjectsColumn">
                
                <div className="h">项目</div>
                <div className="menu">
                    <ul>
                        <li><a href="#" onClick={handleProjectsClick}>Projects</a></li>
                        <li><a href="#">Memebers</a></li>
                        <li><a href="https://github.com/HrimeNJ">Growth</a></li>
                        <li><a href="https://github.com/HrimeNJ">WebSite</a></li>
                    </ul>
                </div>

                {showProjects && (
                <div className="task-list">
                    <ul>
                    {panels.map((panel, index) => {
                        const totalTasks = panel.todo.length + panel.doing.length + panel.done.length; // 计算每个panel的任务总数
                        return (
                        <li key={index}>
                            <a href="#" onClick={() => handleTaskClick(index)} style={{ fontSize: '12px' }}>
                            Panel {index + 1}: {totalTasks} tasks
                            </a>
                        </li>
                        );
                    })}
                    </ul>
                </div>
                )}

                <footer className="bottomInfo">如有差误不妥之处，<br/>请联系电话： <br/> 13934469170。</footer>


            </section>

            <section className="taskboard">
                <div className="topSection">
                    <div>
                        <h1>Taskboard</h1>
                    </div>
                    <div>
                        <ul>
                            <li className="topSectionItems"><a href="http://localhost:5173">Abstract</a></li>
                            <li className="topSectionItems"><a href="/taskboard">Task Board</a></li>
                            <li className="topSectionItems"><a href="https://github.com/HrimeNJ">Contact us</a></li>
                            <li className="topSectionItems"><a href="http://localhost:5173/Login">Log out</a></li>

                        </ul>

                        <button className="topSectionButton" onClick={handleNewButton}>Create</button>
                        <button className="topSectionButton" onClick={handleLogoutButton}>Logout</button>                        
                        <button className="topSectionButton" onClick={()=>navigate('/deletetask')}>Delete All</button>
                        <button className="topSectionButton" onClick={(event) => handleSaveTask(event)}>Save</button>

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
                            getTaskFile={getTaskFile}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            updateTask={updateTask}
                        />
                        {/* 新增任务表单 */}
                        <form onSubmit={handleNewTaskSubmit} className="AddTaskform">
                            <input
                                className="AddTaskinput"
                                type="text"
                                placeholder="Add new task"
                                value={newTaskContent}
                                onChange={handleNewTaskChange}
                            />
                            <button type="submit" className="AddTasksubmit">Add</button>
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
                            getTaskFile={getTaskFile}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            updateTask={updateTask}
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
                            getTaskFile={getTaskFile}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            updateTask={updateTask}
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