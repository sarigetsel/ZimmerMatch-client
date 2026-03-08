import { useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { type RootState } from '../../../../app/store';
import { logout } from '../../redux/userSlice';
import LoginModal from '.././loginModal/loginModal';
import { AddZimmer } from '../../../zimmer/components/addZimmer/addZimmer';
import './Navbar.css'; 

const Navbar = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'login' | 'register'>('login');
    const [showAddForm, setShowAddForm] = useState(false);

    const handleOpenLogin = () => {
        setModalType('login');
        setModalOpen(true);
    };

    const handleOpenRegister = () => {
        setModalType('register');
        setModalOpen(true);
    };

    return (
        <nav className="navbar">
            <div className="nav-logo" onClick={() => navigate("/")}>ZimmerMatch</div>
            
            <div className="nav-links">
                {currentUser ? (
                    <>
                        <span className="nav-welcome">שלום, {currentUser.name}</span>
                        
                        {currentUser?.role === "Admin" && (
                            <button onClick={() => navigate("/admin")} className="nav-btn btn-admin">
                                ניהול מערכת
                            </button>
                        )}

                        {currentUser.role === "Owner" && (
                            <>
                                {!showAddForm && (
                                    <button onClick={() => navigate("/my-zimmers")} className="nav-btn btn-my-zimmers">
                                        הצימרים שלי
                                    </button>
                                )}
                                {showAddForm && (
                                    <AddZimmer onClose={() => setShowAddForm(false)} />
                                )}
                            </>
                        )} 
                        <button onClick={() => dispatch(logout())} className="nav-btn btn-logout">התנתק</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleOpenLogin} className="nav-btn btn-login">התחברות</button>
                        <button onClick={handleOpenRegister} className="nav-btn btn-register">הרשמה</button>
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

export default Navbar;