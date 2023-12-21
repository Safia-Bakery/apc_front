import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import cl from "classnames";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Card from "@/components/Card";
import Header from "@/components/Header";
import TableHead from "@/components/TableHead";

//test
interface InventoryFields {
  product: string;
  measurement?: string;
  qnt: string | number;
  comment: string;
}

interface FormData {
  inputFields: InventoryFields[];
  main_comment: string;
}

const initialInventory: InventoryFields = {
  product: "",
  qnt: "",
  comment: "",
};

const column = [
  { name: "№", key: "" },
  { name: "ТОВАР", key: "id" },
  { name: "ЕД. ИЗМ.", key: "type" },
  { name: "КОЛИЧЕСТВО", key: "fillial.name" },
  { name: "ПРИМЕЧАНИЕ", key: "category.name" },
  { name: "", key: "" },
];

const AddInventoryRequest = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, register, getValues } = useForm<FormData>({
    defaultValues: { inputFields: [initialInventory], main_comment: "" },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputFields",
  });

  const onSubmit = (data: FormData) => {};

  const addInputFields = () => append(initialInventory);

  const InputWrapper = forwardRef<
    HTMLInputElement,
    { field: any; type?: string }
  >(({ field, type = "text" }, ref) => {
    return (
      <BaseInputs>
        <MainInput {...field} ref={ref} type={type} />
      </BaseInputs>
    );
  });
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
        className="table-responsive grid-view content "
      >
        <h2 className="font-weight-normal">Товары</h2>
        <table className="table table-hover">
          <TableHead column={column} />
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td>{index + 1}</td>
                <td>
                  <Controller
                    name={`inputFields.${index}.product`}
                    control={control}
                    defaultValue={field.product}
                    render={({ field }) => <InputWrapper field={field} />}
                  />
                </td>
                <td></td>
                <td>
                  <Controller
                    name={`inputFields.${index}.qnt`}
                    control={control}
                    defaultValue={field.qnt}
                    render={({ field }) => (
                      <InputWrapper type={"number"} field={field} />
                    )}
                  />
                </td>
                <td>
                  <Controller
                    name={`inputFields.${index}.comment`}
                    control={control}
                    defaultValue={field.comment}
                    render={({ field }) => <InputWrapper field={field} />}
                  />
                </td>
                <td className="align-top">
                  <button
                    style={{ height: 40 }}
                    type="button"
                    onClick={() => (fields.length > 1 ? remove(index) : null)}
                    className="btn btn-danger"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className={cl("btn btn-primary m-2 ")}
          onClick={addInputFields}
        >
          Добавить
        </button>

        <BaseInputs label="ПРИМЕЧАНИЕ">
          <MainTextArea register={register("main_comment")} />
        </BaseInputs>
        {/* <button
          type="button"
          className="btn btn-primary mr-3 btn-fill"
          onClick={addInputFields}
        >
          Add
        </button> */}
        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default AddInventoryRequest;
