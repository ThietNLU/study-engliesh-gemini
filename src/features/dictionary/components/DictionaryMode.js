import React, { useState } from 'react';
import { Search, Book, Loader2 } from 'lucide-react';
import geminiService from '../../ai/services/geminiService';

const DictionaryMode = ({ apiKey, showNotification }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('sample'); // default to sample view

  const handleLookup = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await geminiService.lookupDictionary(query, apiKey);
      setResult(data);
      if (typeof showNotification === 'function') {
        showNotification('success', '✅ Đã tra cứu từ điển bằng AI');
      }
    } catch (err) {
      const msg = (err && err.message) || 'Tra cứu thất bại';
      setError(msg);
      if (typeof showNotification === 'function') {
        showNotification('error', `❌ ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatSample = data => {
    if (!data || !data.entries || !data.entries.length) return '';
    const lines = [];
    data.entries.forEach((entry, idx) => {
      const num = idx + 1;
      lines.push(
        `${num}. ${entry.headword || ''} (${entry.part_of_speech || ''})`
      );
      const ipaUS = entry.phonetic_us ? `US: /${entry.phonetic_us}/` : '';
      const ipaUK = entry.phonetic_uk ? `UK: /${entry.phonetic_uk}/` : '';
      const ipa = [ipaUS, ipaUK].filter(Boolean).join(' · ');
      if (ipa) lines.push(`   ${ipa}`);
      const meanings = entry.meanings || [];
      meanings.forEach((m, i) => {
        const ix = i + 1;
        lines.push(`   ${ix}) ${m.definition || ''}`);
        if (m.example) lines.push(`      Ví dụ: "${m.example}"`);
        if (m.translation_vi) lines.push(`      Dịch: ${m.translation_vi}`);
        if (m.synonyms && m.synonyms.length)
          lines.push(`      Đồng nghĩa: ${m.synonyms.join(', ')}`);
        if (m.antonyms && m.antonyms.length)
          lines.push(`      Trái nghĩa: ${m.antonyms.join(', ')}`);
      });
    });
    return lines.join('\n');
  };

  const copyToClipboard = text => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        if (typeof showNotification === 'function') {
          showNotification('success', '📋 Đã sao chép vào clipboard');
        }
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-xl p-6 sm:p-8 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
          <Book className='w-6 h-6 mr-2 text-indigo-600' /> Từ điển (AI Gemini)
        </h2>
      </div>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3'>
          <input
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Nhập từ/cụm từ tiếng Anh (ví dụ: sustainability)'
          />
          <button
            onClick={handleLookup}
            disabled={isLoading || !query.trim() || !(apiKey && apiKey.trim())}
            className='px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium flex items-center justify-center'
          >
            {isLoading ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Tra cứu...
              </>
            ) : (
              <>
                <Search className='w-4 h-4 mr-2' /> Tra cứu
              </>
            )}
          </button>
        </div>

        {!(apiKey && apiKey.trim()) && (
          <div className='p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm'>
            Vui lòng thiết lập Gemini API key ở mục AI Tạo từ để sử dụng từ
            điển.
          </div>
        )}

        {error && (
          <div className='p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
            {error}
          </div>
        )}

        {result && result.entries && result.entries.length > 0 && (
          <div className='mt-2 space-y-4'>
            <div className='flex items-center space-x-2'>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm ${view === 'structured' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setView('structured')}
              >
                Cấu trúc JSON
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm ${view === 'sample' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setView('sample')}
              >
                Theo mẫu instruction
              </button>
            </div>

            {view === 'structured' && (
              <div className='space-y-4'>
                {result.entries.map((entry, idx) => (
                  <div
                    key={idx}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <div className='flex items-baseline justify-between'>
                      <div>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {entry.headword}
                        </h3>
                        <div className='text-sm text-gray-600 space-x-3 mt-1'>
                          {entry.phonetic_us && (
                            <span>/US: {entry.phonetic_us}/</span>
                          )}
                          {entry.phonetic_uk && (
                            <span>/UK: {entry.phonetic_uk}/</span>
                          )}
                          {entry.part_of_speech && (
                            <span className='px-2 py-0.5 bg-gray-100 text-gray-700 rounded'>
                              {entry.part_of_speech}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='mt-3 space-y-3'>
                      {(entry.meanings || []).map((m, i) => (
                        <div key={i} className='text-sm text-gray-800'>
                          <p className='font-medium'>• {m.definition}</p>
                          {m.example && (
                            <p className='text-gray-600 mt-1'>
                              Ví dụ: <em>"{m.example}"</em>
                            </p>
                          )}
                          {m.translation_vi && (
                            <p className='text-gray-600 mt-1'>
                              Dịch: {m.translation_vi}
                            </p>
                          )}
                          {((m.synonyms && m.synonyms.length) || 0) > 0 && (
                            <p className='text-gray-600 mt-1'>
                              Đồng nghĩa: {m.synonyms.join(', ')}
                            </p>
                          )}
                          {((m.antonyms && m.antonyms.length) || 0) > 0 && (
                            <p className='text-gray-600 mt-1'>
                              Trái nghĩa: {m.antonyms.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'sample' && (
              <div>
                <div className='flex justify-end mb-2'>
                  <button
                    onClick={() => copyToClipboard(formatSample(result))}
                    className='px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700'
                  >
                    Sao chép
                  </button>
                </div>
                <pre className='whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800'>
                  {formatSample(result)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryMode;
