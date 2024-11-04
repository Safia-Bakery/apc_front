import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { itemsPerPage } from "@/utils/helpers";
import { useEffect } from "react";

const CustomNavigator = ({ data }: { data: any }) => {
  const navigateParams = useNavigateParams();
  useEffect(() => {
    if (data?.length <= itemsPerPage) navigateParams({ page: 1 });
  }, [data.length]);
  return null;
};

export default CustomNavigator;
