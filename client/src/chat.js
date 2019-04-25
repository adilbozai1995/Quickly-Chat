import React, { Component } from 'react';
import './chat.css';

class chat extends Component {


  sendClicked(){

    
  }
    render() {
     return (
       <div className="Chat">

        <div className = "input_holder">
        
        <div className = "chat_bubbles">
        
        
        
        
        </div>
        
        <textarea className = "chat_input" id = "user_message"/>
        <button OnClick={() => this.sendClicked()} className = "chat_send">SEND</button>
        
        </div>

        


        
      </div>
     );
    }
    
  }

export default chat;
