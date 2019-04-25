import React, { Component } from 'react';
import './chat.css';

class chat extends Component {


  sendClicked(){


  }

  jumpEndClicked(){


  
  }

  logoutClicked(){


  }

  joinRoomClicked(){


  }
    render() {
     return (
       <div className="Chat">
        <button OnClick={() => this.jumpEndClicked()} className = "jump_end">END</button>
        <button OnClick={() => this.joinRoomClicked()} className = "join_room_btn">JOIN ROOM</button>
        <button OnClick={() => this.logoutClicked()} className = "logout_btn">logout</button>
        <input className = "room_input" id = "user_message"/>
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
