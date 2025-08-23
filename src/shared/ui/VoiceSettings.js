import React, { useState, useEffect } from 'react';
import { Volume2, Settings, Check } from 'lucide-react';

const VoiceSettings = ({ isOpen, onClose, currentVoice, onVoiceChange }) => {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();

      // Lọc các giọng tiếng Anh
      const englishVoices = availableVoices.filter(
        voice =>
          voice.lang.startsWith('en-') &&
          (voice.lang.includes('US') ||
            voice.lang.includes('GB') ||
            voice.lang.includes('AU') ||
            voice.lang.includes('CA') ||
            voice.lang === 'en-US' ||
            voice.lang === 'en-GB')
      );

      // Nhóm theo quốc gia
      const groupedVoices = englishVoices.reduce((acc, voice) => {
        let country = 'Other';
        if (voice.lang.includes('US') || voice.lang === 'en-US') {
          country = 'US';
        } else if (voice.lang.includes('GB') || voice.lang === 'en-GB') {
          country = 'UK';
        } else if (voice.lang.includes('AU')) {
          country = 'Australia';
        } else if (voice.lang.includes('CA')) {
          country = 'Canada';
        }

        if (!acc[country]) acc[country] = [];
        acc[country].push({
          ...voice,
          id: `${voice.name}-${voice.lang}`,
          displayName: `${voice.name} (${voice.lang})`,
          gender:
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman')
              ? 'Female'
              : voice.name.toLowerCase().includes('male') ||
                  voice.name.toLowerCase().includes('man')
                ? 'Male'
                : 'Unknown',
          // Keep reference to original voice object
          originalVoice: voice,
        });
        return acc;
      }, {});

      setVoices(groupedVoices);
      setLoading(false);
    };

    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () =>
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }
  }, []);

  const testVoice = voiceObj => {
    const utterance = new SpeechSynthesisUtterance(
      'Hello, this is a test of this voice.'
    );
    utterance.voice = voiceObj.originalVoice || voiceObj;
    utterance.rate = 0.8;
    speechSynthesis.cancel(); // Dừng giọng đọc hiện tại
    speechSynthesis.speak(utterance);
  };

  const handleVoiceSelect = voiceObj => {
    // Pass the original voice object to the parent
    onVoiceChange(voiceObj.originalVoice || voiceObj);
    testVoice(voiceObj);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Settings className='w-6 h-6 text-indigo-600' />
              <h2 className='text-xl font-bold text-gray-900'>
                Cài đặt giọng đọc
              </h2>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-2xl font-bold'
            >
              ×
            </button>
          </div>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(80vh-120px)]'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
              <span className='ml-3 text-gray-600'>Đang tải giọng đọc...</span>
            </div>
          ) : Object.keys(voices).length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              Không tìm thấy giọng đọc tiếng Anh nào.
            </div>
          ) : (
            <div className='space-y-6'>
              {Object.entries(voices).map(([country, countryVoices]) => (
                <div key={country} className='space-y-3'>
                  <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
                    <span className='text-2xl mr-2'>
                      {country === 'US'
                        ? '🇺🇸'
                        : country === 'UK'
                          ? '🇬🇧'
                          : country === 'Australia'
                            ? '🇦🇺'
                            : country === 'Canada'
                              ? '🇨🇦'
                              : '🌍'}
                    </span>
                    {country === 'US'
                      ? 'United States'
                      : country === 'UK'
                        ? 'United Kingdom'
                        : country}
                  </h3>

                  <div className='grid gap-3'>
                    {countryVoices.map(voice => (
                      <div
                        key={voice.id}
                        role='button'
                        tabIndex={0}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          currentVoice &&
                          currentVoice.name === voice.name &&
                          currentVoice.lang === voice.lang
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleVoiceSelect(voice)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleVoiceSelect(voice);
                          }
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-3'>
                              <div className='flex-1'>
                                <h4 className='font-medium text-gray-900'>
                                  {voice.name}
                                </h4>
                                <p className='text-sm text-gray-500'>
                                  {voice.lang} • {voice.gender}
                                  {voice.localService
                                    ? ' • Local'
                                    : ' • Network'}
                                </p>
                              </div>
                              {currentVoice &&
                                currentVoice.name === voice.name &&
                                currentVoice.lang === voice.lang && (
                                  <Check className='w-5 h-5 text-indigo-600' />
                                )}
                            </div>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              testVoice(voice);
                            }}
                            className='ml-3 p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                          >
                            <Volume2 className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='p-6 border-t border-gray-200 bg-gray-50'>
          <div className='flex justify-end space-x-3'>
            <button
              onClick={onClose}
              className='px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium'
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;
