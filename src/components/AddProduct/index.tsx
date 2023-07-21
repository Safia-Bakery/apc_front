import { useState } from "react";
import Card from "../Card";
import Header from "../Header";
import Modal from "../Modal";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { useForm } from "react-hook-form";
import MainInput from "../BaseInputs/MainInput";

const column = [
  { name: "#" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  {
    name: "Автор",
  },
];

const AddProduct = () => {
  const [modal, $modal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const handleModal = () => $modal((prev) => !prev);
  return (
    <Card>
      <Header title="Товары">
        <button
          className="btn btn-success btn-fill btn-sm"
          onClick={handleModal}
        >
          Добавить
        </button>
      </Header>
      <div className="content table-responsive table-full-width overflow-hidden">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => {
                return (
                  <th className={styles.tableHead} key={name}>
                    {name}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {[...Array(4)]?.map((order, idx) => (
              <tr className="bg-blue" key={idx}>
                <td width="40">{idx + 1}</td>
                <td>name</td>
                <td>45</td>
                <td>Электричество</td>
                <td>{dayjs(order?.time_created).format("DD-MM-YYYY HH:mm")}</td>
                <td>Сафия Шохимардон</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
      </div>
      <Modal className={styles.modal} isOpen={modal} onClose={handleModal}>
        <Header title="Добавить расходной товар">
          <button onClick={handleModal} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        <div className={styles.modalBody}>
          <div className="form-group field-apcitems-product_id">
            <label className="control-label">Товар</label>
            <select className="form-control">
              <option value="">Выберите товар</option>
              <option value="00085b3a-adb6-45f5-b4f4-72966f357aee">
                Ложка для персонала
              </option>
              <option value="0015b9c7-8266-4b57-906c-18ef494bafac">
                Щетка жесткая 50 см
              </option>
              <option value="001879dc-3f5c-448b-ba6b-146005ef9681">
                Тарелка глубокая для супа
              </option>
            </select>
          </div>

          <BaseInput label="Количество">
            <MainInput type="number" register={register("qnt")} />
          </BaseInput>

          <BaseInput label="Примичание">
            <MainTextArea register={register("description")} />
          </BaseInput>
        </div>

        <hr />

        <div className={styles.footer}>
          <button type="submit" className="btn btn-success btn-fill">
            Добавить
          </button>
        </div>
      </Modal>
    </Card>
  );
};

export default AddProduct;
