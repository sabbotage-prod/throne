import { Link } from 'react-router-dom';

const Terms = ({ t }) => {
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
        <h1 className="text-3xl font-black mb-2">{t('legal.terms')}</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: January 2025</p>

        <div className="prose prose-sm">
          <h2 className="text-xl font-bold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Throne ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">2. Description of Service</h2>
          <p className="mb-4">
            Throne is a community-driven platform that helps users find and rate public restrooms and toilet facilities. 
            The Service allows users to search for nearby restroom facilities, view ratings and amenity information, 
            contribute new locations and reviews, and save favorite locations.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">3. User Accounts</h2>
          <p className="mb-4">
            To access certain features, you may need to create an account. You agree to provide accurate and complete information, 
            maintain the security of your password, accept responsibility for all activities under your account, 
            and notify us immediately of any unauthorized use.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">4. User Content</h2>
          <p className="mb-4">
            By submitting content (reviews, ratings, location data), you grant us a non-exclusive, worldwide, 
            royalty-free license to use, display, and distribute your content. You represent that you own or have rights to the content.
            You agree not to submit false, misleading, or harmful content.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">5. Prohibited Content</h2>
          <p className="mb-4">
            You may not submit content that is false, inaccurate, or misleading; defamatory, obscene, or offensive; 
            infringes on intellectual property rights; contains personal information about others without consent; 
            promotes illegal activities; or contains malware or harmful code.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">6. Acceptable Use</h2>
          <p className="mb-4">
            You agree not to use the Service for any illegal purpose, attempt to gain unauthorized access to the Service, 
            interfere with or disrupt the Service, scrape or collect data without permission, create fake accounts, 
            or harass other users.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">7. Disclaimers</h2>
          <p className="mb-4">
            Location information, hours, and amenities are provided by users and may not be accurate. 
            We do not guarantee the availability, cleanliness, or safety of any listed facility. 
            Always verify information before relying on it.
          </p>
          <p className="mb-4 font-bold">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">8. Limitation of Liability</h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THRONE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">9. Changes to Terms</h2>
          <p className="mb-4">
            We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-xl font-bold mt-6 mb-3">10. Contact</h2>
          <p className="mb-4">
            For questions about these Terms of Service, contact us at: legal@throne.app
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-8">{t('legal.copyright')}</p>
      </div>
    </div>
  );
};

export default Terms;
