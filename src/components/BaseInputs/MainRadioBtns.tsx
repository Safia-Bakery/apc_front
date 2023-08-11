import cl from "classnames";
import styles from "./index.module.scss";
import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { StatusName } from "src/utils/helpers";

interface Props {
  onChange?: (val: boolean) => void;
  className?: string;
  value?: boolean;
  disabled?: boolean;
  values: typeof StatusName;
  register?: UseFormRegisterReturn;
  checked?: number;
}

const MainRadioBtns: FC<Props> = ({ values, value, onChange }) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newActive = event.target.value == "1";
    onChange?.(newActive);
  };

  return (
    <div className={cl(styles.formControl, "form-control")}>
      {values.map((item) => (
        <label key={item.id} className={styles.radioBtn}>
          <input
            type="radio"
            value={item.id}
            name="radioGroup"
            checked={value === !!item.id}
            onChange={handleCheckboxChange}
          />
          {item.name}
        </label>
      ))}
    </div>
  );
};

export default MainRadioBtns;
