import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import Header from "src/components/Header";
import RateStars from "src/components/RatingStars";
import { useRemoveParams } from "src/hooks/custom/useCustomNavigate";
import { TelegramApp } from "src/utils/tgHelpers";

const TgRating = () => {
  const { id } = useParams();
  const removeParams = useRemoveParams();
  const [rate, $rate] = useState(0);
  const handleRate = (num: number) => $rate(num);

  const { register, handleSubmit, getValues } = useForm();

  const renderTitle = useMemo(() => {
    switch (rate) {
      case 1:
        return "Плохо";
      case 2:
        return "Ниже среднего";
      case 3:
        return "Удовлетворительно";
      case 4:
        return "Хорошо";
      case 5:
        return "Отлично";

      default:
        return "";
    }
  }, [rate]);

  return (
    <div className="absolute inset-0 bg-mainGray flex flex-col z-[1000]">
      <Header title={`Заказ №${id}`} subTitle={`Статус: `}>
        <div
          onClick={() => TelegramApp.closeWindow()}
          className="rounded-full !border !border-black h-9 w-9 flex items-center justify-center"
        >
          <span aria-hidden="true" className="text-3xl font-thin">
            &times;
          </span>
        </div>
      </Header>

      <div className="flex flex-1 flex-col px-4">
        <RateStars value={rate} onChange={handleRate} className="flex-[2]" />
        <h5 className="font-bold text-xl text-[rgba(0,_0,_0,_0.33)] justify-center items-center flex flex-1 mt-5">
          {renderTitle}
        </h5>
        {!rate && (
          <h4 className="font-bold text-xl justify-center items-center text-center flex flex-1 mb-5">
            Оставьте свой отзыв и помогите нам стать ещё лучше
          </h4>
        )}

        {!rate && (
          <img
            src="/assets/images/safia.jpg"
            alt=""
            className="w-28 opacity-20 mx-auto mb-10"
          />
        )}

        {rate > 0 && (
          <h4 className="font-bold text-xl justify-center items-center text-center flex flex-1 mb-5">
            {rate < 5
              ? "Что вас разочаровало?"
              : "При желании можете добавить комментарии"}
          </h4>
        )}

        {!!rate && (
          <BaseInput className="flex flex-1 flex-col">
            <MainInput
              className="!bg-darkGray"
              register={register("comment")}
              placeholder={"Ваш комментарий..."}
            />
          </BaseInput>
        )}
      </div>
      {!!rate && (
        <button type="submit" className="btn btn-primary">
          Готово
        </button>
      )}
    </div>
  );
};

export default TgRating;
