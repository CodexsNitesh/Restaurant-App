const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1f1710] border border-amber-200/30 rounded-2xl shadow-luxury w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200/20">
          <h3 className="font-bold text-amber-100">{title}</h3>
          <button onClick={onClose} className="text-amber-200 hover:text-amber-100 text-xl">✕</button>
        </div>
        <div className="p-6 text-amber-100">{children}</div>
      </div>
    </div>
  );
};

export default Modal;