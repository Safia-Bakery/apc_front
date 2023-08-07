import { roleSelector, tokenSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import useBrigadas from "src/hooks/useBrigadas";
import useRoles from "src/hooks/useRoles";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";

const useQueriesPrefetch = () => {
  const token = useAppSelector(tokenSelector);
  const user = useAppSelector(roleSelector);

  const { isLoading: rolesLoading } = useRoles({
    enabled: !!token && !!user?.permissions?.roles,
  });
  const { isLoading: brigadaLoading } = useBrigadas({
    enabled: !!token && !!user?.permissions?.brigada,
  });
  const { isLoading: branchLoading } = useBranches({
    enabled: !!token && !!user?.permissions?.fillials,
  });
  const { isLoading: categoryLoading } = useCategories({
    enabled: !!token && !!user?.permissions?.category,
  });

  // return {
  //   isLoading:
  //     rolesLoading ||
  //     brigadaLoading ||
  //     branchLoading ||
  //     permissionLoading ||
  //     categoryLoading,
  // };
};

export default useQueriesPrefetch;
