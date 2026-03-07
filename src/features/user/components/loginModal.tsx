import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../redux/userApi';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/userSlice';

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
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <button onClick={onClose} style={modalStyles.closeBtn}>X</button>
        <h2>{isLogin ? 'התחברות' : 'הרשמה למערכת'}</h2>
        
        <form onSubmit={handleSubmit} style={modalStyles.form}>
          {!isLogin && (
            <>
              <input name="Name" placeholder="שם מלא" onChange={handleChange} style={modalStyles.input} required />
              <input name="Phone" placeholder="טלפון" onChange={handleChange} style={modalStyles.input} required />
            </>
          )}
          
          <input name="Email" type="email" placeholder="אימייל" onChange={handleChange} style={modalStyles.input} required />
          <input name="Password" type="password" placeholder="סיסמה" onChange={handleChange} style={modalStyles.input} required />

          {!isLogin && (
            <select name="Role" onChange={handleChange} style={modalStyles.input}>
              <option value={0}>אני מחפש צימר (לקוח)</option>
              <option value={1}>אני בעל צימר</option>
              <option value={2}>מנהל מערכת (Admin)</option>
            </select>
          )}

          <button type="submit" disabled={isLoggingIn || isRegistering} style={modalStyles.submitBtn}>
            {isLogin ? (isLoggingIn ? 'מתחבר...' : 'התחבר') : (isRegistering ? 'נרשם...' : 'הירשם עכשיו')}
          </button>
        </form>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '350px', position: 'relative' as const, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  closeBtn: { position: 'absolute' as const, top: '10px', right: '10px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '12px', marginTop: '15px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' },
  submitBtn: { padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' as const }
};

export default LoginModal;