import { Button, Empty, Flex, Select, Spin } from "antd";
import useDebounce from "@/hooks/custom/useDebounce";
import useBranches from "@/hooks/useBranches";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ValueLabel } from "@/utils/types";
import { editAddCalendarMutation, useCalendars } from "@/hooks/cleaning";
import { errorToast } from "@/utils/toast";

type Props = {
  selectedDate: string;
  selectedMonth: string;
  closeModal?: () => void;
};

const CalendarInput = ({ selectedDate, selectedMonth, closeModal }: Props) => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<string>("");
  const [branchSearch, $branchSearch] = useDebounce("");
  const [branches, $branches] = useState<ValueLabel[]>([]);
  const { mutate, isPending } = editAddCalendarMutation();
  const { refetch } = useCalendars({
    current_date: selectedMonth,
  });

  const {
    data,
    isLoading: branchLoading,
    isFetching,
  } = useBranches({
    page: 1,
    ...(branchSearch && { body: { name: branchSearch } }),
  });

  const handleSend = () => {
    mutate(
      {
        branch_id: selectedItems,
        date: selectedDate,
        is_active: 1,
      },
      {
        onSuccess: () => {
          refetch();
          closeModal?.();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleSelectChange = (value: string) => setSelectedItems(value);

  const optionRender = (option: any) => {
    return branchLoading ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spin size="small" />
      </div>
    ) : (
      option.label
    );
  };

  useEffect(() => {
    if (!!data?.items?.length) {
      const updatedBranches = data.items.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      $branches(updatedBranches);
    }
  }, [data?.items, branchSearch, branchLoading]);

  useEffect(() => {
    return () => {
      setSelectedItems("");
    };
  }, []);

  return (
    <Flex gap={10} className="mt-4">
      <Select
        loading={branchLoading}
        showSearch
        autoFocus
        // mode="multiple"
        filterOption={false}
        allowClear
        className="w-full"
        placeholder={t("select_branch")}
        onChange={handleSelectChange}
        onSearch={(e) => $branchSearch(e)}
        options={branches}
        value={selectedItems}
        notFoundContent={
          branchLoading || isFetching ? <Spin size="small" /> : <Empty />
        }
        optionRender={optionRender}
      />
      <Button
        loading={isPending}
        onClick={handleSend}
        disabled={isPending || !selectedItems?.length}
        className="bg-success"
      >
        {t("send")}
      </Button>
    </Flex>
  );
};

export default CalendarInput;
