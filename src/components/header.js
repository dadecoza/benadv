import './header.css';
import Dialog from './dialog';
import React, { useState } from 'react';

function Header({ props }) {
    const [show, setShow] = useState(false);
    const chapter = (() => {
        const roomId = props.gameData.roomId;
        switch (roomId) {
            case 1:
                return "Adventure Island";
            case 2:
            case 3:
            case 37:
                return "The Beach";
            case 4:
            case 5:
            case 6:
            case 7:
            case 9:
            case 10:
                return "The Jungle";
            case 11:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
                return "Abandoned Mine";
            case 34:
            case 35:
            case 36:
            case 12:
            case 13:
            case 14:
                return "Volcano";
            case 15:
            case 16:
            case 17:
            case 18:
            case 26:
            case 27:
            case 28:
                return "Under the wall";
            case 8:
            case 19:
            case 20:
                return "The Wall";
            case 21:
                return "Whale Corpse";
            case 22:
            case 23:
            case 24:
            case 25:
                return "The Hut";
            case 38:
                return "The End";
            default:
                return "Somewhere on the Island";
        }
    })();
    const about = `
    ADVENTURE ISLAND REBIRTH: RISE OF DAWN<br/><br/>
    Original Atari 800 Version by Ben Heck (1988-2024)<br/></br>
    Crudely Ported to JavaScript by Johannes le Roux (2024)<br/></br>
    <a href="https://github.com/dadecoza/benadv" target="_blank">GitHub</a>
    `;
    const close = () => {
        setShow(false);
    };
    return (
        <div className="Header">
            <div>{chapter}</div>
            <div className="About" onClick={() => { setShow(true) }}>?</div>
            <Dialog props={{ visible: show, onClose: close }}>{about}</Dialog>
        </div>
    )
}
export default Header;