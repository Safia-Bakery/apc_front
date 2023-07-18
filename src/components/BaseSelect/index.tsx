import { ChangeEvent, FC } from "react";
import styles from "./index.module.scss";
import cl from "classnames";

interface Props {
  onChange?: (val: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  values: { id: number | string; name: string; status?: number }[];
  disabled?: boolean;
  label?: string;
  register?: Object;
  blockClass?: string;
  defaultSelected?: boolean;
  value?: number;
}

const BaseSelect: FC<Props> = ({
  className,
  values,
  onChange,
  disabled = false,
  label,
  register,
  blockClass,
  defaultSelected,
  value,
}) => {
  return (
    <div className={cl("form-group", blockClass)}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...register}
        className={cl(className, "form-select")}
      >
        {defaultSelected && <option value={""}></option>}
        {values?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BaseSelect;
