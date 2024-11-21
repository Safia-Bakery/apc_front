import { ChangeEvent, FC, ReactNode, useRef } from "react";
import cl from "classnames";
import styles from "./index.module.scss";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
  onChange?: (val: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  values?: { id: number | string; name: string; status?: number }[];
  children?: ReactNode;
  onFocus?: () => void;
  defaultValue?: string;
}

const MainSelect: FC<Props> = ({
  className,
  register,
  values,
  children,
  onFocus,
  ...others
}) => {
  const { t } = useTranslation();
  const initialLoadRef = useRef(true);
  const handleFocus = () => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      onFocus?.();
    }
  };
  return (
    <select
      className={cl(
        className,
        "form-select form-control",
        styles.select,
        styles.inputBox
      )}
      onFocus={handleFocus}
      {...others}
      {...register}
    >
      {!children ? (
        <>
          <option value={undefined}></option>
          {values?.map((item) => (
            <option key={item.id} value={item.id}>
              {t(item.name)}
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
