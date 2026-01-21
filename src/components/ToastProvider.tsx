import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#1e1e1e',
          color: '#fff',
          border: '1px solid #333',
        },
      }}
    />
  );
}