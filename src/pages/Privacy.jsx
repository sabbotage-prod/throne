import { Link } from 'react-router-dom';

const Privacy = ({ t }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-xl font-black">Throne</span>
          <span className="text-throne-red text-xl font-black">/</span>
        </Link>
        <Link to="/" className="text-sm font-bold hover:underline">
          ← Back
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-black mb-2">{t('legal.privacy')}</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: January 2025</p>

        <div className="prose prose-sm">
          <h2 className="text-xl font-bold mt-6 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Throne ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and protect your information when you use our restroom finder service.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">2. Information We Collect</h2>
          
          <h3 className="text-lg font-bold mt-4 mb-2">2.1 Information You Provide</h3>
          <p className="mb-4">
            Account Information: Email address, name, and password when you create an account.
            User Content: Reviews, ratings, and location submissions you contribute.
            Contact Information: Information you provide when contacting us.
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">2.2 Information Collected Automatically</h3>
          <p className="mb-4">
            Location Data: Your geographic location (only when you grant permission) to show nearby facilities.
            Device Information: Device type, operating system, browser type.
            Usage Data: Pages visited, features used, time spent on the Service.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to provide and improve the Service, show nearby restroom facilities, 
            display user-generated content, communicate with you about the Service, ensure security and prevent fraud, 
            comply with legal obligations, and analyze usage patterns.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">4. How We Share Your Information</h2>
          <p className="mb-4">
            Your reviews, ratings, and contributed locations are publicly visible. Your display name may be shown with your contributions.
            We may share data with third-party service providers who help us operate the Service.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">5. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your data, including encryption of data in transit (HTTPS), 
            secure database storage, regular security assessments, and access controls for personnel.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">6. Your Rights</h2>
          <p className="mb-4">
            You can access and update your account information at any time through the app.
            You can request deletion of your account and associated data by contacting us.
            You can disable location services in your device settings.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">7. Contact Us</h2>
          <p className="mb-4">
            For questions about this Privacy Policy or to exercise your rights, contact us at: privacy@throne.app
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-8">{t('legal.copyright')}</p>
      </div>
    </div>
  );
};

export default Privacy;
