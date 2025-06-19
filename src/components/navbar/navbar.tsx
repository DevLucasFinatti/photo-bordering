import { useState } from 'react';
import './navbar.scss';

export default function Navbar() {
    return (
        <div className="navbar">
            {/* <div>
                <img className='navbar__logo' src="/photo-camera2.jpg" width={50} />
            </div> */}
            <div className='navbar__title'>Emoldure sua lembrança 😎👍</div>
        </div>
    );
}