import { FC } from "react";
import star from "/icons/fullStar.svg";
import emptyStar from "/icons/emptyStar.svg";
import cl from "classnames";

interface Props {
  editable?: boolean;
  onChange?: (arg: number) => void;
  value: number;
  className?: string;
}
const maxRate = 5;

const RateStars: FC<Props> = ({ onChange, value, className }) => {
  const handleStars = (index: number) => () => onChange?.(index + 1);

  return (
    <div className={cl(className, "flex justify-evenly flex-1")}>
      {[...Array(maxRate)].map((_, idx) => {
        return (
          <img
            height={60}
            width={60}
            key={idx}
            src={idx < Math.round(value) ? star : emptyStar}
            onClick={handleStars(idx)}
            alt="rate-star"
          />
        );
      })}
    </div>
  );
};

export default RateStars;
