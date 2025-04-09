import React from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';

const ConfirmationModal = ({ open, onClose, onConfirm, title, message, confirmText, cancelText }) => {
  return (
    <Modal
      size="mini"
      open={open}
      onClose={onClose}
      className="!bg-white !rounded-2xl !shadow-xl !overflow-hidden max-w-[90vw] w-[400px] mx-auto"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${confirmText === 'Block' ? 'bg-red-50' : 'bg-green-50'}`}>
            <Icon 
              name={confirmText === 'Block' ? 'lock' : 'unlock'} 
              className={`text-2xl ${confirmText === 'Block' ? 'text-red-600' : 'text-green-600'}`} 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end mt-8">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium text-sm sm:text-base"
          >
            {cancelText || 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all duration-200
              ${confirmText === 'Block' 
                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-200 hover:border-red-600' 
                : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-2 border-green-200 hover:border-green-600'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name={confirmText === 'Block' ? 'lock' : 'unlock'} />
              {confirmText || 'Confirm'}
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
