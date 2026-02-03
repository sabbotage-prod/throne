import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ 
  t, 
  language, 
  languages, 
  setLanguage, 
  user, 
  onLogout, 
  onLoginClick,
  onSavedSpotsClick,
  onContributionsClick,
  savedSpotsCount = 0,
  contributionsCount = 0,
  locationName,
  showLocation = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const getUserName = () => {
    return user?.user_metadata?.name || 
           user?.user_metadata?.full_name || 
           user?.email?.split('@')[0] || 
           'User';
  };

  const getUserInitial = () => getUserName().charAt(0).toUpperCase();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
      <Link to="/" className="flex items-baseline gap-1">
        <span className="text-xl font-black">Throne</span>
        <span className="text-throne-red text-xl font-black">/</span>
      </Link>

      <div className="flex items-center gap-3">
        {showLocation && locationName && (
          <span className="text-xs text-gray-500 font-bold hidden sm:inline">
            {locationName}
          </span>
        )}

        <LanguageSwitcher 
          language={language} 
          languages={languages} 
          setLanguage={setLanguage} 
        />

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-throne-red text-white font-bold text-sm flex items-center justify-center rounded-sm hover:bg-red-700 transition-colors"
            >
              {getUserInitial()}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-white border-2 border-black w-56 z-50 shadow-lg">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-bold text-sm">{getUserName()}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    onSavedSpotsClick?.();
                    setShowMenu(false);
                  }}
                  className="w-full p-3 text-left text-sm hover:bg-throne-lightgray flex justify-between items-center border-b border-gray-100 transition-colors"
                >
                  <span>{t('auth.savedSpots')}</span>
                  <span className="bg-throne-lightgray px-2 py-0.5 text-xs font-bold">
                    {savedSpotsCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onContributionsClick?.();
                    setShowMenu(false);
                  }}
                  className="w-full p-3 text-left text-sm hover:bg-throne-lightgray flex justify-between items-center border-b border-gray-100 transition-colors"
                >
                  <span>{t('auth.myContributions')}</span>
                  <span className="bg-throne-lightgray px-2 py-0.5 text-xs font-bold">
                    {contributionsCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onLogout?.();
                    setShowMenu(false);
                  }}
                  className="w-full p-3 text-left text-sm font-bold text-throne-red hover:bg-throne-lightgray transition-colors"
                >
                  {t('auth.logOut')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-3 py-1 border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
          >
            {t('auth.logIn')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
