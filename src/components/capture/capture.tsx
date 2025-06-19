'use client';
import { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './capture.scss';

const frames = [
  '/moldura/moldura1.png',
  '/moldura/moldura2.png',
  '/moldura/moldura3.png',
  '/moldura/moldura4.png',
];

export default function Capture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const canvasWidth = 900;
  const canvasHeight = 1600;

  const handleImageLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let sx = 0,
        sy = 0,
        sWidth = img.width,
        sHeight = img.height;

      if (imgRatio > canvasRatio) {
        sWidth = img.height * canvasRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / canvasRatio;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);

      if (selectedFrame) {
        const frameImg = new Image();
        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
        };
        frameImg.src = selectedFrame;
      }
    };

    img.src = image;
  };

  useEffect(() => {
    drawCanvas();
  }, [image, selectedFrame]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setImageURL(dataUrl);
    setShowQRCode(true);
  };

  return (
    <div className="capture-container">
      {!image && !showQRCode && (
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageLoad}
            className="hidden-input"
          />
          <button onClick={() => inputRef.current?.click()}>Load Photo</button>
        </div>
      )}

      {image && !showQRCode && (
        <>
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} />
          </div>

          <div className="frames-container">
            {frames.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Frame ${index + 1}`}
                className={`frame ${selectedFrame === src ? 'selected' : ''}`}
                onClick={() => setSelectedFrame(src)}
              />
            ))}
          </div>

          <button className="download-button" onClick={downloadImage}>
            Download Framed Image
          </button>
        </>
      )}

      {showQRCode && imageURL && (
        <div className="qrcode-section">
          <h2>Scan the QR code to download your image</h2>
          <QRCodeCanvas value={imageURL} size={256} />
        </div>
      )}
    </div>
  );
}
