import Toast from './Toast.jsx';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;