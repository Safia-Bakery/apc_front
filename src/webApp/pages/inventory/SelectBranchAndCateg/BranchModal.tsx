import EmptyList from "@/components/EmptyList";
import Modal from "@/components/Modal";
import useDebounce from "@/hooks/custom/useDebounce";
import useBranches from "@/hooks/useBranches";
import { deptSelector } from "@/store/reducers/auth";
import { branchSelector, selectBranch } from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { BranchType, Departments } from "@/utils/types";
import InvInput from "@/webApp/components/InvInput";
import cl from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onChange?: ({ name, id }: { name: string; id: string }) => void;
};

const BranchModal = ({ isOpen, onClose, onChange }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedBranch = useAppSelector(branchSelector);
  const [branchPage, $branchPage] = useState(1);
  const [branches, $branches] = useState<BranchType[]>([]);
  const [branchSearch, $branchSearch] = useDebounce("");
  const dept = useAppSelector(deptSelector);

  const { data, isLoading: branchLoading } = useBranches({
    page: branchPage,
    warehouse: dept === Departments.inventory_factory,
    ...(branchSearch && { body: { name: branchSearch } }),
  });

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !branchSearch) {
      $branchPage((prev) =>
        data?.total && data?.pages > prev ? prev + 1 : prev
      );
    }
  };

  useEffect(() => {
    if (!!data?.items?.length && !branchSearch)
      $branches((prev) => [...prev, ...data.items]);

    if (branchSearch && data?.items) $branches(data.items || []);
  }, [data?.items, branchLoading, branchSearch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-5 !min-w-[90%]">
      <h4 className="text-center mt-3 mb-6">{t("select_branch")}</h4>

      <InvInput
        placeholder={t("search_branch")}
        wrapperClassName="bg-[#F6F6F6] mb-5"
        onChange={(e) => $branchSearch(e.target?.value)}
      />

      <ul
        className="h-full overflow-y-auto flex flex-1 flex-col max-h-[220px] pr-2"
        onScroll={handleScroll}
      >
        {!!branches?.length &&
          branches.map((branch, idx) => (
            <li
              key={idx + branch.id}
              onClick={() => {
                onChange
                  ? onChange({ name: branch.name, id: branch.id })
                  : dispatch(
                      selectBranch({ name: branch.name, id: branch.id })
                    );
                onClose();
              }}
              className="flex justify-between items-center border-t border-[#E4E4E4] py-3"
            >
              <label>{branch.name}</label>
              <div
                className={cl(
                  "bg-[#E7E7E7] rounded-full h-5 w-5 transition-all",
                  {
                    ["border-[5px] border-tgPrimary"]:
                      selectedBranch?.id && branch.id === selectedBranch?.id,
                  }
                )}
              />
            </li>
          ))}

        {branchLoading && <span>{t("loading")}...</span>}

        {!branches.length && <EmptyList />}
      </ul>
    </Modal>
  );
};

export default BranchModal;
