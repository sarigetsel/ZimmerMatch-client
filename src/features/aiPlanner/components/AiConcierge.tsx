import React, { useState, useRef, useEffect } from "react";
import { askAiPlanner } from "../redux/api";
import "./AiConcierge.scss";

interface ZimmerData {
  name: string;
  location: string;
}

interface AiConciergeProps {
  zimmerData: ZimmerData;
  bookingDates: string;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

interface Message {
  role: "user" | "model";
  text: string;
  time: Date;
}

const SUGGESTIONS: string[] = [
  "איך להתארגן לצימר?",
  "מה כדאי לארוז?",
  "יש מסלולי טיול קרובים?",
  "איפה בית הכנסת הקרוב?"
];

export default function AiConcierge({ zimmerData, bookingDates }: AiConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]); 
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return; 

    const contextMsg = messages.length === 0 
      ? `צימר: ${zimmerData.name}, מיקום: ${zimmerData.location}, תאריכים: ${bookingDates}. ${msg}`
      : msg;

    setInput("");
    const userMsg: Message = { role: "user", text: msg, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await askAiPlanner(contextMsg, history, ""); 
      
      const replyText = data?.reply || (typeof data === 'string' ? data : "סיימתי לבדוק עבורך!");
      
      const botMsg: Message = { role: "model", text: replyText, time: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      
      if (data?.updatedHistory) {
        setHistory(data.updatedHistory);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = { 
        role: "model", 
        text: "אופס, משהו השתבש בתקשורת עם השרת. ודא ששרת ה-Backend רץ ב-Visual Studio.", 
        time: new Date() 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-concierge-container" dir="rtl">
      <div className="chat-header">
        <div className="bot-avatar">🏖️</div>
        <div className="bot-info">
          <h3>הקונסיירז' האישי שלך</h3>
          <p>מוכן לעזור לך לתכנן את החופשה ב{zimmerData.name}</p>
        </div>
      </div>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="welcome-area">
            <h4>היי, איזה כיף שאתה מתעניין!</h4>
            <p>אני כאן כדי לעזור לך לבדוק הכל על האזור. מאיפה נתחיל?</p>
            <div className="suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} type="button" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="typing">בודק עבורך את הפרטים... 🏖️</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <input 
          value={input} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="מה בא לך לדעת על הצימרים המטורפים של Oppa?..." 
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button 
          onClick={() => sendMessage()} 
          disabled={!input.trim() || loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
}