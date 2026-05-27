import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useForm } from "react-hook-form";
import { useAddZimmerMutation, useUpdateZimmerMutation } from "../../redux/zimmerApi";
import { FacilityValues, FacilityLabels } from "../../../../common/constants/enums";
import L from "leaflet";
import type { Zimmer } from "../../redux/zimmerSlice";
import "leaflet/dist/leaflet.css";
import "./AddZimmer.scss";

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

interface ZimmerFormData {
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

const formatImageSrc = (imgData: number[] | string): string => {
  if (!imgData) return "";
  if (typeof imgData === 'string') return imgData;
  const binary = String.fromCharCode(...(imgData as number[]));
  return `data:image/jpeg;base64,${window.btoa(binary)}`;
};

export const AddZimmer = ({ onClose, existingZimmer }: AddZimmerProps) => {
  const [addZimmer, { isLoading: isAdding }] = useAddZimmerMutation();
  const [updateZimmer, { isLoading: isUpdating }] = useUpdateZimmerMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialFacilities = () => {
    if (!existingZimmer?.facilities) return [];
    const facilitiesVal = Number(existingZimmer.facilities);
    if (isNaN(facilitiesVal)) return [];

    const validFacilityNumbers = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536];
    return validFacilityNumbers.filter((v) => (facilitiesVal & v) === v);
  };

  const { register, handleSubmit, setValue, watch } = useForm<ZimmerFormData>({
    defaultValues: {
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
    }
  });

  const watchedLatitude = watch("latitude");
  const watchedLongitude = watch("longitude");
  const watchedFacilities = watch("facilities");

  const [previews, setPreviews] = useState<(number[] | string)[]>(existingZimmer?.arrImages || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setValue("latitude", e.latlng.lat);
        setValue("longitude", e.latlng.lng);
      },
    });
    return <Marker position={[watchedLatitude, watchedLongitude]} icon={markerIcon} />;
  };

  const handleFacilityToggle = (value: number) => {
    const isSelected = watchedFacilities.includes(value);
    const updatedFacilities = isSelected
      ? watchedFacilities.filter((id) => id !== value)
      : [...watchedFacilities, value];
    
    setValue("facilities", updatedFacilities);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewFiles((prev) => [...prev, ...fileArray]);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const onFormSubmit = async (data: ZimmerFormData) => {
    const formDataDto = new FormData();

    formDataDto.append("NameZimmer", data.nameZimmer);
    formDataDto.append("Description", data.description || "");
    formDataDto.append("City", data.city || "");
    formDataDto.append("Address", data.address || "");
    formDataDto.append("Latitude", data.latitude.toString());
    formDataDto.append("Longitude", data.longitude.toString());
    formDataDto.append("NumRooms", data.numRooms.toString());
    formDataDto.append("PricePerNight", data.pricePerNight.toString());
    formDataDto.append("OwnerId", data.ownerId.toString());

    const combinedFacilitiesValue = data.facilities.reduce((total, currentVal) => {
      return total | currentVal;
    }, 0);

    formDataDto.append("Facilities", combinedFacilitiesValue.toString());

    const createdAt = existingZimmer?.createdAt 
      ? new Date(existingZimmer.createdAt).toISOString().split('.')[0] 
      : new Date().toISOString().split('.')[0];

    formDataDto.append("CreatedAt", createdAt);

    if (newFiles.length > 0) {
      newFiles.forEach((file) => {
        formDataDto.append("ImageFiles", file);
      });
    }

    if (existingZimmer?.imageUrls) {
      existingZimmer.imageUrls.forEach(url => {
        formDataDto.append("ImageUrls", url);
      });
    }

    if (existingZimmer) {
      formDataDto.append("Id", existingZimmer.zimmerId.toString());
      formDataDto.append("ZimmerId", existingZimmer.zimmerId.toString());
    }

    try {
      if (existingZimmer) {
        await updateZimmer({ id: existingZimmer.zimmerId, data: formDataDto }).unwrap();
        alert("הצימר עודכן בהצלחה!");
      } else {
        await addZimmer(formDataDto).unwrap();
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
    <div className="add-zimmer-context">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 style={{ textAlign: "center", marginTop: 0 }}>
            {existingZimmer ? "עריכת צימר" : "הוספת צימר חדש"}
          </h2>

          <form onSubmit={handleSubmit(onFormSubmit)} className="form-container">
            
            <input className="input-field" placeholder="שם הצימר" {...register("nameZimmer", { required: true })} />
            <textarea className="input-field" placeholder="תיאור" rows={3} {...register("description")} />

            <div className="row">
              <input className="input-field flex-1" placeholder="עיר" {...register("city", { required: true })} />
              <input className="input-field flex-1" placeholder="כתובת" {...register("address")} />
            </div>

            <div className="map-wrapper">
              <label className="label-title">בחר מיקום על המפה:</label>
              <div className="map-container">
                <MapContainer center={[watchedLatitude, watchedLongitude]} zoom={13} scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker />
                  <MapResizer />
                </MapContainer>
              </div>
            </div>

            <div className="row">
              <div className="flex-1">
                <label className="label-title"> קו רוחב:</label>
                <input type="number" step="any" className="input-field flex-1" placeholder="קו רוחב" {...register("latitude", { valueAsNumber: true })} />
              </div>

              <div className="flex-1">
                <label className="label-title"> קו אורך:</label>
                <input type="number" step="any" className="input-field flex-1" placeholder="קו אורך" {...register("longitude", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="row">
              <div className="flex-1">
                <label className="label-title">מספר חדרים:</label>
                <input type="number" className="input-field" {...register("numRooms", { valueAsNumber: true })} />
              </div>
              <div className="flex-1">
                <label className="label-title">מחיר ללילה:</label>
                <input type="number" className="input-field" placeholder="מחיר" {...register("pricePerNight", { required: true, valueAsNumber: true })} />
              </div>
            </div>

            <div className="facilities-container">
              <label className="label-title">מתקנים:</label>
              <div className="facilities-grid">
                {Object.entries(FacilityValues).filter(([key]) => isNaN(Number(key))).map(([name, value]) => {
                  const val = value as number;
                  return (
                    <label key={val} className="facility-checkbox-label">
                      <input type="checkbox" checked={watchedFacilities.includes(val)} onChange={() => handleFacilityToggle(val)} />
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
                <img key={index} src={formatImageSrc(img)} alt="preview" className="preview-img" />
              ))}
            </div>

            <div className="button-group">
              <button type="submit" disabled={isAdding || isUpdating} className="submit-btn">
                {isAdding || isUpdating ? "שומר..." : "אישור"}
              </button>
              <button type="button" onClick={onClose} className="cancel-btn">ביטול</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};