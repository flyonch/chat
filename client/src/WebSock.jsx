import React, { useState, useRef } from 'react'




const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    function connect() {
        socket.current = new WebSocket('ws://localhost:4000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                message: 'connection',
                id: Date.now()
            }
            console.log("Connected user")
            socket.current.send(JSON.stringify(message))
        }

        socket.current.onmessage = (event) => {
            console.log(event)
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }

        socket.current.onclose = () => {
            console.log('socket close')
        }
        socket.current.onerror = () => {
            console.log('socket error')

        }
    }


    const disconnect = async () => {
        setConnected(false)
        const message = {
            event: 'disconnection',
            message: 'disconnection',
            username,
            id: Date.now()
        }
        socket.current.send(JSON.stringify(message));
        socket.current = WebSocket.CLOSED
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }





    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Name"
                    />
                    <button onClick={connect}>Enter name</button>

                </div>
            </div>
        )
    }



    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>send</button>
                    <button onClick={disconnect}>disconnect</button>

                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            <div className="message">{mess.username}. {mess.message}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WebSock
