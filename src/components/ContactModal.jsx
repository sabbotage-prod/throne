import { useState } from 'react';

const ContactModal = ({ t, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to backend/email service
    console.log('Contact form:', { name, email, message });
    setSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-sm">
        {/* Header */}
        <div className="bg-throne-black text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-wide">
            {t('contact.title').toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        <div className="p-4">
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-black text-lg mb-2">{t('contact.sent')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('contact.sentMessage')}</p>
              <button
                onClick={onClose}
                className="bg-black text-white px-6 py-2 font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                {t('common.close').toUpperCase()}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  {t('contact.name').toUpperCase()}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-black p-3 text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  {t('contact.email').toUpperCase()}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-black p-3 text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  {t('contact.message').toUpperCase()}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border-2 border-black p-3 text-sm h-24"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white p-3 font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                {t('contact.send').toUpperCase()}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
