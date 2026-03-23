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
    Role: 0,
  });

  const [login,    { isLoading: isLoggingIn  }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'Role' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login({
          Email: formData.Email,
          Password: formData.Password,
        }).unwrap();
        dispatch(setAuth({ user: response.user, token: response.token }));
        alert('התחברת בהצלחה!');
      } else {
        const data = new FormData();
        data.append('Name', formData.Name);
        data.append('Email', formData.Email);
        data.append('Phone', formData.Phone);
        data.append('Password', formData.Password);
        data.append('Role', formData.Role.toString());
        await register(data).unwrap();
        alert('נרשמת בהצלחה! כעת ניתן להתחבר.');
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } | string };
      const msg = typeof error.data === 'object'
        ? error.data?.message
        : error.data || 'פעולה נכשלה';
      alert('שגיאה: ' + msg);
    }
  };

  const isLoading = isLoggingIn || isRegistering;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose} aria-label="סגור">✕</button>

        <div className="modal-inner">

          <span className="modal-eyebrow">
            {isLogin ? 'כניסה לחשבון' : 'יצירת חשבון'}
          </span>
          <h2 className="modal-title">
            {isLogin ? 'ברוכים השבים' : 'הצטרפו אלינו'}
          </h2>

          <form onSubmit={handleSubmit} className="modal-form">

            {!isLogin && (
              <>
                <div className="input-group">
                  <label>שם מלא</label>
                  <input
                    name="Name"
                    placeholder="ישראל ישראלי"
                    onChange={handleChange}
                    className="modal-input"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="input-group">
                  <label>טלפון</label>
                  <input
                    name="Phone"
                    placeholder="05X-XXXXXXX"
                    onChange={handleChange}
                    className="modal-input"
                    required
                    autoComplete="tel"
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label>כתובת אימייל</label>
              <input
                name="Email"
                type="email"
                placeholder="name@example.com"
                onChange={handleChange}
                className="modal-input"
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label>סיסמה</label>
              <input
                name="Password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="modal-input"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {!isLogin && (
              <div className="input-group">
                <label>סוג משתמש</label>
                <select name="Role" onChange={handleChange} className="modal-input">
                  <option value={0}>אני מחפש צימר (לקוח)</option>
                  <option value={1}>אני בעל צימר</option>
                  <option value={2}>מנהל מערכת</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`modal-submit-btn${isLoading ? ' loading' : ''}`}
            >
              {isLogin
                ? (isLoggingIn  ? 'מתחבר…'    : 'כניסה לחשבון')
                : (isRegistering ? 'נרשם…'     : 'יצירת חשבון')}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;