import { ChangeEvent, FC, ReactNode } from "react";
import cl from "classnames";
import styles from "./index.module.scss";

interface Props {
  onChange?: (val: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  value?: string;
  disabled?: boolean;
  register?: Object;
  values?: { id: number | string; name: string; status?: number }[];
  children?: ReactNode;
}

const MainSelect: FC<Props> = ({
  className,
  register,
  values,
  children,
  ...others
}) => {
  return (
    <select
      className={cl("form-select", styles.select)}
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
