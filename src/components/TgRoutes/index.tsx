import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useQueryString from "src/hooks/custom/useQueryString";
import { loginHandler } from "src/store/reducers/auth";
import { useAppDispatch } from "src/store/utils/types";
import { TelegramApp } from "src/utils/tgHelpers";

const TgRoutes = () => {
  const tokenKey = useQueryString("key");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  console.log(tokenKey, "tokenKey");

  // useEffect(() => {
  //   if (!!tokenKey) {
  //     dispatch(loginHandler(tokenKey));
  //     navigate(pathname + search);
  //   }
  // }, [tokenKey]);

  useEffect(() => {
    setTimeout(() => {
      TelegramApp.confirmClose();
      TelegramApp.expand();
    }, 300);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <Outlet />;
};

export default TgRoutes;
