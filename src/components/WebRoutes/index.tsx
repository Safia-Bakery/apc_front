import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { logoutHandler, tokenSelector } from "reducers/auth";
import { Outlet, useNavigate } from "react-router-dom";
import useToken from "@/hooks/useToken";
import Loading from "../Loader";
import BreadCrump from "../BreadCrump";
import {
  permissionHandler,
  permissionSelector,
  sidebarItemsHandler,
  sidebatItemsSelector,
} from "reducers/sidebar";
import useOrderCounts from "@/hooks/useOrderCounts";
import { langSelector } from "@/store/reducers/selects";
import i18n from "@/localization";
import { Playground } from "../CustomSidebar";

// const normalizeURL = (path: string) =>
//   path.replace(/\/+/g, "/").replace(/\/$/, "");

const WebRooutes = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const permission = useAppSelector(permissionSelector);
  const lang = useAppSelector(langSelector);

  const { error, data: user, isLoading } = useToken({});

  const { data: counts, isLoading: countLoading } = useOrderCounts({
    enabled: !!token,
  });

  const sidebarItems = useAppSelector(sidebatItemsSelector);

  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) dispatch(logoutHandler());
  }, [token, error]);

  const renderSidebar = useMemo(() => {
    if (!!permission && !!token)
      return (
        <>
          <Playground />
          <BreadCrump />
        </>
      );
  }, [permission, token]);

  useEffect(() => {
    // const currentPath = window.location.pathname;
    // const normalizedPath = normalizeURL(currentPath);
    // if (currentPath !== normalizedPath)
    //   navigate(normalizedPath, { replace: true });

    if (window.location.pathname === "/") navigate("/home");
  }, []);

  useEffect(() => {
    if (!!user?.permissions.length && !!token)
      dispatch(permissionHandler(user?.permissions));
  }, [user?.permissions, token]);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (permission && counts?.length) dispatch(sidebarItemsHandler(counts));
  }, [permission, counts]);

  if (isLoading || !sidebarItems?.length || !permission || countLoading)
    return <Loading />;
  return (
    <>
      {renderSidebar}
      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default WebRooutes;
