import React from 'react'
import { createPortal } from 'react-dom';
import ReactDOM from 'react-dom/client';
import '../css/Modal.css'

// Es posible usar una herramienta de React llamada "Portal", para enviar componentes a un nodo distinto al nodo "root"
// En este caso, se usará el portal para renderizar componentes en el nodo "modal"
function Modal({ children }) {
    return createPortal(
        <div className='ModalBackground'>
            {children}
        </div>,
        document.getElementById('modal')
    )
}

export { Modal }