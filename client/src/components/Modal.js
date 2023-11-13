import IconClose from  '../assets/images/close-circle.svg'
import '../styles/Modal.css';
import '../styles/Card.css';
import { ModalContext } from '../contexts/ModalContext';
import { useContext } from 'react';

const Modal = () => {
  const { handleModal, modalContent } = useContext(ModalContext);
  
  const closeModal = (e) => {
    if (e.target === e.currentTarget) handleModal();
  }
  
  if (modalContent) {
    return (
      <div id="modal-overlay" onMouseDown={closeModal}>
        <div id="modal-content" className="card">
          <input id="modal-close" className="svg" type="image" src={IconClose} onClick={closeModal} alt="Close Modal" />
          { modalContent }
        </div>
      </div>
    );
  }
  
  return null;
}

export default Modal;