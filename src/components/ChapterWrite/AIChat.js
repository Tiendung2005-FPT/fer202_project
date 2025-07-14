import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiFeather } from 'react-icons/fi';
import { nanoid } from 'nanoid';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import './AIChat.css';

const SYSTEM_INSTRUCTION = [
    {
        role: 'user',
        parts: [{
            text: 'Bạn là một trợ lý sáng tác truyện chuyên nghiệp, có nhiệm vụ hỗ trợ tôi trong việc lên ý tưởng, xây dựng nhân vật, tạo nút thắt và viết các cảnh truyện hấp dẫn. Luôn trả lời bằng tiếng Việt với giọng văn thân thiện, truyền cảm hứng và sáng tạo. Hãy đưa ra các gợi ý phong phú nhưng vẫn để lại không gian để tôi tự phát triển thêm theo ý mình.'
        }]
    },
    {
        role: 'model',
        parts: [{
            text: 'Tuyệt vời! Tôi đã sẵn sàng để đồng hành cùng bạn trong hành trình sáng tác. Cần hỗ trợ về ý tưởng, nhân vật hay cốt truyện? Hãy nói tôi biết nhé!'
        }]
    }
];


const MessageBubble = ({ msg }) => (
    <div className={`message-wrapper ${msg.sender}`}>
        <div className="message-bubble">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
    </div>
);

const TypingIndicator = () => (
    <div className="message-wrapper ai">
        <div className="message-bubble typing-indicator">
            <span /> <span /> <span />
        </div>
    </div>
);

const AIChat = ({ content, isVip }) => {
    const [messages, setMessages] = useState([
        { id: 'init', text: "Chào bạn! Tôi có thể giúp gì cho câu chuyện của bạn?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const ai = new GoogleGenAI({
        apiKey: process.env.REACT_APP_GEMINI_API_KEY,
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { id: nanoid(), text: input, sender: 'user' };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        setIsLoading(true);
        const currentInput = input;
        setInput('');

        try {
            const fullPrompt =
                `Dựa vào bối cảnh câu chuyện sau đây:
---
${content}
---
Bây giờ, hãy trả lời yêu cầu của tôi: "${currentInput}"`;

            const chatHistory = updatedMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{
                    text: msg.id === userMessage.id ? fullPrompt : msg.text
                }],
            }));

            const apiPayload = [
                ...SYSTEM_INSTRUCTION,
                ...chatHistory,
            ];

            const response = await ai.models.generateContent({
                model: isVip ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
                contents: apiPayload,
            });

            const aiMessage = { id: nanoid(), text: response.text, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error fetching from AI:", error);
            const errorMessage = { id: nanoid(), text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-chat-container">
            <h3 className="ai-chat-header">
                <FiFeather />
                Viết truyện với AI
            </h3>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleSend}>
                <div className="chat-input-wrapper">
                    <textarea
                        ref={textareaRef}
                        className="chat-textarea"
                        placeholder="Nhập ý tưởng, nhân vật, cốt truyện..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        rows={1}
                    />
                    <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
                        <FiSend />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIChat;