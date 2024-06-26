import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import cl from "classnames";
import BaseInputs from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Card from "@/components/Card";
import Header from "@/components/Header";
import TableHead from "@/components/TableHead";
import { Departments } from "@/utils/types";
import styles from "./index.module.scss";
import requestMutation from "@/hooks/mutation/orderMutation";
import { isMobile } from "@/utils/helpers";
import BranchSelect from "@/components/BranchSelect";
import useQueryString from "@/hooks/custom/useQueryString";
import { errorToast, successToast } from "@/utils/toast";
import { InputWrapper, SelectWrapper } from "@/components/InputWrappers";
import { TelegramApp } from "@/utils/tgHelpers";
import Loading from "@/components/Loader";
import { useState } from "react";
import { inventoryCategoryId } from "@/utils/keys";
import { useTranslation } from "react-i18next";

interface InventoryFields {
  product:
    | {
        value: string;
        label: string;
      }
    | undefined;
  qnt: string | number;
  comment: string;
}

interface FormData {
  inputFields: InventoryFields[];
  main_comment: string;
}

const initialInventory: InventoryFields = {
  product: undefined,
  qnt: 1,
  comment: "",
};

const column = [
  { name: "№", key: "" },
  { name: "product", key: "id" },
  { name: "quantity", key: "fillial.name" },
  { name: "comment", key: "category.name" },
  { name: "", key: "remove" },
  { name: "", key: "add" },
];

const AddInventoryRequest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [btn, $btn] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { inputFields: [initialInventory], main_comment: "" },
  });

  const { mutate, isPending: mutating } = requestMutation();

  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputFields",
  });

  const onSubmit = (data: FormData) => {
    const { main_comment, inputFields } = data;
    if (inputFields.find((item) => !item.product?.value))
      return alert(t("product_is_required"));
    else {
      const expenditure = inputFields.reduce((acc: any, item) => {
        if (item?.product?.value)
          acc[item?.product?.value] = [+item.qnt, item.comment];
        return acc;
      }, {});

      mutate(
        {
          category_id: inventoryCategoryId,
          fillial_id: branch.id,
          expenditure,
          description: !!main_comment ? main_comment : " ",
        },
        {
          onSuccess: () => {
            if (isMobile) {
              $btn(true);
              TelegramApp.toMainScreen();
            } else {
              navigate("/requests-inventory");
              successToast("created");
            }
          },
          onError: (e) => errorToast(e.message),
        }
      );
    }
  };

  const addInputFields = () => append(initialInventory);

  const handleIncrement = (idx: number) => () =>
    setValue(`inputFields.${idx}.qnt`, +watch(`inputFields.${idx}.qnt`) + 1);

  const handleDecrement = (idx: number) => () => {
    if (+watch(`inputFields.${idx}.qnt`) > 1)
      setValue(`inputFields.${idx}.qnt`, +watch(`inputFields.${idx}.qnt`) - 1);
  };

  return (
    <Card>
      <Header title={"add"}>
        {!isMobile && (
          <button
            onClick={() => navigate("/requests-inventory")}
            className="btn btn-primary  "
          >
            {t("back")}
          </button>
        )}
      </Header>

      <form onSubmit={handleSubmit(onSubmit)} className="content w-full">
        <BaseInputs className="relative" label="branch">
          <BranchSelect
            enabled
            origin={1}
            placeholdeer={t("search")}
            // permission={MainPermissions.get_fillials_list}
          />
        </BaseInputs>
        <h2 className="font-weight-normal">{t("products")}</h2>
        <div className={styles.table}>
          <table className={"table table-hover"}>
            <TableHead column={column} />

            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id + index}>
                  <td>{index + 1}</td>
                  <td className="min-w-[180px]">
                    <Controller
                      name={`inputFields.${index}.product`}
                      control={control}
                      defaultValue={field.product}
                      render={({ field }) => (
                        <SelectWrapper
                          field={field}
                          department={Departments.inventory}
                          register={register(`inputFields.${index}.product`)}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <div className="flex gap-4 w-full">
                      <button
                        type="button"
                        className={cl(
                          styles.increment,
                          "btn bg-danger text-white"
                        )}
                        onClick={handleDecrement(index)}
                      >
                        -
                      </button>
                      <div className="w-16">
                        <Controller
                          name={`inputFields.${index}.qnt`}
                          control={control}
                          defaultValue={field.qnt}
                          render={({ field }) => (
                            <InputWrapper
                              type="number"
                              field={field}
                              error={errors.inputFields?.[index]?.qnt}
                              register={register(`inputFields.${index}.qnt`, {
                                required: t("required_field"),
                              })}
                            />
                          )}
                        />
                      </div>
                      <button
                        className={cl(styles.increment, "btn bg-green-400")}
                        type="button"
                        onClick={handleIncrement(index)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <Controller
                      name={`inputFields.${index}.comment`}
                      control={control}
                      defaultValue={field.comment}
                      render={({ field }) => <InputWrapper field={field} />}
                    />
                  </td>
                  <td className="align-top" width={100}>
                    <button
                      type="button"
                      onClick={() => (fields.length > 1 ? remove(index) : null)}
                      className="btn bg-danger text-white my-auto h-full"
                    >
                      {t("remove")}
                    </button>
                  </td>
                  {!isMobile && (
                    <td className="align-top" width={100}>
                      <button
                        type="button"
                        className={cl("btn btn-primary w-min")}
                        onClick={addInputFields}
                      >
                        {t("add")}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isMobile && (
          <div className="mb-2 z-10 relative">
            <button
              type="button"
              className={cl("btn btn-primary w-min")}
              onClick={addInputFields}
            >
              {t("add")}
            </button>
          </div>
        )}

        <BaseInputs label="comment" className="z-10 relative">
          <MainTextArea register={register("main_comment")} />
        </BaseInputs>
        {!btn && (
          <button
            type="submit"
            disabled={mutating}
            className="btn btn-success   z-10 relative"
          >
            {t("save")}
          </button>
        )}
      </form>

      {mutating && <Loading />}
    </Card>
  );
};

export default AddInventoryRequest;
