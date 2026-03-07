/*import { useSelector } from 'react-redux';
// ייבוא הטיפוס מהקובץ של ה-store
import {type RootState } from '../../../app/store';
import { useGetUsersQuery, useDeleteUserMutation } from '../redux/userApi'; 
import UserCard from './userCard';
//import { RoleValues } from '../../../common/constants/enums';

const UserList = () => {
    // עכשיו TypeScript יודע ש-state.user קיים ומה המבנה שלו
    // שימוש ב-state.user כי זה השם שהגדרת ב-reducer בתוך ה-store
    const { currentUser } = useSelector((state: RootState) => state.user); 

    console.log("Current User:", currentUser);
    console.log("Role value:", currentUser?.role);

    // בדיקת הרשאה מול ה-Enum
const isAdmin = currentUser?.role === "Admin";
    // הפעלת השאילתה רק אם המשתמש אדמין
    const { data: users, isLoading, error } = useGetUsersQuery(undefined, {
        skip: !isAdmin 
    });

    const [deleteUser] = useDeleteUserMutation();

    if (!isAdmin) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                <h3>גישה חסומה</h3>
                <p>דף זה מיועד למנהלי מערכת בלבד.</p>
            </div>
        );
    }

    if (isLoading) return <div>טוען משתמשים...</div>;
    
    if (error) return <div>שגיאה בטעינת נתונים. וודא שאתה מחובר כראוי.</div>;

    return (
        <div>
            <h2 style={{ paddingRight: '10px' }}>ניהול משתמשים</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {users?.map((u) => (
                    <UserCard 
                        key={u.id} 
                        user={u} 
                        onDelete={(id: number) => deleteUser(id)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default UserList;*/