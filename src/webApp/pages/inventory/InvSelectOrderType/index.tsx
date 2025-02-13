import InvHeader from "@/webApp/components/web-header";
import invOrderType from "/icons/invOrderType.svg";
import arrow from "/icons/arrowBlack.svg";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import CustomLink from "@/webApp/components/CustomLink";
import { ChangeEvent, useEffect } from "react";
import { TelegramApp } from "@/utils/tgHelpers";
import { deptSelector } from "@/store/reducers/auth";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { Departments } from "@/utils/types";
import { useTranslation } from "react-i18next";
import { changeLanguage, langSelector } from "@/store/reducers/selects";
import { Language } from "@/utils/keys";
import i18n from "@/localization";

const InvSelectOrderType = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(langSelector);

  const handleLang = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(changeLanguage(e.target.value as Language));
    i18n.changeLanguage(e.target.value as Language);
  };

  useEffect(() => {
    TelegramApp?.confirmClose();
  }, []);
  const dep = useAppSelector(deptSelector);

  return (
    <div>
      <InvHeader
        title={t("inventory")}
        rightChild={
          <select
            onChange={handleLang}
            value={lang}
            className="!bg-transparent"
          >
            {Object.keys(Language).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        }
      />

      <WebAppContainer>
        <CustomLink
          to={
            dep === Departments.inventory_retail
              ? "add-order"
              : "select-manager"
          }
          className="flex bg-[#F9EED9] items-center rounded-2xl mb-4 px-4 py-3"
        >
          <img src={invOrderType} alt="order-icon" />

          <div className="flex flex-1 flex-col mx-2">
            <h6 className="mb-1 font-normal text-base text-left text-black">
              {t("create_order")}
            </h6>

            <p className="text-xs text-gray-400 text-left">
              {t("here_create_order")}
            </p>
          </div>

          <button>
            <img src={arrow} alt="arrow" className="rotate-90" />
          </button>
        </CustomLink>
        <CustomLink
          to={"archieve"}
          className="flex bg-[#F9EED9] items-center rounded-2xl mb-4 px-4 py-3 text-black"
        >
          <img src={invOrderType} alt="order-icon" />

          <div className="flex flex-1 flex-col mx-2">
            <h6 className="mb-1 font-normal text-base text-left">
              {t("archieve")}
            </h6>

            <p className="text-xs text-gray-400 text-left">
              {t("here_you_can_see_orders")}
            </p>
          </div>

          <button>
            <img src={arrow} alt="arrow" className="rotate-90" />
          </button>
        </CustomLink>
      </WebAppContainer>
    </div>
  );
};

export default InvSelectOrderType;
