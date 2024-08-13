import React from 'react';
import './TaskDetailsModal.css'; // 引入自定义样式文件

const TaskDetailsModal = ({ task, onClose, getTaskFile }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>任务详情</h3>
                <p><strong>任务:</strong> {task.content}</p>
                <p><strong>描述:</strong> {task.description}</p>
                <p><strong>评价:</strong> {task.evaluation}</p>
                <p><strong>附件:</strong> 
                    {task.hasattachmentFile 
                        ? <a href={getTaskFile(task.id)} download>Download attachments</a>
                        : '无'}
                </p>
                <button className="modal-close-button" onClick={onClose}>关闭</button>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
