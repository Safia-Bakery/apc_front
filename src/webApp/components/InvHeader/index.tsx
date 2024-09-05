import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  rightChild?: ReactNode;
  goBack?: boolean;
};

const InvHeader = ({ title, rightChild, goBack }: Props) => {
  const navigate = useNavigate();
  return (
    <header className="py-4 px-3 flex items-center justify-between w-full bg-invHeader">
      {goBack ? (
        <button onClick={() => navigate(-1)}>
          <img
            src="/icons/arrow.svg"
            className="-rotate-90"
            alt="go-back"
            height={24}
            width={24}
          />
        </button>
      ) : (
        <div />
      )}

      <h4 className="text-center m-auto text-white font-normal text-xl">
        {title}
      </h4>

      <div className="max-h-7 max-w-7 h-full w-full">{rightChild}</div>
    </header>
  );
};

export default InvHeader;
