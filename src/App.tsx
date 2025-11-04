import { signal } from "@preact/signals-react"
import "./App.css"
import { useEffect, useRef } from "react"

interface Message {
    content: string
    sender: string
    date: number
    id: number
}
const LOCAL_STORAGE_KEY_MESSAGES = "Messages"
const LOCAL_STORAGE_KEY_NAME = "Name"

function GetMessagesFromLocalStorage(): Message[] {
    const messagesString = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES)

    if (messagesString) {
        return JSON.parse(messagesString)
    }

    const now = Date.now()
    return [
        {
            id: now - 500000,
            sender: "Alex",
            content: "Hey everyone, any plans for the weekend?",
            date: now - 500000,
        },
        {
            id: now - 400000,
            sender: "Mia",
            content: "Not yet! I was thinking of maybe checking out that new food market downtown.",
            date: now - 400000,
        },
        {
            id: now - 350000,
            sender: "Leo",
            content: "Oh, I heard about that! Supposed to have amazing tacos.",
            date: now - 350000,
        },
        {
            id: now - 200000,
            sender: "Alex",
            content: "Tacos? I'm sold. What time were you thinking, Mia?",
            date: now - 200000,
        },
        {
            id: now - 100000,
            sender: "Mia",
            content: "Maybe around 1pm on Saturday? Should be less crowded then.",
            date: now - 100000,
        },
        {
            id: now - 50000,
            sender: "Leo",
            content: "Sounds perfect. See you both there! ✨",
            date: now - 50000,
        },
    ]
}

function GetNameFromLocalStorage(): string {
    const name = localStorage.getItem(LOCAL_STORAGE_KEY_NAME)
    return name ? JSON.parse(name) : "Alex"
}
const messages = signal<Message[]>(GetMessagesFromLocalStorage())
const name = signal<string>(GetNameFromLocalStorage())
const messageContent = signal<string>("")
function SendMessage() {
    if (!messageContent.value.trim()) return
    const newMessage: Message = {
        content: messageContent.value,
        date: Date.now(),
        id: Date.now(),
        sender: name.value || "Anonymous",
    }
    messages.value = [...messages.value, newMessage]
    messageContent.value = ""
}
function App() {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages.value])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages.value))
    }, [messages.value])
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(name.value))
    }, [name.value])

    return (
        <>
            <div className="chat">
                <div>
                    <input
                        value={name.value}
                        onChange={(e) => (name.value = e.target.value)}
                        placeholder="Your Name..."
                    />
                </div>
                <div className="messages">
                    {messages.value.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${
                                message.sender === name.value ? "sent" : "received"
                            }`}
                        >
                            {message.sender !== name.value && (
                                <p className="messageSender">{message.sender}</p>
                            )}
                            <p className="messageContent">{message.content}</p>
                            <p className="messageTime">
                                {new Date(message.date).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="messageInputContainer">
                    <input
                        value={messageContent.value}
                        onChange={(e) => (messageContent.value = e.target.value)}
                        placeholder="Message..."
                        className="messageInput"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                SendMessage()
                            }
                        }}
                    />
                    <button onClick={SendMessage}>Send</button>
                </div>
            </div>
        </>
    )
}

export default App
