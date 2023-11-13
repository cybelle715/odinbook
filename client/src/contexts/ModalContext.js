import { createContext } from "react";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";

const ModalContext = createContext();

let ModalProvider = ({ children }) => {
  const { handleModal, modalContent } = useModal();
  
  return (
  <ModalContext.Provider value={{ handleModal, modalContent }}>
    <Modal />
    { children }
  </ModalContext.Provider>
  );
}

export { ModalContext, ModalProvider };