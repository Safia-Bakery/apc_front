import { permissionSelector, tokenSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import useBranches from "src/hooks/useBranches";
import { MainPermissions } from "src/utils/types";

const useQueriesPrefetch = () => {
  const token = useAppSelector(tokenSelector);
  const permissions = useAppSelector(permissionSelector);

  const { isLoading: branchLoading } = useBranches({
    enabled:
      (!!token && !!permissions?.[MainPermissions.get_fillials_list]) || false,
    origin: 0,
  });
  return {
    isLoading:
      !!permissions?.[MainPermissions.get_fillials_list] && branchLoading,
  };
};

export default useQueriesPrefetch;
