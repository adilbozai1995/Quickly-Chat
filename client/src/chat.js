import React, { Component } from 'react';
import './chat.css';

class chat extends Component {

    constructor () {
        super()
        this.state = {
          bubbles:[]
        }
      }

  sendClicked()
  {
      if ( !localStorage.account || !localStorage.token )
      {
          localStorage.account = "";
          localStorage.token = "";

          window.location.replace("/")
          return;
      }

      const content = document.getElementById("messageID").value;
      document.getElementById("messageID").value = "";

      if ( !content ) return;


      const room = this.props.match.params.room

      if ( room == null || room.length > 50 ) return;

      var obj = JSON.stringify({
          "username": localStorage.account,
          "token": localStorage.token,
          "content": content,
          "room": room
      })

      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/api/post", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.onreadystatechange = function ()
      {
          if ( this.readyState === 4 && this.status === 200 )
          {
              var response = JSON.parse(this.responseText);
              console.log(response)

              if ( response.status === "okay" )
              {

              }
              else if ( response.status === "fail" )
              {

              }
          }
      };
      xhttp.send(obj);
  }

  jumpEndClicked()
  {
      var scroller = document.getElementById("chatdivID")
      scroller.scrollTop = scroller.scrollHeight;
  }

  logoutClicked()
  {
      localStorage.account = ""
      localStorage.token = ""

      window.location.replace( "/" )
  }

  joinRoomClicked()
  {
      var room = document.getElementById("roomnameID").value;
      document.getElementById("roomnameID").value = "";

      room = room.replace(/\W/g, '')

      if ( room.length <= 50 ) // Make sure this is a valid room name
      {
          window.location.replace( "/chat/" + room )
      }
  }

  componentDidMount()
  {
      if ( !localStorage.account || !localStorage.token )
      {
          localStorage.account = "";
          localStorage.token = "";

          window.location.replace("/")
      }
      else
      {
          this.fetchInverval = setInterval( this.fetchLoop, 1000, this.props.match.params.room, this );
      }
  }

  componentWillUnmount()
  {
      clearInterval( this.fetchInterval )
  }

  fetchLoop( room, myScope )
  {
      // Abort loop
      if ( !window.location.pathname.startsWith( "/chat/" ) ) return;

      // Make sure we're still logged in
      if ( !localStorage.account || !localStorage.token )
      {
          localStorage.account = "";
          localStorage.token = "";

          window.location.replace("/")
          return;
      }

      if ( room == null || room.length > 50 ) return;

      // Setup starting value
      if ( this.lastMessage == null ) this.lastMessage = 0;

      var obj = JSON.stringify({
          "username": localStorage.account,
          "token": localStorage.token,
          "last": this.lastMessage,
          "room": room
      })

      const loopScope = this

      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/api/fetch", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.onreadystatechange = function ()
      {
          if ( this.readyState === 4 && this.status === 200 )
          {

              var response = JSON.parse(this.responseText);

              if ( response.status === "okay" )
              {

                  for ( var i = 0; i < response.posts.length; i++ )
                  {
                      const post = response.posts[i]

                      var updateVal = {
                          "author":post.author,
                          "content":post.content,
                          "timestamp":post.born
                      }

                      myScope.setState({
                          "bubbles": myScope.state.bubbles.concat(updateVal)
                      })
                  }

                  // Update last message
                  loopScope.lastMessage = response.last
              }
              else if ( response.status === "fail" )
              {
                  if ( response.reason === "invalid security token"
                  ||   response.reason === "no account with that username" )
                  {
                      localStorage.account = "";
                      localStorage.token = "";

                      window.location.replace("/")
                  }
                  else if ( response.reason !== "no new posts" )
                  {
                      console.log(response)
                  }
              }
          }
      };
      xhttp.send(obj);
  }

    render() {
     return (
       <div className="Chat">
        <button onClick={() => this.jumpEndClicked()} className = "jump_end">View Most Recent</button>
        <button onClick={() => this.joinRoomClicked()} className = "join_room_btn">Join Room</button>
        <button onClick={() => this.logoutClicked()} className = "logout_btn">Logout</button>
        <input className="room_input" id="roomnameID"/>
        <div className = "input_holder">
        
        <div className = "chat_bubbles" id="chatdivID">
        {
                // Iterates over each element in the blocks array in the state and makes a span
              this.state.bubbles.map(({author, content, timestamp})=>{
                return (
                    <div className="chatBubble">
                        <div>
                        <span>{content.toString()}</span>
                        <span>{author.toString()}</span>
                        <span>{timestamp.toString()}</span>
                        </div>
                    </div>
                )
              })
            }
        
        
        </div>
        
        <textarea className = "chat_input" id="messageID"/>
        <button onClick={() => this.sendClicked()} className = "chat_send">Send Message</button>
        
        </div>

        


        
      </div>
     );
    }
    
  }

export default chat;
