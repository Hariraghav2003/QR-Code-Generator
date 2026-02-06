import './QRPreview.css';

function QRPreview({ qrImage, isGenerating, onDownload, onReset }) {
  return (
    <div className="qr-preview">
      <div className="preview-header">
        <h2 className="preview-title">Your QR Code</h2>
        <p className="preview-description">
          {qrImage ? 'Ready to download' : 'Generate to preview'}
        </p>
      </div>

      <div className="preview-container">
        {isGenerating ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Generating your QR code...</p>
          </div>
        ) : qrImage ? (
          <div className="preview-content">
            <div className="qr-image-wrapper">
              <img 
                src={qrImage} 
                alt="Generated QR Code" 
                className="qr-image"
              />
              <div className="qr-glow"></div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="download-button"
                onClick={onDownload}
              >
                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download QR Code</span>
              </button>

              <button 
                className="reset-button"
                onClick={onReset}
              >
                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Generate New</span>
              </button>
            </div>

            <div className="usage-tips">
              <h3 className="tips-title">Usage Tips</h3>
              <ul className="tips-list">
                <li>Test your QR code with multiple scanner apps</li>
                <li>Ensure sufficient contrast when printing</li>
                <li>Maintain minimum size of 2cm x 2cm</li>
                <li>Keep the QR code in a safe, clean area</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 100 100" fill="none">
              <rect x="10" y="10" width="25" height="25" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <rect x="65" y="10" width="25" height="25" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <rect x="10" y="65" width="25" height="25" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <circle cx="77.5" cy="77.5" r="12.5" stroke="currentColor" strokeWidth="3" opacity="0.5"/>
              <rect x="15" y="15" width="10" height="10" fill="currentColor" opacity="0.4"/>
              <rect x="70" y="15" width="10" height="10" fill="currentColor" opacity="0.4"/>
              <rect x="15" y="70" width="10" height="10" fill="currentColor" opacity="0.4"/>
            </svg>
            <h3 className="empty-title">No QR Code Yet</h3>
            <p className="empty-text">
              Fill out the form and click generate to create your QR code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRPreview;