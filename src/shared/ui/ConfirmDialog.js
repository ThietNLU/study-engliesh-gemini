import React from 'react';
import { useUIStore } from '../stores/uiStore';

const ConfirmDialog = () => {
  const { showConfirmDialog, confirmDialogConfig, hideConfirm } = useUIStore();

  if (!showConfirmDialog) return null;

  const handleConfirm = () => {
    if (confirmDialogConfig.onConfirm) {
      confirmDialogConfig.onConfirm();
    }
    hideConfirm();
  };

  const handleCancel = () => {
    if (confirmDialogConfig.onCancel) {
      confirmDialogConfig.onCancel();
    }
    hideConfirm();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            {confirmDialogConfig.title || 'Xác nhận'}
          </h3>
          <p className='text-gray-600 mb-6'>
            {confirmDialogConfig.message ||
              'Bạn có chắc chắn muốn thực hiện hành động này?'}
          </p>
          <div className='flex justify-end space-x-3'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
