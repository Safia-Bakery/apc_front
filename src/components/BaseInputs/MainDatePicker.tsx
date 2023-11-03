import { FC } from "react";
import DatePicker from "react-datepicker";
import cl from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";

interface Props {
  onChange?: any;
  className?: string;
  wrapperClassName?: string;
  value?: string;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  selected?: Date | null | undefined;
  filter?: boolean;
  showTimeSelect?: boolean;
}

const MainDatePicker: FC<Props> = ({
  className,
  selected,
  register,
  onChange,
  wrapperClassName,
  showTimeSelect,
}) => {
  const handleClear = () => onChange(undefined);

  return (
    <div className="position-relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        timeCaption="Time"
        dateFormat="MM.d.yyyy h:mm aa"
        timeIntervals={30}
        showTimeSelect={showTimeSelect}
        wrapperClassName={cl(
          "form-group w-100 mb-0",
          styles.inputBox,
          wrapperClassName
        )}
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
