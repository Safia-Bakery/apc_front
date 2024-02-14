import { ChangeEvent, FC, ReactNode } from "react";
import cl from "classnames";
import styles from "./index.module.scss";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  onChange?: (val: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  values?: { id: number | string; name: string; status?: number }[];
  children?: ReactNode;
  onFocus?: () => void;
}

const MainSelect: FC<Props> = ({
  className,
  register,
  values,
  children,
  onFocus,
  ...others
}) => {
  return (
    <select
      className={cl(
        className,
        "form-select form-control",
        styles.select,
        styles.inputBox
      )}
      onFocus={onFocus}
      {...others}
      {...register}
    >
      {!children ? (
        <>
          <option value={undefined}></option>
          {values?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </>
      ) : (
        children
      )}
    </select>
  );
};

export default MainSelect;
