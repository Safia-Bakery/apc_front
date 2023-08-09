import { tokenSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import useBrigadas from "src/hooks/useBrigadas";
import useRoles from "src/hooks/useRoles";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";
import useToken from "../useToken";
import { permissioms } from "src/utils/helpers";

const useQueriesPrefetch = () => {
  const token = useAppSelector(tokenSelector);
  const { data: me } = useToken({});
  //@ts-ignore
  const user = me?.permissions === "*" ? permissioms : me?.permissions;

  const { isFetching: rolesLoading } = useRoles({
    enabled: !!token && !!user?.roles,
  });
  const { isFetching: brigadaLoading } = useBrigadas({
    enabled: !!token && !!user?.brigada,
  });
  const { isFetching: branchLoading } = useBranches({
    enabled: !!token && !!user?.fillials,
  });
  const { isFetching: categoryLoading } = useCategories({
    enabled: !!token && !!user?.category,
  });

  return {
    isFetching:
      rolesLoading || brigadaLoading || branchLoading || categoryLoading,
  };
};

export default useQueriesPrefetch;
