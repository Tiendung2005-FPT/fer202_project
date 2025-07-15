import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiFeather } from 'react-icons/fi';
import { nanoid } from 'nanoid';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import './AIChat.css';

const STORAGE_KEY = 'aiChatMessages';
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

const AIChat = ({ content, isVip, title }) => {
  // 1) Initialize from localStorage if present, otherwise with a welcome message
  const [messages, setMessages] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [{ id: 'init', text: "Chào bạn! Tôi có thể giúp gì cho câu chuyện của bạn?", sender: 'ai' }];
    } catch {
      return [{ id: 'init', text: "Chào bạn! Tôi có thể giúp gì cho câu chuyện của bạn?", sender: 'ai' }];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const ai = new GoogleGenAI({
    apiKey: process.env.REACT_APP_GEMINI_API_KEY,
  });

  // 2) Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3) Auto‐resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // 4) Persist chat to localStorage on every change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // 5) Clear storage when leaving/unmounting
  useEffect(() => {
    const handleUnload = () => {
      window.localStorage.removeItem(STORAGE_KEY);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.localStorage.removeItem(STORAGE_KEY);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // add user message
    const userMessage = { id: nanoid(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // build prompt & history
      const fullPrompt = `Dựa vào bối cảnh câu chuyện sau đây:\n---\n${content}\n---\nBây giờ, hãy trả lời yêu cầu của tôi: "${input}"`;
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text === userMessage.text ? fullPrompt : msg.text }],
      }));
      const apiPayload = [...SYSTEM_INSTRUCTION, ...chatHistory];

      // call AI
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
        <FiFeather /> Viết truyện với AI
      </h3>
      <div className="chat-messages">
        {messages.map(msg => (
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
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
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
