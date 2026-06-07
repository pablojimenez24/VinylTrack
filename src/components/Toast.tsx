import { Toaster, toast } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1A1A1A",
          color:      "#F0EDE8",
          border:     "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'Inter', sans-serif",
        },
      }}
    />
  );
}

export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);
