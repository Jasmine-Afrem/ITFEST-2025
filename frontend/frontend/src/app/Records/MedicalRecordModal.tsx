import { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  position: absolute;
`;

const Button = styled(motion.button)`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const OrangeButton = styled(Button)`
  background-color: orange;
`;

const BlueButton = styled(Button)`
  background-color: blue;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;

export default function PatientModalUI() {
  const [showButtons, setShowButtons] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <Container>
      <button onClick={() => setShowButtons(!showButtons)}>Selectează pacient</button>
      {showButtons && (
        <ButtonsContainer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeIn", duration: 0.3 }}
        >
          <OrangeButton onClick={() => setShowModal(true)}>Adaugă fișă</OrangeButton>
          <BlueButton>Modifică fișă</BlueButton>
        </ButtonsContainer>
      )}
      {showModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Adaugă Fișă Medicală</h2>
            <p>Completează informațiile pacientului.</p>
            <button onClick={() => setShowModal(false)}>Închide</button>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
