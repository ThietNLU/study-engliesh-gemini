import React, { useState } from 'react';
import geminiService from '../services/geminiService';
import { useVocabulary } from '../../vocab/hooks/useVocabulary';

const VocabularyGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('idle'); // idle, calling, parsing, adding, done

  const { addWordsFromAI, vocabulary } = useVocabulary();

  const generateWithDetailedLogging = async () => {
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API key');
      return;
    }

    if (!request.trim()) {
      setError('Vui lòng nhập yêu cầu tạo từ vựng');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      setStep('calling');
      const existingWords = vocabulary.map(w => w.english.toLowerCase());

      console.log('Calling Gemini API...');

      const aiWords = await geminiService.generateVocabulary(
        request,
        existingWords,
        apiKey
      );

      setStep('parsing');
      console.log('Received AI words:', aiWords);

      if (!aiWords || aiWords.length === 0) {
        throw new Error('AI không tạo được từ vựng nào');
      }

      setStep('adding');
      console.log('Adding words to vocabulary...');

      const newWords = await addWordsFromAI(aiWords);

      setStep('done');
      setResult({
        success: true,
        wordsAdded: newWords.length,
        words: newWords,
      });

      setRequest('');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      setResult({
        success: false,
        error: err.message,
      });
    } finally {
      setLoading(false);
      setStep('idle');
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case 'calling':
        return 'Đang gọi Gemini API...';
      case 'parsing':
        return 'Đang phân tích phản hồi...';
      case 'adding':
        return 'Đang thêm từ vào vocabulary...';
      case 'done':
        return 'Hoàn thành!';
      default:
        return '';
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100'>
      <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center'>
        🤖 <span className='ml-2'>Vocabulary Generator</span>
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <label
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          API Key:
        </label>
        <input
          type='password'
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder='AIzaSy...'
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          Yêu cầu tạo từ vựng:
        </label>
        <input
          type='text'
          value={request}
          onChange={e => setRequest(e.target.value)}
          placeholder='VD: Tạo từ vựng về công nghệ, du lịch, kinh doanh...'
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={generateWithDetailedLogging}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '🔄 Generating...' : '🚀 Generate Vocabulary'}
        </button>
      </div>

      {loading && step !== 'idle' && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '4px',
            color: '#92400E',
            marginBottom: '15px',
          }}
        >
          <strong>{getStepMessage()}</strong>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '4px',
            color: '#DC2626',
            marginBottom: '15px',
          }}
        >
          <strong>❌ Error:</strong> {error}
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            <strong>💡 Troubleshooting:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>Kiểm tra API key Gemini có đúng không</li>
              <li>Kiểm tra kết nối internet</li>
              <li>Thử yêu cầu đơn giản hơn</li>
              <li>Kiểm tra console để xem chi tiết lỗi</li>
            </ul>
          </div>
        </div>
      )}

      {result && result.success && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#D1FAE5',
            border: '1px solid #10B981',
            borderRadius: '4px',
            color: '#065F46',
            marginBottom: '15px',
          }}
        >
          <strong>✅ Thành công!</strong> Đã thêm {result.wordsAdded} từ vựng
          mới.
          <div style={{ marginTop: '10px' }}>
            <strong>Các từ mới:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {result.words.slice(0, 5).map((word, index) => (
                <li key={index}>
                  <strong>{word.english}</strong> - {word.vietnamese} (
                  {word.level})
                </li>
              ))}
              {result.words.length > 5 && (
                <li>
                  <em>... và {result.words.length - 5} từ khác</em>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <div
        style={{
          padding: '15px',
          backgroundColor: '#E0F2FE',
          borderRadius: '4px',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#0369A1' }}>
          💡 Tips for better results:
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#0369A1',
            fontSize: '14px',
          }}
        >
          <li>
            Sử dụng yêu cầu cụ thể: "từ vựng về công nghệ AI", "động từ liên
            quan đến nấu ăn"
          </li>
          <li>Tránh yêu cầu quá phức tạp trong một lần</li>
          <li>Nếu gặp lỗi JSON, thử lại hoặc sử dụng JSON Debugger</li>
          <li>Kiểm tra console browser để xem log chi tiết</li>
        </ul>
      </div>
    </div>
  );
};

export default VocabularyGenerator;
