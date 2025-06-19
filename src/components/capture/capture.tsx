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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Capture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const canvasWidth = 900;
  const canvasHeight = 1600;

  // Marca que já montou no cliente para evitar hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleImageLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setApproved(false);
        setShowQRCode(false);
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

      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

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
    if (!hasMounted) return;
    drawCanvas();
  }, [image, selectedFrame, hasMounted]);

  function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  const uploadCanvasImage = async () => {
    if (!canvasRef.current) return;

    setIsUploading(true);

    const dataUrl = canvasRef.current.toDataURL('image/png');
    const blob = dataURLtoBlob(dataUrl);
    if (!blob) {
      alert('Erro ao converter imagem.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', blob, 'framed-image.png');

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erro no upload');

      const json = await res.json();

      if (json.url) {
        setImageURL(json.url);
        setShowQRCode(true);
      } else {
        alert('Resposta inválida do servidor');
      }
    } catch (error) {
      alert('Erro no upload: ' + error);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setSelectedFrame(null);
    setApproved(false);
    setShowQRCode(false);
    setImageURL(null);
    setIsUploading(false);
  };

  if (!hasMounted) {
    return null;
  }

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

          {!approved ? (
            <div className="approval-buttons">
              <button className="approve-button" onClick={() => setApproved(true)}>
                Aprovar imagem
              </button>
              <button className="reject-button" onClick={() => setImage(null)}>
                Rejeitar imagem
              </button>
            </div>
          ) : (
            <button className="download-button" onClick={uploadCanvasImage} disabled={isUploading}>
              {isUploading ? 'Enviando...' : 'Upload & Gerar QR Code'}
            </button>
          )}
        </>
      )}

      {showQRCode && imageURL && (
        <div className="qrcode-section">
          <h2>Scan the QR code to download your image</h2>
          <QRCodeCanvas value={imageURL} size={256} />
          <p>
            Ou acesse diretamente:{' '}
            <a href={imageURL} target="_blank" rel="noopener noreferrer">
              Imagem Editada
            </a>
          </p>

          <button onClick={reset} style={{ marginTop: '1rem' }}>
            Voltar ao Início
          </button>
        </div>
      )}
    </div>
  );
}
