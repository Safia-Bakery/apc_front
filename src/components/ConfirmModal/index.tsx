import { FC } from "react";
import Modal from "../Modal";
import Card from "../Card";
import { useTranslation } from "react-i18next";

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
  confirmLabel,
  rejectLabel,
  onConfirm,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
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
            {rejectLabel || t("calcel")}
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            {confirmLabel || t("yes")}
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
