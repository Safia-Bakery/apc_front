import AntCascader from "@/components/AntCascader";
import AntModal from "@/components/AntModal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import cl from "classnames";
import { Departments, EPresetTimes, Sphere } from "@/utils/types";
import { loadCategoriesChild, useCategories } from "@/hooks/useCategories";
import errorToast from "@/utils/errorToast";
import { getItrequest, itRequestMutation } from "@/hooks/it";
import { useParams } from "react-router-dom";
import { CascaderProps } from "antd";
import successToast from "@/utils/successToast";

interface Option {
  value?: string | number | null;
  label?: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
  loading?: boolean;
}

const EditCategory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [modal, $modal] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, $selected] = useState<number>();
  const { mutate: attach, isPending: attaching } = itRequestMutation();
  const { refetch } = getItrequest({ id: Number(id), enabled: false });
  const toggleModal = () => $modal((prev) => !prev);

  const { data: categories, isLoading: categoriesLoading } = useCategories({
    enabled: modal,
    department: Departments.IT,
    sphere_status: Sphere.fix,
    category_status: 1,
    staleTime: EPresetTimes.MINUTE * 4,
  });

  const { mutateAsync, isPending } = loadCategoriesChild();

  const handleSubmit = () => {
    attach(
      { request_id: Number(id), category_id: selected },
      {
        onSuccess: () => {
          refetch();
          successToast("success");
          toggleModal();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleChange: CascaderProps<Option>["onChange"] = (value) => {
    $selected(Number(value?.at(-1)));
  };

  const loadData = async (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    try {
      const children = await mutateAsync(Number(targetOption.value));
      targetOption.loading = false;
      targetOption.children = children.items?.map((child) => ({
        value: child.id,
        label: child.name,
      }));
      setOptions([...options]); // Update options to trigger re-render
    } catch (error) {
      errorToast("Failed to load children:");
      targetOption.loading = false;
    }
  };

  useEffect(() => {
    if (!!categories?.items?.length)
      setOptions(
        categories?.items?.map((item) => ({
          label: item.name,
          value: item.id,
          isLeaf: !!item.is_child,
        }))
      );
  }, [categories]);

  return (
    <>
      <button
        className={cl("btn btn-primary", styles.changeBtn)}
        onClick={toggleModal}
      >
        {t("change")}
      </button>

      <AntModal
        open={modal}
        onOk={handleSubmit}
        loading={categoriesLoading || attaching}
        title={t("select_handler")}
        closable
        onCancel={toggleModal}
      >
        <AntCascader
          className="w-full"
          loading={categoriesLoading || isPending}
          changeOnSelect
          onChange={handleChange}
          options={options}
          loadData={loadData}
          //   fieldNames={{ value: "id", label: "name" }}
        />
      </AntModal>
    </>
  );
};

export default EditCategory;
