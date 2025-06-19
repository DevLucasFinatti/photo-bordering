'use client';
import { QRCodeCanvas as QR } from 'qrcode.react';

interface QRCodeCanvasProps {
    value: string;
    size?: number;
    label?: string;
}

export default function QRCodeCanvas({ value, size = 256, label }: QRCodeCanvasProps) {
    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            {label && <h2>{label}</h2>}
            <QR value={value} size={size} />
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Aponte a câmera do celular para baixar
            </p>
        </div>
    );
}
