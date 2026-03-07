/*import {type User } from '../redux/userSlice';

interface UserCardProps {
    user: User;
    onDelete: (id: number) => void; 
}

const UserCard = ({ user, onDelete }: UserCardProps) => {
    const roleValue = user.role !== undefined ? user.role : undefined;
    return (
        <div style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', borderRadius: '8px' }}>
            <h4>{user.name}</h4> 
            <p>אימייל: {user.email}</p>
            <p>טלפון: {user.phone}</p>
            <p>תפקיד: <strong>{roleValue || "לא הוגדר"}</strong></p>            
            <button onClick={() => onDelete(user.id)}>מחק משתמש</button>
        </div>
    );
};

export default UserCard;*/