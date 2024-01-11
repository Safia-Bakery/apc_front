import { FC } from "react";
import Modal from "../Modal";
import Card from "../Card";

interface Props {
  title: string;
  confirmLabel?: string;
  rejectLabel?: string;
  onConfirm: () => void;
  isOpen: boolean;
  onClose: (arg: boolean) => void;
}

const ConfirmModal: FC<Props> = ({
  title,
  confirmLabel = "Да",
  rejectLabel = "Отменить",
  onConfirm,
  isOpen,
  onClose,
}) => {
  const handleReject = () => {
    onClose(false);
    return;
  };

  const handleConfirm = () => {
    onClose(!isOpen);
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(!isOpen)}>
      <Card>
        <h3>{title}</h3>
        <div>
          <button className="btn-danger" onClick={handleReject}>
            {rejectLabel}
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            {confirmLabel}
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
