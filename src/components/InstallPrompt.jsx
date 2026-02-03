import useInstallPrompt from '../hooks/useInstallPrompt';

const InstallPrompt = ({ t }) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();

  // Already installed - don't show anything
  if (isInstalled) return null;

  // iOS - show manual instructions
  if (isIOS) {
    return (
      <div className="bg-throne-lightgray p-4 border-2 border-black">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <p className="font-bold text-sm">{t('landing.installApp')}</p>
            <p className="text-xs text-gray-600">{t('landing.installInstructions')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop - show install button
  if (isInstallable) {
    return (
      <button
        onClick={promptInstall}
        className="w-full bg-throne-red text-white p-4 font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {t('landing.installApp')}
      </button>
    );
  }

  return null;
};

export default InstallPrompt;
