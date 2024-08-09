import { useNavigate } from "react-router-dom";
import React from "react";
import "./TheBoard.css";

const TheBoard = () =>{
    const navigate = useNavigate();
    navigate('/taskboard');
    const handleClick = () => {
        navigate("/taskboard");
    }

    return (
        <>
        <main>
            <div className="the-board">
                Hello
            </div>
        </main>
        </>        
    )
}

export default TheBoard;