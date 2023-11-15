import { ChangeEvent, FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  value?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  label: string;
}
const MainCheckBox: FC<Props> = ({ value, register, label, ...others }) => {
  return (
    <div className="form-group flex align-center form-control">
      <label className="mb-0 mr-2">{label}</label>
      <input type="checkbox" defaultChecked={value} {...register} {...others} />
    </div>
  );
};

export default MainCheckBox;
