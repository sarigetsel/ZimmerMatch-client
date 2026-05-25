import React, { useState, useRef, useEffect } from "react";
import { askAiPlanner } from "../redux/api";
import { FacilityValues } from "../../../common/constants/enums";
import "./AiConcierge.scss";


interface ZimmerData {
  zimmerId: number;
  ownerId: number;
  nameZimmer: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  numRooms: number;
  pricePerNight: number;
  description: string;
  createdAt: string;
  arrImages?: string[];
  facilities?: number | string;
  owner?: {
    name: string;
    phone: string;
  };
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
      ? `[תאריכי חופשה מבוקשים: ${bookingDates}]. ${msg}`
      : msg;

    setInput("");
    const userMsg: Message = { role: "user", text: msg, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const rawFacilities = zimmerData.facilities;
      let facilitiesNum = 0;

      if (typeof rawFacilities === 'number') {
        facilitiesNum = rawFacilities;
      } else if (typeof rawFacilities === 'string') {
        const parsed = parseInt(rawFacilities, 10);
        if (!isNaN(parsed)) {
          facilitiesNum = parsed;
        } else {
          const facilityNames = rawFacilities.split(',').map(s => s.trim().toLowerCase());
          Object.entries(FacilityValues).forEach(([key, value]) => {
            if (isNaN(Number(key)) && facilityNames.includes(key.toLowerCase())) {
              facilitiesNum |= Number(value);
            }
          });
        }
      }

      const safeZimmerData = {
        ...zimmerData,
        facilities: facilitiesNum,
        owner: zimmerData.owner ? {
          name: zimmerData.owner.name,
          phone: zimmerData.owner.phone
        } : undefined
      };

      const data = await askAiPlanner(contextMsg, history, safeZimmerData); 
      
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
          <p>מוכן לעזור לך לתכנן את החופשה ב{zimmerData.nameZimmer}</p>
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
          placeholder={`מה בא לך לדעת על הצימרים של ${zimmerData.nameZimmer}?...`} 
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