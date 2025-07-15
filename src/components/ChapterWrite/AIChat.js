import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiFeather } from 'react-icons/fi';
import { nanoid } from 'nanoid';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';
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
    parts: [{ text: 'Tuyệt vời! Tôi đã sẵn sàng để đồng hành cùng bạn trong hành trình sáng tác. Cần hỗ trợ về ý tưởng, nhân vật hay cốt truyện? Hãy nói tôi biết nhé!' }]
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

  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

  // Only scroll when not streaming
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleUnload = () => {
      window.localStorage.removeItem(STORAGE_KEY);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: nanoid(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const fullPrompt = `Dựa vào bối cảnh câu chuyện sau đây:\n---\n${content}\n---\nBây giờ, hãy trả lời yêu cầu của tôi: "${input}"`;
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text === userMessage.text ? fullPrompt : msg.text }]
      }));
      const apiPayload = [...SYSTEM_INSTRUCTION, ...chatHistory];

      // Insert placeholder for AI response
      const aiId = nanoid();
      setMessages(prev => [...prev, { id: aiId, text: '', sender: 'ai' }]);

      // Stream from API
      const stream = await ai.models.generateContentStream({
        model: isVip ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
        contents: apiPayload
      });

      for await (const chunk of stream) {
        setMessages(prev => prev.map(msg =>
          msg.id === aiId
            ? { ...msg, text: msg.text + (chunk.text || '') }
            : msg
        ));
      }

    } catch (error) {
      console.error('Error fetching from AI:', error);
      setMessages(prev => [...prev, { id: nanoid(), text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.', sender: 'ai' }]);
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
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
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
