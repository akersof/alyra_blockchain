import React from "react";

const Joke = (props) => {
    return (
        <div>
            <h3 style={{display : !props.question && "none"}}>Question: {props.question}</h3>
            <h3 style={{color: !props.question && "red"}}>{props.question ? "Answer" : "Punchline"}: {props.answer}</h3>
            <br />
        </div>
    );
};

export default Joke;