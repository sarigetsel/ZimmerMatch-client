export const FacilityValues: Record<string, number> = {
   Pool:1,               
   Parking:2,            
   Garden:4,              
   Wifi:8,              
   Jacuzzi:16,            
   Accessible:32,         
   AirConditioning:64,    
   BBQ:128,                
   Kitchen:256,            
   Heating:512,            
   Playground:1024,         
   Seaview:2048,            
   PrivateParking:4096,     
   BreakfastIncluded:8192,  
   OutdoorSeating:16384,    
   Laundry:32768,            
   Sauna:65536               

} as const;


export const FacilityLabels: Record<number, string> = { 
    [FacilityValues.Pool]: "בריכה",
    [FacilityValues.Parking]: "חניה",
    [FacilityValues.Garden]: "חצר",
    [FacilityValues.Wifi]: "אינטרנט",
    [FacilityValues.Jacuzzi]: "ג'קוזי",
    [FacilityValues.Accessible]: "נגישות",
    [FacilityValues.AirConditioning]: "מיזוג",
    [FacilityValues.BBQ]: "על האש",
    [FacilityValues.Kitchen]: "מטבח מאובזר",
    [FacilityValues.Heating]: "חימום",
    [FacilityValues.Playground]: "משחקיה",
    [FacilityValues.Seaview]: "נוף לים",
    [FacilityValues.PrivateParking]: "חניה פרטית",
    [FacilityValues.BreakfastIncluded]: "ארוחת בוקר",
    [FacilityValues.OutdoorSeating]: "פינה ישיבה חיצונית",
    [FacilityValues.Laundry]: "מכונת-כביסה",
    [FacilityValues.Sauna]: "סאונה",
};

/*
export const RoleValues = {
    Guest: 0,
    Owner: 1,
    Admin: 2
} as const;

export const RoleLabels: Record<number, string> = {
    [RoleValues.Guest]: "אורח",
    [RoleValues.Owner]: "בעל צימר",
    [RoleValues.Admin]: "מנהל מערכת"
};

export type RoleType = typeof RoleValues[keyof typeof RoleValues];*/

export type FacilityType = typeof FacilityValues[keyof typeof FacilityValues];