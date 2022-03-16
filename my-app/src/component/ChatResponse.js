/* A chat response. Can be either Denise
 or client response, each having a different 
 layout */
 import React from 'react';
 export default class ChatResponse extends React.Component {
    constructor(props){
        super(props);
        this.writer = props.writer
        this.text = props.text
        this.className = props.writer + "-message"
        this.index = props.index
    }
    render(){
        return (
            <div className={this.className+"-container"}>
                <div className={this.className}>
                    <p>{this.text}</p>
                </div>
            </div>
        );
    }
}