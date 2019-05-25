import React from "react";

class Hello extends React.Component {
    render() {
        return <h1>Hello i am {this.props.name}</h1>
    }
}

export default Hello;