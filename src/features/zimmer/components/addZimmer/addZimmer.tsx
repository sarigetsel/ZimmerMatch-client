import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useAddZimmerMutation, useUpdateZimmerMutation } from "../../redux/zimmerApi";
import { FacilityValues, FacilityLabels } from "../../../../common/constants/enums";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './AddZimmer.css'; 
import type { Zimmer } from "../../redux/zimmerSlice";

const markerIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface ApiError {
    status: number;
    data?: {
        errors?: Record<string, string[]>;
        title?: string;
        message?: string;
    };
}

interface AddZimmerProps {
    onClose: () => void;
    existingZimmer?: Zimmer;
}

const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 250);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

export const AddZimmer = ({ onClose, existingZimmer }: AddZimmerProps) => {
    const [addZimmer, { isLoading: isAdding }] = useAddZimmerMutation();
    const [updateZimmer, { isLoading: isUpdating }] = useUpdateZimmerMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitialFacilities = () => {
        if (!existingZimmer?.facilities) return [];
        const facilitiesVal = Number(existingZimmer.facilities);
        if (isNaN(facilitiesVal)) return [];

        return Object.values(FacilityValues)
            .filter(v => typeof v === 'number' && v > 0 && (facilitiesVal & v) === v) as number[];
    };

    const [formData, setFormData] = useState({
        ownerId: existingZimmer?.ownerId || 0,
        nameZimmer: existingZimmer?.nameZimmer || "",
        description: existingZimmer?.description || "",
        city: existingZimmer?.city || "",
        address: existingZimmer?.address || "",
        latitude: existingZimmer?.latitude || 32.0853,
        longitude: existingZimmer?.longitude || 34.7818,
        numRooms: existingZimmer?.numRooms || 1,
        pricePerNight: existingZimmer?.pricePerNight || 0,
        facilities: getInitialFacilities(),
    });

    const [previews, setPreviews] = useState<string[]>(existingZimmer?.arrImages || []);

    const LocationPicker = () => {
        useMapEvents({
            click(e) {
                setFormData(prev => ({
                    ...prev,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }));
            },
        });
        return <Marker position={[formData.latitude, formData.longitude]} icon={markerIcon} />;
    };

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

        data.append("NameZimmer", formData.nameZimmer);
        data.append("Description", formData.description || "");
        data.append("City", formData.city || "");
        data.append("Address", formData.address || "");
        data.append("Latitude", formData.latitude.toString());
        data.append("Longitude", formData.longitude.toString());
        data.append("NumRooms", formData.numRooms.toString());
        data.append("PricePerNight", formData.pricePerNight.toString());
        data.append("OwnerId", formData.ownerId.toString());

        const facilitiesSum = formData.facilities.reduce((acc, curr) => acc + curr, 0);
        data.append("Facilities", facilitiesSum.toString());

        const createdAt = existingZimmer?.createdAt || new Date().toISOString();
        data.append("CreatedAt", createdAt);

        if (fileInputRef.current?.files) {
            Array.from(fileInputRef.current.files).forEach(file => {
                data.append("ImageFiles", file); 
            });
        }

        if (existingZimmer) {
            data.append("ZimmerId", existingZimmer.zimmerId.toString());
        }

        try {
            if (existingZimmer) {
                await updateZimmer({ id: existingZimmer.zimmerId, data }).unwrap();
                alert("הצימר עודכן בהצלחה!");
            } else {
                await addZimmer(data).unwrap();
                alert("הצימר נוסף בהצלחה!"); 
            } 
            onClose(); 
        } catch (err) {
            const error = err as ApiError;
            console.error("Submit Error:", error);
            alert("קרתה שגיאה בשמירת הנתונים.");
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

                    <div className="map-wrapper">
                        <label className="label-title">בחר מיקום על המפה:</label>
                        <div className="map-container">
                            <MapContainer center={[formData.latitude, formData.longitude]} zoom={13} scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationPicker />
                                <MapResizer />
                            </MapContainer>
                        </div>
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
                            {Object.entries(FacilityValues)
                                .filter(([key]) => isNaN(Number(key)))
                                .map(([name, value]) => {
                                    const val = value as number;
                                    return (
                                        <label key={val} className="facility-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.facilities.includes(val)}
                                                onChange={() => handleFacilityToggle(val)}
                                            />
                                            {FacilityLabels[val] || name}
                                        </label>
                                    );
                                })}
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