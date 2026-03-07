import React, { useState, useRef } from "react";
import { useAddZimmerMutation, useUpdateZimmerMutation  } from "../../redux/zimmerApi";
import { FacilityValues } from "../../../../common/constants/enums";
import './AddZimmer.css'; 
import type { Zimmer } from "../../redux/zimmerSlice" 

interface AddZimmerProps {
    onClose: () => void;
    existingZimmer?: Zimmer;
}

export const AddZimmer = ({ onClose, existingZimmer }: AddZimmerProps) => {
    const [addZimmer, { isLoading: isAdding }] = useAddZimmerMutation();
    const [updateZimmer, { isLoading: isUpdating }] = useUpdateZimmerMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

       
    const [formData, setFormData] = useState<{
        ownerId: number;
        nameZimmer: string;
        description: string;
        city: string;
        address: string;
        latitude: number;
        longitude: number;
        numRooms: number;
        pricePerNight: number;
        facilities: number[];
    }>({
        ownerId: existingZimmer?.ownerId || 2,
        nameZimmer: existingZimmer?.nameZimmer || "",
        description: existingZimmer?.description || "",
        city: existingZimmer?.city || "",
        address: existingZimmer?.address || "",
        latitude: existingZimmer?.latitude || 32.0853,
        longitude: existingZimmer?.longitude || 34.7818,
        numRooms: existingZimmer?.numRooms || 1,
        pricePerNight: existingZimmer?.pricePerNight || 0,
        facilities: existingZimmer?.facilities
           ? Array.isArray(existingZimmer.facilities)
             ? existingZimmer.facilities.map(f => Number(f))
             : [Number(existingZimmer.facilities)]
        : [],
    });
    
    const [previews, setPreviews] = useState<string[]>(
    existingZimmer?.arrImages || []
);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value
        }));
    };

    const handleFacilityToggle = (value: number) => {
        setFormData(prev => {
            const isSelected = prev.facilities.includes(value);
            return {
                ...prev,
                facilities: isSelected 
                    ? prev.facilities.filter(id => id !== value) 
                    : [...prev.facilities, value]
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            const newPreviews = fileArray.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();

        if(existingZimmer){
            data.append("ZimmerId", String(existingZimmer.zimmerId));
            data.append("OwnerId", String(existingZimmer.ownerId));
            const isoDate = new Date(existingZimmer.createdAt).toISOString();
            data.append("CreatedAt", isoDate);
        }else{
            data.append("OwnerId",String(formData.ownerId));
            data.append("CreatedAt", new Date().toISOString());
        }
        data.append("NameZimmer", formData.nameZimmer);
        data.append("Description", formData.description || "");
        data.append("City", formData.city);
        data.append("Address", formData.address || "");
        data.append("Latitude", formData.latitude.toString());
        data.append("Longitude", formData.longitude.toString());
        data.append("NumRooms", formData.numRooms.toString());
        data.append("PricePerNight", formData.pricePerNight.toString());

        const facilitiesSum = formData.facilities.reduce((acc, curr) => acc + curr, 0);
        data.append("Facilities", facilitiesSum.toString());

        if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
            Array.from(fileInputRef.current.files).forEach(file => {
               data.append("ImageFiles", file); 
            });
        }

        try {
        if(existingZimmer) {
            // שימי לב: id נשלח ל-URL, ו-data (ה-FormData) נשלח כ-body
            await updateZimmer({ id: existingZimmer.zimmerId, data }).unwrap();
            alert("הצימר עודכן בהצלחה!");
        } else {
            await addZimmer(data).unwrap();
            alert("הצימר נוסף בהצלחה!"); 
        } 
        onClose(); 
    } catch (err) {
       const error = err as { data?: { message?: string; errors?: Record<string, string[]> } };
       console.error("Server Error:", error);
       const errorMessage = error.data?.message || "קרתה שגיאה בעדכון הנתונים";
       alert("שגיאה: " + errorMessage);
    }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ textAlign: "center", marginTop: 0 }}>
                    {existingZimmer ? "עריכת צימר" : "הוספת צימר חדש"}
                </h2>
                
                <form onSubmit={handleSubmit} className="form-container">
                    
                    <input name="nameZimmer" className="input-field" value={formData.nameZimmer} placeholder="שם הצימר" onChange={handleChange} required />
                    <textarea name="description" className="input-field" value={formData.description} placeholder="תיאור" onChange={handleChange} rows={3} />
                    
                    <div className="row">
                        <input name="city" className="input-field flex-1" value={formData.city} placeholder="עיר" onChange={handleChange} required />
                        <input name="address" className="input-field flex-1" value={formData.address} placeholder="כתובת" onChange={handleChange} />
                    </div>

                    <div className="row">
                        <div className="flex-1">
                            <label className="label-title">מספר חדרים:</label>
                            <input name="numRooms" type="number" className="input-field" value={formData.numRooms} onChange={handleChange} />
                        </div>
                        <div className="flex-1">
                            <label className="label-title">מחיר ללילה:</label>
                            <input name="pricePerNight" type="number" className="input-field" value={formData.pricePerNight} placeholder="מחיר" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="facilities-container">
                        <label className="label-title">מתקנים:</label>
                        <div className="facilities-grid">
                            {Object.entries(FacilityValues).map(([name, value]) => (
                                <label key={value} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "14px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.facilities.includes(value as number)}
                                        onChange={() => handleFacilityToggle(value as number)}
                                    />
                                    {name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label-title">העלאת תמונות:</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                    </div>

                    <div className="preview-images">
                        {previews.map((img, index) => (
                            <img key={index} src={img} alt="preview" className="preview-img" />
                        ))}
                    </div>

                    <div className="button-group">
                        <button type="submit" disabled={isAdding || isUpdating} className="submit-btn">
                            {isAdding || isUpdating ? "שומר..." : "אישור"}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            ביטול
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
   
    
};