export interface ChatHistoryItem {
    role: "user" | "model";
    parts: { text: string }[];
}

interface ChatResponse {
    reply: string;
    updatedHistory: ChatHistoryItem[];
}

export interface ZimmerDetailsDto {
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
}

export const askAiPlanner = async (
    message: string, 
    history: ChatHistoryItem[], 
    zimmerData: ZimmerDetailsDto, 
    token?: string
): Promise<ChatResponse> => {
    
    const formattedHistory = (history || []).map(item => ({
        Role: item.role === "model" ? "model" : "user", 
        Text: item.parts && item.parts.length > 0 ? item.parts[0].text : ""
    }));

    const response = await fetch("https://localhost:7195/api/Chat/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ 
            Message: message, 
            History: formattedHistory,
            ZimmerDetails: zimmerData
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`שגיאת שרת: ${errorText}`);
    }

    return response.json() as Promise<ChatResponse>;
};