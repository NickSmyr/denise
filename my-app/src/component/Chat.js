import React from 'react';
import Header from './Header';
import ChatResponse from "./ChatResponse"
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';


function scrollToLastMessage(){
  var lastMessage = document.getElementById("past-messages").lastElementChild
  if (lastMessage != null){
    console.log("Scrolling to last message")
    lastMessage.scrollIntoView()      
  }
}

// Global vars
var names = null;
var session_id = uuidv4();
// Do a post request to the backend, with common error handling
// Returns a promise with the json parsed response from the server 
// Supported endpoints
//  /initiateInteraction
//  /advanceInteraction
//  /keepAlive
function backendPost(endpoint, content){
  return new Promise((resolve, reject) => {
    console.log(`Performing request to ${endpoint} with content`,content)
    var body = {
      'session_id' : content.session_id,
    }
    if (content.message){
      body.message = content.message
    }
    fetch(endpoint, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body : JSON.stringify(body)
    }).then(res => {
      if (res.status != 200){
        throw `Backend API call to ${endpoint} did not succeed 
        with error code ${res.status}`
      }
      else{
        console.log(`Backend API call to ${endpoint} succeeded
           with response`, res);
        if (Number(res.headers.get("content-length")) > 0){
          return res.json()
        }
        else {
          return res
        }
        
      }
    }).then(res => {
      resolve(res)
    })
    .catch(e => {
      console.log(`Error: ${e}`)
      alert("Unfortunately we could not contact denise. Please try again later")
      reject()
    });
  })
}

setInterval(function(){
  backendPost("/keepAlive", {'session_id': session_id}).then(() =>{}, () =>{})
}, 5000)

// Initialize interaction
var interactionInitiated = false
backendPost('/initiateInteraction', {'session_id' : session_id}).then(() =>{
  interactionInitiated = true
})


export default class Chat extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          list: []
      }
      this.onsend.bind(this)
      this.addChild.bind(this)
    }
    
    componentDidMount() {
      scrollToLastMessage()
    }
    componentDidUpdate(){
      scrollToLastMessage()
    }
    onsend(){
      if (interactionInitiated){
        var text = document.getElementById("prompt").value
        document.getElementById("prompt").value = ""
        this.addChild.bind(this)("user", text)
        scrollToLastMessage()
        backendPost("/advanceInteraction",{
            "session_id" : session_id,
            "message":text
          }).then((res)=>{
          this.addChild.bind(this)("denise", res.message)
        })
      }
      else {
        alert("Something went wrong and Denise cannot read your texts. " +
          "Please try refreshing the page")
      }
      
    }
    addChild(writer, text){
      this.setState({
        list : this.state.list.concat([{writer: writer, text:text}])
      })
    }
    // TODO add react keys to list 
    render() {
      return (
        <div className='chat-container'>
          <Header/>
            <div id="main">
              <div id="past-messages">
                {
                  this.state.list.map((item, index) => (
                        <ChatResponse writer={item.writer} text={item.text} key={index}/>
                    ))
                }
              </div>
              <div id="prompt-div">
                <input type="text" onKeyDown={(e) => {
                    if (e.code == "Enter"){
                      this.onsend.bind(this)()
                    }
                }} id="prompt" placeholder="Write your message..."></input>
                <img id="img" onClick={this.onsend.bind(this)}></img>
              </div>
            </div>
        </div>
            
      );
    }
  }