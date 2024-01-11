import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import cl from "classnames";
import BaseInputs from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Card from "@/components/Card";
import Header from "@/components/Header";
import TableHead from "@/components/TableHead";
import { MainPermissions } from "@/utils/types";
import styles from "./index.module.scss";
import requestMutation from "@/hooks/mutation/orderMutation";
import { inventoryCategoryId } from "@/utils/helpers";
import BranchSelect from "@/components/BranchSelect";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import useQueryString from "@/hooks/custom/useQueryString";
import { successToast } from "@/utils/toast";
import useOrders from "@/hooks/useOrders";
import { InputWrapper, SelectWrapper } from "@/components/InputWrappers";

//test
interface InventoryFields {
  product: {
    value: string;
    label: string;
  };
  qnt: string | number;
  comment: string;
}

interface FormData {
  inputFields: InventoryFields[];
  main_comment: string;
}

const initialInventory: InventoryFields = {
  product: { value: "", label: "" },
  qnt: 1,
  comment: "",
};

const column = [
  { name: "№", key: "" },
  { name: "ТОВАР", key: "id" },
  { name: "КОЛИЧЕСТВО", key: "fillial.name" },
  { name: "ПРИМЕЧАНИЕ", key: "category.name" },
  { name: "", key: "remove" },
  { name: "", key: "add" },
];

const AddInventoryRequest = () => {
  const navigate = useNavigate();
  const { refetch } = useOrders({ enabled: false });

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

  const { mutate } = requestMutation();
  const perm = useAppSelector(permissionSelector);

  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputFields",
  });

  const onSubmit = (data: FormData) => {
    const { main_comment, inputFields } = data;
    const expenditure = inputFields.reduce((acc: any, item) => {
      acc[item?.product?.value] = [+item.qnt, item.comment];
      return acc;
    }, {});

    mutate(
      {
        description: main_comment,
        category_id: inventoryCategoryId,
        fillial_id: branch.id,
        expenditure,
      },
      {
        onSuccess: () => {
          refetch();
          navigate("/requests-inventory");
          successToast("created");
        },
      }
    );
  };

  const addInputFields = () => append(initialInventory);

  const handleIncrement = (idx: number) => () => {
    setValue(`inputFields.${idx}.qnt`, +watch(`inputFields.${idx}.qnt`) + 1);
  };
  const handleDecrement = (idx: number) => () => {
    if (+watch(`inputFields.${idx}.qnt`) > 1)
      setValue(`inputFields.${idx}.qnt`, +watch(`inputFields.${idx}.qnt`) - 1);
  };

  return (
    <Card>
      <Header title={"Добавить"}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-primary btn-fill"
        >
          Назад
        </button>
      </Header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="table-responsive content"
      >
        <BaseInputs className="relative" label="ФИЛИАЛ">
          {perm?.[MainPermissions.get_fillials_list] && (
            <BranchSelect enabled origin={1} />
          )}
        </BaseInputs>
        <h2 className="font-weight-normal">Товары</h2>

        <table className="table table-hover">
          <TableHead column={column} />

          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id + index}>
                <td>{index + 1}</td>
                <td>
                  <Controller
                    name={`inputFields.${index}.product`}
                    control={control}
                    defaultValue={field.product}
                    render={({ field }) => (
                      <SelectWrapper
                        field={field}
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

        <BaseInputs label="ПРИМЕЧАНИЕ">
          <MainTextArea register={register("main_comment")} />
        </BaseInputs>
        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default AddInventoryRequest;
