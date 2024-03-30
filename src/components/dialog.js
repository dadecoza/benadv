import './dialog.css';
import React, { useState, useEffect } from 'react';

function Dialog({ children, props }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(props.visible);
    }, [props.visible]);

    const close = () => {
        setShow(false);
        if (props.onClose) {
            props.onClose();
        }
    };

    return (
        <div id="myModal" className="modal" onClick={(show) ? close : ()=>{}} style={{ display: (show) ? "block" : "none" }}>
            <div className="modal-content">
                <p dangerouslySetInnerHTML={{__html: children}}></p>
            </div>
        </div>
    );
}
export default Dialog;
