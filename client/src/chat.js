import React, { Component } from 'react';
import './chat.css';

class chat extends Component {


  sendClicked(){


  }

  jumpEndClicked(){

  }

  logoutClicked()
  {
      localStorage.account = ""
      localStorage.token = ""

      window.location.replace( "/" )
  }

  joinRoomClicked(){

  }

  componentDidMount()
  {
      if ( !localStorage.account || !localStorage.token )
      {
          localStorage.account = "";
          localStorage.token = "";

          window.location.replace("/")
      }
  }

    render() {
     return (
       <div className="Chat">
        <button onClick={() => this.jumpEndClicked()} className = "jump_end">END</button>
        <button onClick={() => this.joinRoomClicked()} className = "join_room_btn">JOIN ROOM</button>
        <button onClick={() => this.logoutClicked()} className = "logout_btn">logout</button>
        <input className = "room_input" id = "user_message"/>
        <div className = "input_holder">
        
        <div className = "chat_bubbles">
        
        
        
        
        </div>
        
        <textarea className = "chat_input" id = "user_message"/>
        <button onClick={() => this.sendClicked()} className = "chat_send">SEND</button>
        
        </div>

        


        
      </div>
     );
    }
    
  }

export default chat;
