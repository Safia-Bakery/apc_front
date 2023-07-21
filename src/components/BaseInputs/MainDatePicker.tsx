import { FC } from "react";
import DatePicker from "react-datepicker";
import cl from "classnames";

interface Props {
  onChange?: any;
  className?: string;
  value?: string;
  disabled?: boolean;
  register?: Object;
  selected?: Date | null | undefined;
}

const MainDatePicker: FC<Props> = ({
  className,
  selected,
  register,
  onChange,
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      wrapperClassName="form-group m-2"
      className={cl("form-control", className)}
      {...register}
    />
  );
};

export default MainDatePicker;
