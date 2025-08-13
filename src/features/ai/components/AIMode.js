import React, { useState } from 'react';
import { Brain, Settings, CheckCircle } from 'lucide-react';
import { testGeminiConnection } from '../../../shared/utils/apiTest';

const AIMode = ({
  aiRequest,
  setAiRequest,
  apiKey,
  setApiKey,
  showApiSettings,
  setShowApiSettings,
  isLoading,
  generateVocabularyWithAI,
  vocabulary,
}) => {
  const [testingApi, setTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  const handleTestApi = async () => {
    setTestingApi(true);
    setApiStatus(null);

    try {
      await testGeminiConnection(apiKey);
      setApiStatus({ success: true, message: '✅ API kết nối thành công!' });
    } catch (error) {
      setApiStatus({ success: false, message: `❌ ${error.message}` });
    } finally {
      setTestingApi(false);
    }
  };
  return (
    <div className='bg-white rounded-xl shadow-xl p-8 mb-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>
          🤖 AI Tạo từ vựng với Gemini
        </h2>
        <button
          onClick={() => setShowApiSettings(!showApiSettings)}
          className='text-indigo-600 hover:text-indigo-800 flex items-center'
        >
          <Settings className='w-4 h-4 mr-1' />
          Cài đặt API
        </button>
      </div>{' '}
      {/* API Settings */}
      {showApiSettings && (
        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Gemini API Key
          </label>
          <div className='flex space-x-2'>
            <input
              type='password'
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Nhập API Key từ Google AI Studio'
            />
            <button
              onClick={handleTestApi}
              disabled={testingApi || !apiKey.trim()}
              className='px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-all flex items-center'
            >
              {testingApi ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              ) : (
                <CheckCircle className='w-4 h-4' />
              )}
              <span className='ml-1'>
                {testingApi ? 'Đang test...' : 'Test API'}
              </span>
            </button>
          </div>

          {apiStatus && (
            <div
              className={`mt-2 p-2 rounded text-sm ${
                apiStatus.success
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {apiStatus.message}
            </div>
          )}

          <p className='text-xs text-gray-600 mt-2'>
            Lấy API key miễn phí tại:
            <a
              href='https://aistudio.google.com/app/apikey'
              target='_blank'
              rel='noopener noreferrer'
              className='text-indigo-600 hover:underline ml-1'
            >
              Google AI Studio
            </a>
          </p>
        </div>
      )}
      {/* AI Request Form */}
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Yêu cầu tạo từ vựng
          </label>
          <textarea
            value={aiRequest}
            onChange={e => setAiRequest(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            rows={4}
            placeholder="Ví dụ: 'Tạo từ vựng về môi trường cùng level với từ greenwash' hoặc 'Từ vựng về công nghệ AI level trung cấp'"
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-4 bg-blue-50 rounded-lg'>
            <h4 className='font-semibold text-blue-800 mb-2'>
              💡 Gợi ý yêu cầu:
            </h4>
            <ul className='text-sm text-blue-700 space-y-1'>
              <li>• "Từ vựng về kinh doanh level B2-C1"</li>
              <li>• "Từ academic writing cho IELTS"</li>
              <li>• "Phrasal verbs thông dụng"</li>
              <li>• "Từ vựng khoa học level advanced"</li>
            </ul>
          </div>

          <div className='p-4 bg-green-50 rounded-lg'>
            <h4 className='font-semibold text-green-800 mb-2'>
              📊 Thống kê hiện tại:
            </h4>
            <ul className='text-sm text-green-700 space-y-1'>
              <li>• Tổng từ vựng: {vocabulary.length}</li>
              <li>
                • Cơ bản:{' '}
                {vocabulary.filter(w => w.level === 'beginner').length}
              </li>
              <li>
                • Trung cấp:{' '}
                {vocabulary.filter(w => w.level === 'intermediate').length}
              </li>
              <li>
                • Nâng cao:{' '}
                {vocabulary.filter(w => w.level === 'advanced').length}
              </li>
            </ul>
          </div>
        </div>

        <div className='flex justify-center'>
          <button
            onClick={generateVocabularyWithAI}
            disabled={isLoading || !aiRequest.trim()}
            className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg transition-all flex items-center text-lg font-medium'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                Đang tạo từ vựng...
              </>
            ) : (
              <>
                <Brain className='w-5 h-5 mr-2' />
                Tạo từ vựng với AI
              </>
            )}
          </button>
        </div>

        {isLoading && (
          <div className='text-center text-gray-600'>
            <p>AI đang phân tích yêu cầu và tạo từ vựng phù hợp...</p>
            <p className='text-sm mt-1'>Quá trình này có thể mất 10-30 giây</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMode;
