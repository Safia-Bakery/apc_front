import { ChangeEvent, FC } from "react";
import styles from "./index.module.scss";
import cl from "classnames";

interface Props {
  onChange?: (val: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  value: { id: number; name: string; status?: number }[];
  disabled?: boolean;
  label?: string;
  register?: Object;
  blockClass?: string;
  isMulti?: boolean;
}

const BaseSelect: FC<Props> = ({
  className,
  value,
  onChange,
  disabled = false,
  label,
  register,
  blockClass,
}) => {
  return (
    <div className={cl("form-group", blockClass)}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        defaultValue={"Select Item"}
        disabled={disabled}
        onChange={onChange}
        {...register}
        className={cl(className, "form-select")}
      >
        {value?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BaseSelect;
