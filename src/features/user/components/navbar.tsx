import { useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {type RootState } from '../../../app/store.ts';
import { logout } from '../redux/userSlice';
import LoginModal from './loginModal.tsx';
import { AddZimmer } from '../../zimmer/components/addZimmer/addZimmer.tsx';
//import { RoleValues } from '../../../common/constants/enums.ts';

const Navbar = () => {
    // שליפת המשתמש המחובר מה-Redux (בלי any!)
    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ניהול מצב המודאל
    const [isModalOpen, setModalOpen] = useState(false);
    // הגדרת סוג המודאל: 'login' (התחברות) או 'register' (הרשמה)
    const [modalType, setModalType] = useState<'login' | 'register'>('login');
    const [showAddForm, setShowAddForm] = useState(false);
    // פונקציה לפתיחת התחברות
    const handleOpenLogin = () => {
        setModalType('login');
        setModalOpen(true);
    };

    // פונקציה לפתיחת הרשמה
    const handleOpenRegister = () => {
        setModalType('register');
        setModalOpen(true);
    };

    return (
        <nav style={navStyles.navbar}>
            <div style={navStyles.logo}>ZimmerMatch</div>
            
            <div style={navStyles.links}>
                {currentUser ? (
                    <>
                        <span style={navStyles.welcome}>שלום, {currentUser.name}</span>
                        
                       {currentUser?.role==="Admin" &&

                       <button onClick={()=>navigate("/admin")} style={navStyles.adminBtn} >
                         ניהול מערכת
                        </button>
                        }

                        {currentUser.role === "Owner" && (
                        <>
                        {!showAddForm && 
                         (/*<button  onClick={() => setShowAddForm(true)}  style={navStyles.ownerBtn}>
                            הוסף צימר
                           </button>*/
                           <button onClick={() => navigate("/my-zimmers")}>
                           הצימרים שלי
                           </button>
                        )}
                        {showAddForm && (
                         <AddZimmer onClose={() => setShowAddForm(false)} />
                    )}
                    </>
                    )} 
                        <button onClick={() => dispatch(logout())} style={navStyles.logoutBtn}>התנתק</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleOpenLogin} style={navStyles.loginBtn}>התחברות</button>
                        <button onClick={handleOpenRegister} style={navStyles.registerBtn}>הרשמה</button>
                    </>
                )}
            </div>
            <LoginModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                type={modalType} 
            />
        </nav>
    );
};

// עיצובים (Styles)
const navStyles = {
    navbar: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '15px 30px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #ddd',
        alignItems: 'center'
    },
    logo: { fontSize: '24px', fontWeight: 'bold' as const, color: '#007bff' },
    links: { display: 'flex', alignItems: 'center', gap: '10px' },
    welcome: { fontWeight: '500' as const, marginLeft: '10px' },
    loginBtn: { 
        padding: '8px 16px', 
        backgroundColor: '#28a745', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    },
    registerBtn: { 
        padding: '8px 16px', 
        backgroundColor: '#007bff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    adminBtn: { padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' },
    ownerBtn: { padding: '8px 16px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px' },
};

export default Navbar;