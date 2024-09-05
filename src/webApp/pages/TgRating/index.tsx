import cl from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import Header from "@/components/Header";
import RateStars from "@/components/RatingStars";
import useQueryString from "custom/useQueryString";
import commentMutation from "@/hooks/mutation/comment";
import { TelegramApp } from "@/utils/tgHelpers";
import { errorToast } from "@/utils/toast";
import { Departments, MarketingSubDep } from "@/utils/types";
import { useTranslation } from "react-i18next";

const renderTitle: { [key: number]: string } = {
  1: "bad",
  2: "less_avg",
  3: "satisfactorily",
  4: "good",
  5: "excelent",
};

const TgRating = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [rate, $rate] = useState(0);
  const [btnState, $btnState] = useState(true);
  const handleRate = (num: number) => $rate(num);
  const user_id = Number(useQueryString("user_id"));
  const department =
    Number(useQueryString("department")) !== Departments.marketing
      ? Number(useQueryString("department"))
      : undefined;
  const sub_id = Number(useQueryString("sub_id"));

  const { mutate } = commentMutation();

  const { register, handleSubmit, getValues } = useForm();

  const onSubmit = () => {
    mutate(
      {
        request_id: Number(id),
        comment: getValues("comment"),
        rating: rate,
        user_id,
      },
      {
        onSuccess: () => {
          TelegramApp.toMainScreen();
          $btnState(false);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  return (
    <form
      className="absolute inset-0 bg-mainGray flex flex-col z-[1000] h-[100lvh]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Header
        title={`Заказ №${id}`}
        subTitle={t(
          department ? Departments[department] : MarketingSubDep[sub_id]
        )}
      >
        <div
          onClick={() => TelegramApp.close()}
          className="rounded-full !border !border-black h-9 w-9 flex items-center justify-center"
        >
          <span aria-hidden="true" className="text-3xl font-thin">
            &times;
          </span>
        </div>
      </Header>

      <div className="flex flex-1 flex-col px-4">
        <RateStars
          value={rate}
          onChange={handleRate}
          className="flex-1 items-end"
        />
        <div className="flex flex-[2] flex-col justify-center">
          <h5
            className={cl(
              "font-bold text-xl text-[rgba(0,_0,_0,_0.33)] justify-center items-center flex my-10",
              { ["hidden"]: !rate }
            )}
          >
            {t(rate ? renderTitle[rate] : "")}
          </h5>
          {!rate && (
            <h4 className="font-bold text-xl justify-center items-center text-center flex my-10">
              {t("leave_comment_to_be_better")}
            </h4>
          )}

          {!rate && (
            <img
              src="/images/safia.jpg"
              alt=""
              className="w-28 opacity-20 mx-auto mb-16"
            />
          )}

          {rate > 0 && (
            <h4 className="font-bold text-xl justify-center items-center text-center flex mb-10">
              {rate < 5 ? t("what_disappointed_you") : t("what_canna_updated")}
            </h4>
          )}

          {!!rate && (
            <BaseInput className="flex flex-1 flex-col">
              <MainInput
                className="!bg-darkGray"
                register={register("comment")}
                placeholder={t("your_comment")}
              />
            </BaseInput>
          )}
        </div>
      </div>
      {!!rate && btnState && (
        <button
          type="submit"
          className="btn btn-primary absolute bottom-0 right-0 left-0"
        >
          {t("ready")}
        </button>
      )}
    </form>
  );
};

export default TgRating;
