import { FC } from "react";
import DatePicker from "react-datepicker";
import cl from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";

interface Props {
  onChange?: any;
  className?: string;
  value?: string;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  selected?: Date | null | undefined;
  filter?: boolean;
}

const MainDatePicker: FC<Props> = ({
  className,
  selected,
  register,
  onChange,
}) => {
  const handleClear = () => onChange(undefined);

  return (
    <div className="position-relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        wrapperClassName="form-group m-2"
        className={cl("form-control", className)}
        {...register}
      />

      {!!selected && (
        <img
          onClick={handleClear}
          src="/assets/icons/clear.svg"
          alt="clear"
          width={15}
          height={15}
          className={styles.close}
        />
      )}
    </div>
  );
};

export default MainDatePicker;
