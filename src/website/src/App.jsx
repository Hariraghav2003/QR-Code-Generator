import { useState } from "react";
import QRForm from "./components/QRForm";
import QRPreview from "./components/QRPreview";
import Toast from "./components/Toast";
import "./App.css";
import { getServiceToken } from "./utils/Token";

function App() {
  const [qrImage, setQrImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000,
    );
  };

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    setQrImage(null);

    try {
      const apiEndpoint = `${import.meta.env.VITE_QR_API_ENDPOINT}/generateqr`;

      if (!apiEndpoint) {
        throw new Error(
          "API endpoint not configured. Please set VITE_QR_API_ENDPOINT in .env file",
        );
      }
      const token = await getServiceToken();
      // For APIs that support logos and require POST with FormData:
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("QR generation failed");
      }

      setQrImage(data.url);

      showToast("QR Code generated successfully!", "success");
    } catch (error) {
      showToast(
        error.message || "Failed to generate QR code. Please try again.",
        "error",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!qrImage) return;

    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${Date.now()}.svg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      showToast("QR Code downloaded successfully!", "success");
    } catch (error) {
      showToast("Failed to download QR Code", "error");
    }
  };

  const handleReset = () => {
    setQrImage(null);
  };

  return (
    <div className="app">
      <div className="background-pattern"></div>
      <div className="container">
        <header className="header">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="12" height="12" fill="currentColor" />
              <rect x="2" y="26" width="12" height="12" fill="currentColor" />
              <rect x="26" y="2" width="12" height="12" fill="currentColor" />
              <rect x="18" y="18" width="8" height="8" fill="currentColor" />
              <rect x="6" y="6" width="4" height="4" fill="#fff" />
              <rect x="6" y="30" width="4" height="4" fill="#fff" />
              <rect x="30" y="6" width="4" height="4" fill="#fff" />
            </svg>
            <h1 className="title">QR Studio</h1>
          </div>
          <p className="subtitle">Transform your links into scannable art</p>
        </header>

        <main className="main-content">
          <div className="content-grid">
            <div className="form-section">
              <QRForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            </div>

            <div className="preview-section">
              <QRPreview
                qrImage={qrImage}
                isGenerating={isGenerating}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>
            © {new Date().getFullYear()} Hariraghav. Developed & Maintained by
            Hariraghav.
          </p>
        </footer>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
