User
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./chat.css";

const socket = io("http://localhost:5000");

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      // Include the sent message in the messages state
      setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);
      socket.emit("chat message", messageInput);
      setMessageInput("");
    }
  };

  const something = (event) =>{
    if (event.keyCode === 13){
      handleSendMessage();
      
    }
  }

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg.message]);
    });

    // Clean up the socket connection
    // return () => {
    //     socket.disconnect();
    // };
  }, []);

  

  return (
    <div className="ChatApp">
      <div className="MessageContainer">
        {messages.map((msg, index) => (
          <div className="ChatMessage">{msg}</div>
        ))}
      </div>
      <div className="InputContainer">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="MessageInput"
          
        />
        <button onClick={handleSendMessage} className="SendButton" onKeyDown={(e) => something(e) }>
          Send
        </button>
      </div>
    </div>
  );
};