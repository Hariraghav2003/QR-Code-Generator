import { useState } from "react";
import "./QRForm.css";

function QRForm({ onGenerate, isGenerating }) {
  const [qrType, setQrType] = useState("normal");
  const [inputData, setInputData] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!inputData.trim()) {
      newErrors.inputData = "Please enter a URL or text";
    } else if (inputData.startsWith("http") && !validateUrl(inputData)) {
      newErrors.inputData = "Please enter a valid URL";
    }

    if (qrType === "logo" && !logoFile) {
      newErrors.logoFile = "Please upload a logo image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("data", inputData);
    formData.append("type", qrType);

    if (qrType === "logo" && logoFile) {
      formData.append("logo", logoFile);
    }

    onGenerate(formData);
  };
  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // ✅ Allow only PNG
      if (file.type !== "image/png") {
        setErrors({ ...errors, logoFile: "Only PNG images are allowed" });
        return;
      }

      // ✅ Size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logoFile: "Logo file must be less than 5MB" });
        return;
      }

      setLogoFile(file);
      setErrors({ ...errors, logoFile: null });
    }
  };

  const handleTypeChange = (type) => {
    setQrType(type);
    if (type === "normal") {
      setLogoFile(null);
    }
  };

  return (
    <form className="qr-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">Generate QR Code</h2>
        <p className="form-description">Enter your URL or text below</p>
      </div>

      <div className="form-group">
        <label htmlFor="inputData" className="form-label">
          Content <span className="required">*</span>
        </label>
        <input
          type="text"
          id="inputData"
          className={`form-input ${errors.inputData ? "error" : ""}`}
          placeholder="https://example.com or any text"
          value={inputData}
          onChange={(e) => {
            setInputData(e.target.value);
            if (errors.inputData) {
              setErrors({ ...errors, inputData: null });
            }
          }}
          disabled={isGenerating}
        />
        {errors.inputData && (
          <span className="error-message">{errors.inputData}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">QR Code Type</label>
        <div className="type-selector">
          <button
            type="button"
            className={`type-button ${qrType === "normal" ? "active" : ""}`}
            onClick={() => handleTypeChange("normal")}
            disabled={isGenerating}
          >
            <svg
              className="type-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
            </svg>
            <span>Normal QR</span>
          </button>

          <button
            type="button"
            className={`type-button ${qrType === "logo" ? "active" : ""}`}
            onClick={() => handleTypeChange("logo")}
            disabled={isGenerating}
          >
            <svg
              className="type-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
              <circle cx="17.5" cy="17.5" r="3.5" strokeWidth="2" />
            </svg>
            <span>QR with Logo</span>
          </button>
        </div>
      </div>

      {qrType === "logo" && (
        <div className="form-group logo-upload-group">
          <label htmlFor="logoUpload" className="form-label">
            Logo Image <span className="required">*</span>
          </label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="logoUpload"
              className="file-input"
              accept="image/png"
              onChange={handleLogoChange}
              disabled={isGenerating}
            />
            <label
              htmlFor="logoUpload"
              className={`file-label ${errors.logoFile ? "error" : ""}`}
            >
              <svg
                className="upload-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>{logoFile ? logoFile.name : "Click to upload logo"}</span>
              <span className="file-hint">PNG up to 5MB</span>
            </label>
          </div>
          {errors.logoFile && (
            <span className="error-message">{errors.logoFile}</span>
          )}
        </div>
      )}

      <button type="submit" className="submit-button" disabled={isGenerating}>
        {isGenerating ? (
          <>
            <span className="spinner"></span>
            <span>Generating QR Code...</span>
          </>
        ) : (
          <>
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Generate QR Code</span>
          </>
        )}
      </button>

      <div className="info-box">
        <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        <p>
          Your QR code will be generated using an external API. Ensure your URL
          is valid and publicly accessible.
        </p>
      </div>
    </form>
  );
}

export default QRForm;
