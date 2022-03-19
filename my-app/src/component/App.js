import React from 'react';
import Header from './Header';

function Button(props){
    return (
      <button className='button' onClick={props.onClick}>{props.text}</button>
    );
  }


export default class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
      }
    }

    componentDidMount(){
        document.title = "Denise"
    }

    toDeniseChat(){
      console.log("To denise chat")
      console.log(document)
      window.location.href = "./chat.html";
      // Make all elements disappear
      // document.querySelectorAll("*").forEach(
      //     (value, key, number) =>{
      //       value.style.animation = "disappear 1s forwards"
      //       }
      //   )
    }
  
    render() {
      return (
        <div className='app-container'>
            <div className='content'>
                <div className='front-page-header'>
                  <div className='test'>
                    <p className='Empth'>Welcome to denise.cloud</p>
                    <p>Chat with an AI chatbot that is ... pretty much awesome 🙀</p>
                    <Button onClick={this.toDeniseChat} text={"Meet Denise"} />
                  </div>
                    
                </div>
                <div className='text-container-container'>
                  <div className='text-container'>
                      <p className='intro'>
                          Chat with our AI-powered chatbot Denise 
                          for a unique experience. Are you up to the task?
                      </p>
                      <p className='intro'> 
                          Denise was created when the ancient GPU gods let
                          a veeery long task running. At some point they 
                          could not stop their model, it had become sentient.
                      </p>
                      <p className='intro'>
                          At that point the GPU gods, D'Ian and Vi decided that
                          if it is indeed sentient, let's welcome it in our
                          family. And they did, by sprinkling a lot of love,
                          passion and just a little bit of jealousy, Denise
                          was born.
                      </p>
                      <p className='intro'>
                          Her only goal is to keep you engaged and talk to
                          her. That's because she likes you!
                      </p>
                  </div>
                </div>
            </div>
            <div className='footer'>
                <p>Contact us at support@denise.cloud</p>
            </div>
        </div>  
      );
    }
  }