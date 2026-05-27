import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../../../app/store';
import { logout } from '../../redux/userSlice';
import LoginModal from '.././loginModal/loginModal';
import { useModal } from '../../../../hooks/useModal';
import './navbar.scss';

const Navbar = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { listFavoriteZimmers } = useSelector((state: RootState) => state.zimmerState);  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal(false);
  const [modalType, setModalType] = useState<'login' | 'register'>('login');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenLogin = () => { setModalType('login'); openModal(); };
  const handleOpenRegister = () => { setModalType('register'); openModal(); };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => navigate('/')}>
          <span className="logo-accent">Match</span>
          <span className="logo-main">Zimmer</span>
        </div>

        <div className="nav-links">
          <button onClick={() => navigate('/favorites')} className="nav-btn btn-favorites">
             מועדפים ❤️({listFavoriteZimmers.length})
          </button>

          {currentUser ? (
            <>
              <span className="nav-welcome">שלום, {currentUser.name}</span>

              {currentUser.role === 'Admin' && (
                <button onClick={() => navigate('/admin')} className="nav-btn btn-admin">
                  ניהול מערכת
                </button>
              )}

              {currentUser.role === 'Owner' && (
                <>
                  <button onClick={() => navigate('/my-zimmers')} className="nav-btn btn-secondary">
                    הצימרים שלי
                  </button>
                  <button onClick={() => navigate('/owner-bookings')} className="nav-btn btn-secondary">
                    הזמנות
                  </button>
                </>
              )}

              {currentUser.role === 'Guest' && (
                <button onClick={() => navigate('/my-bookings')} className="nav-btn btn-secondary">
                  הזמנות שלי
                </button>
              )}

              <div className="nav-sep" />
              <button onClick={() => dispatch(logout())} className="nav-btn btn-logout">
                התנתק
              </button>
            </>
          ) : (
            <>
              <button onClick={handleOpenLogin} className="nav-btn btn-ghost">התחברות</button>
              <button onClick={handleOpenRegister} className="nav-btn btn-primary">הרשמה</button>
            </>
          )}
        </div>
      </nav>

      <LoginModal
       isOpen={isModalOpen}
       onClose={closeModal}
       type={modalType}
       />
    </>
  );
};

export default Navbar;