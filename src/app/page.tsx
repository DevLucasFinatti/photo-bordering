'use client';
import { useState } from 'react';
import Navbar from '@/components/navbar/navbar';
import Captura from '@/components/capture/capture';
import './page.scss';

export default function Home() {
  const [init, setInit] = useState(false);

  const handleClick = () => {
    setInit(true);
  };

  return (
    <html>
      <body>
        <Navbar />
        {!init ? (
          <button className="start-btn" onClick={handleClick}>
            TOQUE PARA COMEÇAR
          </button>
        ) : (
          <Captura />
        )}
      </body>
    </html>
  );
}
