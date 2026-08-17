import React from "react";

//Store
import { useModalStore } from "@/presentation/store/useModalStore";

//Components
import ModalNewGame from "@/presentation/components/modals/ModalNewGame";
import ModalDifficulty from "@/presentation/components/modals/ModalDifficulty";

const ModalManager = () => {
  const { viewModalNewGame, viewModalDifficulty } = useModalStore();

  return (
    <>
      {viewModalNewGame ? <ModalNewGame /> : null}
      {viewModalDifficulty ? <ModalDifficulty /> : null}
    </>
  );
};

export default ModalManager;
