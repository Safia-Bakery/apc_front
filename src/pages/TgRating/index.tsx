import { useParams } from "react-router-dom";
import Header from "src/components/Header";
import { useRemoveParams } from "src/hooks/custom/useCustomNavigate";

const TgRating = () => {
  const { id } = useParams();
  const removeParams = useRemoveParams();
  return (
    <div className="absolute inset-0 bg-mainGray flex flex-col">
      <Header title={`Заказ №${id}`} subTitle={`Статус: `}>
        <div
          onClick={() => removeParams(["modal"])}
          className="rounded-full !border !border-black h-9 w-9 flex items-center justify-center"
        >
          <span aria-hidden="true" className="text-3xl font-thin">
            &times;
          </span>
        </div>
      </Header>

      <div className="flex flex-1">
        <div className="flex justify-evenly">
          <div className="">
            <img
              src="/assets/emptyStar.svg"
              alt="empty-star"
              height={64}
              width={64}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TgRating;
