import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Trash2,
  Database,
  Cloud,
  Smartphone,
  // AlertCircle,
  // CheckCircle,
  // RefreshCw,
} from 'lucide-react';
import storageService from '../services/storageService';

const DatabaseManager = ({ onDataCleared }) => {
  const [stats, setStats] = useState({
    vocabularyCount: 0,
    favoritesCount: 0,
    totalSizeKB: 0,
  });
  const [currentBackend, setCurrentBackend] = useState('localStorage');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadStats();
    setCurrentBackend(storageService.getBackend());
  }, []);

  const loadStats = async () => {
    try {
      const vocabulary = await storageService.vocabulary.getAll();
      const favorites = await storageService.favorites.getAll();

      setStats({
        vocabularyCount: vocabulary.length,
        favoritesCount: favorites.size,
        totalSizeKB: Math.round(
          JSON.stringify({ vocabulary, favorites: Array.from(favorites) })
            .length / 1024
        ),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.migration.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `english-vocabulary-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`✅ Đã xuất ${data.vocabulary.length} từ vựng!`);
    } catch (error) {
      alert(`❌ Lỗi xuất dữ liệu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async event => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.vocabulary && data.vocabulary.length > 0) {
        await storageService.vocabulary.addMultiple(data.vocabulary);
      }

      alert(`✅ Đã nhập ${data.vocabulary?.length || 0} từ vựng!`);
      loadStats();
      window.location.reload();
    } catch (error) {
      alert(`❌ Lỗi nhập dữ liệu: ${error.message}`);
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleClearData = () => setShowConfirm(true);

  const confirmClear = async () => {
    setIsLoading(true);
    try {
      await storageService.migration.clearAllData();
      setShowConfirm(false);
      loadStats();

      // Refresh vocabulary in parent component
      if (onDataCleared) {
        await onDataCleared();
      }

      alert('✅ Đã xóa tất cả dữ liệu!');
      // Remove the page reload as it's no longer needed
    } catch (error) {
      alert(`❌ Lỗi xóa dữ liệu: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
      <div className='flex items-center mb-6'>
        <Database className='w-6 h-6 text-indigo-600 mr-3' />
        <h2 className='text-2xl font-bold text-gray-800'>
          Quản lý cơ sở dữ liệu
        </h2>
      </div>

      {/* Storage Status */}
      <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Hệ thống lưu trữ
          </h3>
          <div className='flex items-center'>
            {currentBackend === 'firestore' ? (
              <Cloud className='w-5 h-5 text-blue-600 mr-2' />
            ) : (
              <Smartphone className='w-5 h-5 text-green-600 mr-2' />
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentBackend === 'firestore'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {currentBackend === 'firestore'
                ? 'Firestore (Cloud)'
                : 'Local Storage'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-3 gap-4 mb-6'>
        <div className='bg-blue-50 rounded-lg p-4 text-center'>
          <p className='text-blue-600 text-sm font-medium'>Từ vựng</p>
          <p className='text-2xl font-bold text-blue-800'>
            {stats.vocabularyCount}
          </p>
        </div>
        <div className='bg-yellow-50 rounded-lg p-4 text-center'>
          <p className='text-yellow-600 text-sm font-medium'>Yêu thích</p>
          <p className='text-2xl font-bold text-yellow-800'>
            {stats.favoritesCount}
          </p>
        </div>
        <div className='bg-green-50 rounded-lg p-4 text-center'>
          <p className='text-green-600 text-sm font-medium'>Dung lượng</p>
          <p className='text-2xl font-bold text-green-800'>
            {stats.totalSizeKB} KB
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className='flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium'
        >
          <Download className='w-5 h-5 mr-2' />
          {isLoading ? 'Đang xuất...' : 'Xuất dữ liệu'}
        </button>

        <label className='flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium cursor-pointer'>
          <Upload className='w-5 h-5 mr-2' />
          Nhập dữ liệu
          <input
            type='file'
            accept='.json'
            onChange={handleImport}
            disabled={isLoading}
            className='hidden'
          />
        </label>

        <button
          onClick={handleClearData}
          disabled={isLoading}
          className='flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium'
        >
          <Trash2 className='w-5 h-5 mr-2' />
          Xóa tất cả
        </button>
      </div>

      {/* Info */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <h3 className='font-semibold text-gray-800 mb-2'>
          📍 Thông tin lưu trữ
        </h3>
        <div className='text-sm text-gray-600 space-y-1'>
          <p>
            <strong>Backend:</strong>{' '}
            {currentBackend === 'firestore'
              ? 'Firebase Firestore'
              : 'Browser Local Storage'}
          </p>
          <p>
            <strong>Đồng bộ:</strong>{' '}
            {currentBackend === 'firestore'
              ? 'Tự động giữa các thiết bị'
              : 'Chỉ trên thiết bị này'}
          </p>
          {currentBackend === 'localStorage' && (
            <p>
              <strong>Keys:</strong> englishVocabulary, favorites, geminiApiKey
            </p>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 max-w-md mx-4'>
            <h3 className='text-lg font-bold text-red-600 mb-4'>
              Xác nhận xóa
            </h3>
            <p className='text-gray-700 mb-6'>
              Bạn có chắc muốn xóa TẤT CẢ dữ liệu? Hành động này không thể hoàn
              tác!
            </p>
            <div className='flex space-x-3'>
              <button
                onClick={() => setShowConfirm(false)}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium'
              >
                Hủy
              </button>
              <button
                onClick={confirmClear}
                disabled={isLoading}
                className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium'
              >
                {isLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManager;
