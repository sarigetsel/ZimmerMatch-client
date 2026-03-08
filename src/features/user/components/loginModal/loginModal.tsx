import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../../redux/userApi';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/userSlice';
import './LoginModal.css'; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'register';
}

const LoginModal = ({ isOpen, onClose, type }: LoginModalProps) => {
  const dispatch = useDispatch();
  const isLogin = type === 'login';

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Password: '',
    Role: 0
  });

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Role" ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login({ 
            Email: formData.Email, 
            Password: formData.Password 
        }).unwrap();
        dispatch(setAuth({ user: response.user, token: response.token }));
        alert("התחברת בהצלחה!");
      } else {
        const data = new FormData();
        data.append('Name', formData.Name);
        data.append('Email', formData.Email);
        data.append('Phone', formData.Phone);
        data.append('Password', formData.Password);
        data.append('Role', formData.Role.toString());

        await register(data).unwrap();
        alert("נרשמת בהצלחה! כעת ניתן להתחבר.");
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } | string };
      const msg = typeof error.data === 'object' 
                  ? error.data?.message 
                  : error.data || "פעולה נכשלה";
      alert("שגיאה: " + msg);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn">X</button>
        <h2 className="modal-title">{isLogin ? 'התחברות' : 'הרשמה למערכת'}</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {!isLogin && (
            <>
              <input name="Name" placeholder="שם מלא" onChange={handleChange} className="modal-input" required />
              <input name="Phone" placeholder="טלפון" onChange={handleChange} className="modal-input" required />
            </>
          )}
          
          <input name="Email" type="email" placeholder="אימייל" onChange={handleChange} className="modal-input" required />
          <input name="Password" type="password" placeholder="סיסמה" onChange={handleChange} className="modal-input" required />

          {!isLogin && (
            <select name="Role" onChange={handleChange} className="modal-input">
              <option value={0}>אני מחפש צימר (לקוח)</option>
              <option value={1}>אני בעל צימר</option>
              <option value={2}>מנהל מערכת (Admin)</option>
            </select>
          )}

          <button type="submit" disabled={isLoggingIn || isRegistering} className="modal-submit-btn">
            {isLogin ? (isLoggingIn ? 'מתחבר...' : 'התחבר') : (isRegistering ? 'נרשם...' : 'הירשם עכשיו')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;