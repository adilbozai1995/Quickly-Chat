import React, { Component } from 'react';
import './chat.css';

class chat extends Component {


  sendClicked(){


  }

  jumpEndClicked(){


  
  }

  logoutClicked(){


  }
    render() {
     return (
       <div className="Chat">
        <button OnClick={() => this.jumpEndClicked()} className = "jump_end">END</button>
        <button OnClick={() => this.logoutClicked()} className = "logout_btn">logout</button>
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
