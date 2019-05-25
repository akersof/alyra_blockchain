import React from 'react';
import "./style.css"
import TodoItem from './TodoItem';
import todoData from './todoData';

class MainContent extends React.Component {
    constructor() {
        super();
        this.state = {data: todoData};
        //this.handleChange = this.handleChange.bind(this);
    }
    handleChange = (id) => {
        this.setState(
            prevState => {
                const updatedState = prevState.data.map((item, index) => {
                    if(`item-${index}` === id) item.completed = !item.completed;
                    return item;
                });
                console.log("changed", id);
                return {data: updatedState};
            }
        );
    }
    render() {
        const todoItems = this.state.data.map((elem, index) => <TodoItem key={`item-${index}`}
                                                                         item={elem}
                                                                         id={`item-${index}`}
                                                                         handleChange={this.handleChange}/>);
        return (
            <div className="todo-list">
                <main>
                    {todoItems}
                </main>
            </div>
        );
    }
}

export default MainContent;