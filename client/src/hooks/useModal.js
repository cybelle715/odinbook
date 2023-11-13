import { useState } from "react";

const useModal = () => {
  const [modalContent, setModalContent] = useState(null);
  
  const handleModal = (content = null) => {
    setModalContent(content);
  }
  
  return { handleModal, modalContent };
}

export default useModal;