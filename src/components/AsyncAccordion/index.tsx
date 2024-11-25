import { useState } from "react";
import { Button, Flex, Typography } from "antd";
import useCategories from "@/hooks/useCategories";
import { Sphere, Departments, Category } from "@/utils/types";
import { useRemoveParams } from "@/hooks/custom/useCustomNavigate";
import { BtnTypes } from "@/Types/common/btnTypes";
import { useTranslation } from "react-i18next";
import cl from "classnames";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import { useParams } from "react-router-dom";
import useOrder from "@/hooks/useOrder";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";

interface LocalCategType {
  name: string;
  id: number;
  is_child?: boolean | null;
}

const AsyncAccordion = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const removeParams = useRemoveParams();
  const [folderStack, $folderStack] = useState<LocalCategType[]>([]);
  const { mutate: attach } = attachBrigadaMutation();

  const { refetch: orderRefetch } = useOrder({
    id: Number(id),
    enabled: false,
  });

  const closeModal = () => removeParams(["modal"]);
  const handleBack = () => $folderStack((prev) => prev.slice(0, -1));

  const handleChangeCateg = (category_id: number) => {
    attach(
      {
        request_id: Number(id),
        category_id,
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("changed");
          closeModal();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const { data: parents } = useCategories({
    department: Departments.APC,
    sphere_status: Sphere.retail,
    ...(folderStack?.length && { parent_id: folderStack?.at(-1)?.id }),
    category_status: 1,
  });

  const handleFolder = (item: Category) => {
    if (item.is_child) handleChangeCateg(item.id);
    else
      $folderStack((prev) => [
        ...prev,
        { name: item.name, id: item.id, is_child: item.is_child },
      ]);
  };

  return (
    <div>
      <div className="sticky top-0 py-2 bg-white">
        <Flex align="center" gap={10} className="mb-2">
          {!!folderStack.length && (
            <Button
              className={"!min-w-9"}
              onClick={handleBack}
              type={BtnTypes.primary}
              icon={
                <img
                  src="/icons/arrow.svg"
                  className="-rotate-90"
                  alt="go-back"
                  height={24}
                  width={24}
                />
              }
              children={null}
            />
          )}
          <Typography>{t("select_category")}</Typography>
        </Flex>
        {!!folderStack.length && <h1>Выбрано: {folderStack?.at(-1)?.name}</h1>}

        <button
          onClick={() => removeParams(["modal", "photo"])}
          className={
            "absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
          }
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <ul>
        {parents?.items.map((parent) => (
          //   <li key={parent.id}>
          //     {!parent.is_child ? (
          //       <Link to={`?parent_id=${parent.id}&parent_name=${parent.name}`}>
          //         {parent?.name}
          //       </Link>
          //     ) : (
          //       parent?.name
          //     )}
          //   </li>

          <li
            className={cl(
              "bg-gray-300 p-2 border-t border-t-black last:border-b flex items-center gap-4"
            )}
            onClick={() => handleFolder(parent)}
            key={parent.id}
          >
            {!parent.is_child && (
              <img
                src="/icons/folder.svg"
                height={30}
                width={30}
                alt="folder"
              />
            )}
            <span>{parent.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AsyncAccordion;
