import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/supabase';

const Footer = ({ t, onContactClick }) => {
  return (
    <footer className="bg-throne-black text-white p-6 mt-auto">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl font-black">Throne</span>
          <span className="text-throne-red text-xl font-black">/</span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-400 mb-4">{t('common.tagline')}</p>

        {/* Category Legend */}
        <div className="flex gap-4 mb-4">
          {Object.entries(CATEGORIES).map(([name, colors]) => (
            <div key={name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3" 
                style={{ backgroundColor: colors.bg }}
              />
              <span className="text-xs">{t(`categories.${colors.key}`)}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <button
            onClick={onContactClick}
            className="text-throne-red font-bold hover:underline"
          >
            {t('footer.contactUs')} →
          </button>
          <Link 
            to="/privacy" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            {t('legal.privacy')}
          </Link>
          <Link 
            to="/terms" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            {t('legal.terms')}
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">{t('legal.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
