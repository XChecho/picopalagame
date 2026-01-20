import React from "react";

//Store
import { useModalStore } from "@/src/store/useModalStore";

//Components
import ModalNewGame from "@/src/components/modals/ModalNewGame";

const ModalManager = () => {
  const { viewModalNewGame } = useModalStore();
  return <>{viewModalNewGame ? <ModalNewGame /> : null}</>;
};

export default ModalManager;
