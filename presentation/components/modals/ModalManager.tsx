import React from "react";

//Store
import { useModalStore } from "@/presentation/store/useModalStore";

//Components
import ModalNewGame from "@/presentation/components/modals/ModalNewGame";

const ModalManager = () => {
  const { viewModalNewGame } = useModalStore();
  return <>{viewModalNewGame ? <ModalNewGame /> : null}</>;
};

export default ModalManager;
