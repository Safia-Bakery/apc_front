import { Modal, ModalProps } from "antd";

const AntModal = ({ ...props }: ModalProps) => {
  return <Modal {...props} />;
};

export default AntModal;
