import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useQueryString from "custom/useQueryString";
import { getDepartment, loginHandler } from "reducers/auth";
import { useAppDispatch } from "@/store/utils/types";
import { TelegramApp } from "@/utils/tgHelpers";
import { getFreezerState } from "@/store/reducers/freezer";

const TgRoutes = () => {
  const tokenKey = useQueryString("key");
  const departmentParam = useQueryString("department");
  const order_id = useQueryString("order_id");
  const message_id = useQueryString("message_id");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!!tokenKey) {
      dispatch(loginHandler(tokenKey));
      navigate(pathname + search);
    }
    departmentParam && dispatch(getDepartment(Number(departmentParam)));
  }, [tokenKey, departmentParam]);

  useEffect(() => {
    if (order_id) dispatch(getFreezerState({ order_id, message_id }));
  }, [order_id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      TelegramApp?.expand();
      TelegramApp?.confirmClose();
    }, 400);
  }, []);

  return <Outlet />;
};

export default TgRoutes;
