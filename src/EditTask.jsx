import React, { useState, useEffect } from 'react';

const EditTask = ({ task, columnId, onSave, onCancel }) => {
    const [editContent, setEditContent] = useState(task.content);

    useEffect(() => {
        setEditContent(task.content);
    }, [task]);

    const handleContentChange = (event) => {
        setEditContent(event.target.value);
    };

    const handleSave = () => {
        onSave(task.id, columnId, editContent);
    };

    return (
        <div className="edit-task-panel">
            <input
                type="text"
                value={editContent}
                onChange={handleContentChange}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default EditTask;
