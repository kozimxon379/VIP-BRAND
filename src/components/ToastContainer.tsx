import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-0 sm:right-6 z-[999999] flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md w-full px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden bg-background/95 dark:bg-[#161616]/95 text-foreground  backdrop-blur-2xl border border-border/80 dark:border-border/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 sm:p-5 flex items-start gap-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
          >
            {/* Icon */}
            <div className={`p-2 rounded-xl shrink-0 ${
              isSuccess 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                : isError 
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' 
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
            }`}>
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {isError && <AlertCircle className="w-5 h-5" />}
              {!isSuccess && !isError && <Info className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-2 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 dark:bg-[#222222]  text-foreground/80 ">
                  {isSuccess ? 'VIP NOTIFICATION' : isError ? 'ERROR' : 'INFO'}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground  leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-foreground/60 hover:text-foreground dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-[#222222]  transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress Bar (countdown for toast.duration) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-[#222222] /80">
              <div
                className={`h-full ${
                  isSuccess 
                    ? 'bg-emerald-500' 
                    : isError 
                    ? 'bg-rose-500' 
                    : 'bg-background '
                }`}
                style={{
                  animation: `toastProgress ${toast.duration}ms linear forwards`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
