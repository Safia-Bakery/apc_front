import { FC, ReactNode, useEffect } from "react";
import clx from "classnames";
import styles from "./index.module.scss";

interface Props {
  isOpen: boolean;
  centered?: boolean;
  onClose?: () => void;
  className?: string;
  children: ReactNode;
}

const Modal: FC<Props> = ({
  isOpen,
  onClose = () => null,
  centered = true,
  children,
  className,
}) => {
  useEffect(() => {
    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscapePressed);
    return () => window.removeEventListener("keydown", closeOnEscapePressed);
  }, []);

  return (
    <>
      <div
        className={clx(styles.overlay, { [styles.closed]: !isOpen })}
        onClick={onClose}
      />
      {isOpen && (
        <div
          className={clx(
            className,
            { [styles.centered]: centered },
            styles.modal,
            [isOpen ? styles.fadeIn : styles.fadeOut]
          )}
        >
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
