import { useState,useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256'
import { io } from 'socket.io-client'

import { useRetrieveTeam } from '../../Hooks/useRetrieveTeam';

import { IoMdSend } from "react-icons/io";

import './Clubhouse.css'

const socket = io('http://localhost:5000')

const timeOptions = {
    timeZone: 'America/Phoenix',
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
};
const formatter = new Intl.DateTimeFormat('en-US', timeOptions);


export default function Clubhouse(){
    const getCurrentTime = () => formatter.format(new Date());
    const username = sessionStorage['username'] || 'Anonymous';
    const chat = sha256('Yankees-pub')
    const [currentChat,setCurrentChat] = useState(chat);
    const [contentCounter,setContentCounter] = useState(0);
    const [messages,setMessages] = useState([]);

    const createPost = () => {
        const userInput = document.getElementById('post-input');
        const postContent = userInput.value;
        if(postContent.length === 0){
            return
        }
        const currentTime = getCurrentTime();
        const chatID = uuidv4();

        socket.emit("send_message", {
            room: currentChat,
            chatID: chatID,
            user: username,
            text: postContent,
            timestamp: currentTime
        })

        document.getElementById('post-input').value = '';
        setContentCounter(0);
    }

    const cleanseString = (str) => {
        //To be implemented
    }

    useEffect(() => {
        socket.emit("join_room",{room:currentChat})

        socket.on("message",(msg) => {
            setMessages((prev) => [msg,...prev]);
        })

        socket.on("load_messages", (messages) => {
            setMessages(messages);
        });

        return () => {
            socket.emit("leave_room",{room:currentChat})
            socket.off("message")
        }
    }, [currentChat]);

    return(
        <div className='clubhouse-container'>
            <ClubSelection setCurrentChat={setCurrentChat}/>
            <div className='chat-container'>
                <div className='posts'>
                    {messages.map((message) => {
                        return <Post postInfo={message}/>
                    })}
                </div>
                <div className='post-input-container'>
                    <div style={{display:'flex',flexDirection:'row',cursor:'pointer'}}>    
                        <input id='post-input' className='post-input' maxLength={'800'} placeholder='Message #Clubhouse#' onChange={() => setContentCounter(document.getElementById('post-input').value.length)}></input>
                        <IoMdSend className='send-arrow' onClick={createPost}/>
                    </div>
                    <p className='content-counter'>{contentCounter}/800</p>
                </div>
            </div>
        </div>
    )
}

function ClubSelection({setCurrentChat}){
    const mlbTeams = [
        "New York Yankees","Boston Red Sox","Baltimore Orioles","Toronto Blue Jays","Tampa Bay Rays",
        "Cleveland Guardians","Minnesota Twins","Detroit Tigers","Chicago White Sox","Kansas City Royals",
        "Houston Astros","Oakland Athletics","Seattle Mariners","Texas Rangers","Los Angeles Angels of Anaheim",
        "Philadelphia Phillies","Atlanta Braves","Washington Nationals","Miami Marlins","New York Mets",
        "St. Louis Cardinals","Chicago Cubs","Cincinnati Reds","Pittsburgh Pirates","Milwaukee Brewers",
        "Los Angeles Dodgers","Arizona Diamondbacks","San Francisco Giants","San Diego Padres","Colorado Rockies"
    ]
    return(
        <div className='club-selection-container'>
            {mlbTeams.map((team) => {
                return <ClubSection teamName={team} setCurrentChat={setCurrentChat}/>
            })}
            
        </div>
    )
}

function ClubSection({teamName,setCurrentChat}){
    const teamInfo = useRetrieveTeam(teamName);

    return(
        <>
        <div style={{width:'100%'}}>
            <p style={{width:'100%',fontSize:'20px',borderBottom:'2px solid rgb(150,150,150)',marginBottom:'10px',fontFamily:'"Bebas Neue", sans-serif'}}>{teamInfo.abbr}</p>
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign:'center',margin:'5px'}}>
            <ClubSquare logo={teamInfo.primaryLogo}/>
            <ClubPullout teamName={teamInfo.name} setCurrentChat={setCurrentChat}/>
        </div>
        </>
    )
}

function ClubPullout({teamName,setCurrentChat}){
    return(
        <div className='pullout-container'>
            <ClubPulloutSpot chatName={`${teamName}-pub`} setCurrentChat={setCurrentChat}/>
            <ClubPulloutSpot chatName={`${teamName}-priv`} setCurrentChat={setCurrentChat}/>
        </div>
    )
}

function ClubPulloutSpot({chatName,setCurrentChat}){
    const name = sha256(chatName)
    return(
        <div className='pullout-spot' onClick={()=>setCurrentChat(name)}>
                <p>{chatName}</p>
        </div>
    )
}

function ClubSquare({logo}){
    return(
        <div className='club-square-container' style={{backgroundImage:`url(${logo})`,backgroundSize: "contain"}}>
            <div style={{width:'100%'}}></div>
            
        </div>
    )
}

function Post({postInfo}){
    return(
        <div className='post-container'>
            <div className='profile-image'></div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',flexWrap:'wrap',maxWidth:'100%'}}>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>{postInfo.user}</p>
                    <p className='post-time'>{postInfo.timestamp}</p>
                </div>
                <div className='content'>
                    <p className='post-content'>{postInfo.text}</p>
                </div>
            </div>
        </div>
    )
}