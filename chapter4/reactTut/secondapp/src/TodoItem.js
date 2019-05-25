import React from 'react';
import "./style.css"
const TodoItem = (props) => {
    const completedStyle = {
        fontStyle: "italic",
        color: "#cdcdcd",
        textDecoration: "line-through"
    };
    return (
        <div className="todo-item">
            <input type="checkbox" defaultChecked={props.item.completed} onChange={() => props.handleChange(props.id)}/>
            <p style={props.item.completed ? completedStyle : null}>{props.item.text}</p>
        </div>
    );
};

export default TodoItem;