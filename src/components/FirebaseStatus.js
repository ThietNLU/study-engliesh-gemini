// Firebase Status Checker
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';

const FirebaseStatus = () => {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const checkFirebaseStatus = async () => {
    try {
      console.log('🔥 Checking Firebase Status...');
      
      // Check if Firebase is initialized
      if (!db) {
        setStatus('not_configured');
        setError('Firebase database not initialized');
        setDetails({
          message: 'Firebase chưa được cấu hình',
          solutions: [
            'Kiểm tra file .env có đúng thông tin Firebase không',
            'Đảm bảo tất cả REACT_APP_FIREBASE_* variables được set',
            'Restart server sau khi thay đổi .env'
          ]
        });
        return;
      }

      // Check configuration
      const config = db.app.options;
      setDetails({
        projectId: config.projectId,
        apiKey: config.apiKey ? '✅ Configured' : '❌ Missing',
        authDomain: config.authDomain,
        storageBucket: config.storageBucket,
        appId: config.appId ? '✅ Configured' : '❌ Missing'
      });

      // Check if using default values
      if (config.projectId === 'your-project-id' || 
          config.apiKey === 'your-api-key-here') {
        setStatus('using_defaults');
        setError('Đang sử dụng giá trị mẫu trong .env');
        return;
      }

      // Try to connect to Firestore
      const { collection, getDocs } = await import('firebase/firestore');
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      
      setStatus('connected');
      console.log('✅ Firebase connected successfully!');
      
    } catch (error) {
      setStatus('error');
      setError(`Connection failed: ${error.message}`);
      console.error('❌ Firebase error:', error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#10B981';
      case 'checking': return '#F59E0B';
      case 'not_configured': return '#EF4444';
      case 'using_defaults': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '✅ Firebase Connected';
      case 'checking': return '🔄 Checking...';
      case 'not_configured': return '❌ Not Configured';
      case 'using_defaults': return '⚠️ Using Default Values';
      case 'error': return '❌ Connection Failed';
      default: return '❓ Unknown';
    }
  };

  return (
    <div style={{
      margin: '20px',
      padding: '20px',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ color: getStatusColor(), margin: '0 0 15px 0' }}>
        {getStatusText()}
      </h3>
      
      {error && (
        <div style={{ color: '#EF4444', marginBottom: '15px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {details && (
        <div>
          <h4>Firebase Configuration:</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {Object.entries(details).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'not_configured' && details.solutions && (
        <div>
          <h4>Giải pháp:</h4>
          <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {details.solutions.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ol>
        </div>
      )}

      <button 
        onClick={checkFirebaseStatus}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: getStatusColor(),
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Recheck
      </button>
    </div>
  );
};

export default FirebaseStatus;
