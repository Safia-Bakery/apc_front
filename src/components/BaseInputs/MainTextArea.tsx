import { ChangeEvent, FC } from "react";
import cl from "classnames";
import styles from "./index.module.scss";
interface Props {
  onChange?: (val: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  value?: string;
  placeholder?: string | null;
  disabled?: boolean;
  register?: Object;
}

const MainTextArea: FC<Props> = ({
  className,
  placeholder = "Комментарии",
  register,
  ...others
}) => {
  return (
    <textarea
      className={cl(className, "form-control mb-2 h-100", styles.textArea)}
      rows={4}
      placeholder={placeholder || ""}
      {...register}
      {...others}
    />
  );
};

export default MainTextArea;
