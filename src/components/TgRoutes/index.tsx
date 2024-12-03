import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useQueryString from "custom/useQueryString";
import { getDepartment, loginHandler } from "reducers/auth";
import { useAppDispatch } from "@/store/utils/types";
import { getFreezerState } from "@/store/reducers/freezer";
import errorToast from "@/utils/errorToast";

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.body.appendChild(script);
  });
};

const TgRoutes = () => {
  const tokenKey = useQueryString("key");
  const departmentParam = useQueryString("department");
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
    if (message_id) dispatch(getFreezerState({ message_id }));
  }, [message_id]);

  useEffect(() => {
    const loadAndInitializeTelegramWebApp = async () => {
      try {
        // Load the Telegram Web App script
        await loadScript("https://telegram.org/js/telegram-web-app.js");

        // Ensure Telegram WebApp is available
        const telegram = (window as any).Telegram?.WebApp;
        if (telegram) {
          // Optional delay to ensure readiness
          await new Promise((resolve) => setTimeout(resolve, 400));

          telegram.expand();
          telegram.enableClosingConfirmation();

          if (!telegram.isClosingConfirmationEnabled) {
            telegram.isClosingConfirmationEnabled = true;
          }
        } else {
          errorToast("Telegram WebApp is not available.");
        }
      } catch (error) {
        errorToast(`Failed to load Telegram WebApp script:${error}`);
      }
    };

    loadAndInitializeTelegramWebApp();

    return () => {
      // Clean up the script on component unmount
      const script = document.querySelector<HTMLScriptElement>(
        `script[src="https://telegram.org/js/telegram-web-app.js"]`
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <Outlet />;
};

export default TgRoutes;
