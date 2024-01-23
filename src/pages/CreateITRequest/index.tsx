import { useEffect, useState, forwardRef, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import cl from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { errorToast, successToast } from "@/utils/toast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import requestMutation from "@/hooks/mutation/orderMutation";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import useCategories from "@/hooks/useCategories";
import {
  CategoryProducts,
  Departments,
  MainPermissions,
  Sphere,
} from "@/utils/types";
import Loading from "@/components/Loader";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useCatProducts from "@/hooks/useCatProducts";
import TableHead from "@/components/TableHead";
import MainInput from "@/components/BaseInputs/MainInput";
import { InputWrapper } from "@/components/InputWrappers";

interface InventoryFields {
  product: string;
  qnt: string | number;
  category_id: number;
}

interface FormDataTypes {
  inputFields: InventoryFields[];
  order_type: number;
  fillial_id: string;
  description: string;
  category_id?: number;
}

const initialInventory: InventoryFields | undefined = {
  product: "",
  qnt: 1,
  category_id: 0,
};

const column = [
  { name: "№", key: "" },
  { name: "КАТЕГОРИЕ", key: "category_id" },
  { name: "ТОВАР", key: "product_id" },
  { name: "КОЛИЧЕСТВО", key: "count" },
  { name: "", key: "remove" },
  { name: "", key: "add" },
];

const SelectWrapper = forwardRef<
  HTMLInputElement,
  { field: any; values: any[] | undefined; register?: any; error?: any }
>(({ field, values, register, error }, ref) => {
  return (
    <BaseInputs className="!mb-0" error={error}>
      <MainSelect
        {...field}
        ref={ref}
        values={values}
        register={register}
        className="!mb-0"
      />
    </BaseInputs>
  );
});

const CreateITRequest = () => {
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isLoading } = requestMutation();
  const { sphere } = useParams();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const perm = useAppSelector(permissionSelector);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormDataTypes>({
    defaultValues: { inputFields: [initialInventory] },
  });

  const category_id = watch(
    `inputFields.${watch("inputFields")?.length - 1}.category_id`
  );

  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.it,
    sphere_status: Number(sphere),
    enabled: !!sphere,
  });

  const { isLoading: productLoading } = useCatProducts({
    category_id,
    enabled: !!category_id,
  });

  const cacheProduct = (categId: number) => {
    const queryClient = useQueryClient();
    const productKey = ["category_products", categId, 1, undefined, undefined];
    return queryClient.getQueryCache().find(productKey)?.state
      ?.data as CategoryProducts[];
  };

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const handleIncrement = (idx: number) => () => {
    setValue(`inputFields.${idx}.qnt`, +watch(`inputFields.${idx}.qnt`) + 1);
  };
  const handleDecrement = (idx: number) => () => {
    if (+watch(`inputFields.${idx}.qnt`) > 1)
      setValue(`inputFields.${idx}.qnt`, +watch(`inputFields.${idx}.qnt`) - 1);
  };

  const handleFilesSelected = (data: FileItem[]) => $files(data);

  const onSubmit = (data: FormDataTypes) => {
    const { inputFields, description } = data;
    const cat_prod =
      !!inputFields?.[0]?.category_id &&
      inputFields?.reduce((acc: any, item) => {
        acc[item.product] = item.qnt;
        return acc;
      }, {});

    mutate(
      {
        category_id: data.category_id! || category_id!,
        description,
        fillial_id: branch?.id,
        files,
        ...(!!cat_prod && { cat_prod }),
      },
      {
        onSuccess: () => {
          navigate(`/requests-it/${sphere}`);
          successToast("Заказ успешно создано");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputFields",
  });

  const renderBranches = useMemo(() => {
    return (
      <BaseInputs className="relative" label="ФИЛИАЛ" error={errors.fillial_id}>
        {perm?.[MainPermissions.get_fillials_list] && (
          <BranchSelect origin={1} enabled />
        )}
      </BaseInputs>
    );
  }, [branch]);

  const addInputFields = () => append(initialInventory);

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  if (isLoading || (productLoading && !!category_id) || categoryLoading)
    return <Loading absolute />;

  return (
    <Card>
      <Header title="Создать заказ">
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        {renderBranches}

        {Number(sphere) === Sphere.purchase ? (
          <>
            <table className="table table-hover">
              <TableHead column={column} />
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id + index}>
                    <td width={20}>{index + 1}</td>
                    <td>
                      <Controller
                        name={`inputFields.${index}.category_id`}
                        control={control}
                        defaultValue={field.category_id}
                        render={({ field }) => (
                          <SelectWrapper
                            values={categories?.items}
                            field={field}
                            error={errors.inputFields?.[index]?.category_id}
                            register={register(
                              `inputFields.${index}.category_id`,
                              {
                                required: "Обязательное поле",
                              }
                            )}
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`inputFields.${index}.product`}
                        control={control}
                        defaultValue={field.product}
                        render={({ field }) => (
                          <SelectWrapper
                            values={cacheProduct(
                              watch(`inputFields.${index}.category_id`)
                            )}
                            field={field}
                            error={errors.inputFields?.[index]?.product}
                            register={register(`inputFields.${index}.product`, {
                              required: "Обязательное поле",
                            })}
                          />
                        )}
                      />
                    </td>
                    <td width={250}>
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
                                  required: "Обязательное поле",
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

                    <td className="align-top" width={100}>
                      <button
                        type="button"
                        onClick={() =>
                          fields.length > 1 ? remove(index) : null
                        }
                        className="btn bg-danger text-white"
                      >
                        Удалить
                      </button>
                    </td>
                    <td className="align-top" width={100}>
                      <button
                        type="button"
                        className={cl("btn btn-primary w-min")}
                        onClick={addInputFields}
                      >
                        Добавить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <BaseInputs label="Категорие" error={errors.category_id}>
            <MainSelect
              values={categories?.items}
              register={register("category_id", {
                required: "Обязательное поле",
              })}
            />
          </BaseInputs>
        )}

        <BaseInputs label="Комментарии" error={errors.description}>
          <MainTextArea
            register={register("description", {
              required: "Обязательное поле",
            })}
            placeholder="Комментарии"
          />
        </BaseInputs>

        <BaseInputs
          className={`mb-4 ${styles.uploadImage}`}
          label="Добавить файл"
        >
          <UploadComponent onFilesSelected={handleFilesSelected} />
        </BaseInputs>
        <div>
          <button
            type="submit"
            className={`btn btn-info btn-fill float-end ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateITRequest;
