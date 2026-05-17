export interface ChatHistoryItem {
    role: "user" | "model";
    parts: { text: string }[];
}

interface ChatResponse {
    reply: string;
    updatedHistory: ChatHistoryItem[];
}

export const askAiPlanner = async (
    message: string, 
    history: ChatHistoryItem[], 
    token: string
): Promise<ChatResponse> => {
    
    // מיפוי ההיסטוריה בצורה מדויקת עם אותיות גדולות, תואם ב-100% למחלקת ChatMessage ב-C#
    const formattedHistory = (history || []).map(item => ({
        Role: item.role === "model" ? "model" : "user", // התאמה לערכי ה-Role
        Text: item.parts && item.parts.length > 0 ? item.parts[0].text : ""
    }));

    const response = await fetch("https://localhost:7195/api/Chat/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        // בניית האובייקט עם אותיות גדולות בהתחלה (Message, History) תואם ל-UserRequest
        body: JSON.stringify({ 
            Message: message, 
            History: formattedHistory 
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`שגיאת שרת: ${errorText}`);
    }

    return response.json() as Promise<ChatResponse>;
};