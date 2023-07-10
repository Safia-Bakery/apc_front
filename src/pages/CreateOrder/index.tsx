import Container from "src/components/Container";
import InputBlock from "src/components/Input";
import styles from "./index.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loading from "src/components/Loader";
import { errorToast, successToast } from "src/utils/toast";
import dayjs from "dayjs";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
// import { baseURL } from "src/api/axiosConfig";

const paymentType = ["Перечисление", "Наличные", "Перевод на карту"];

const mockDepartment = [
  { id: 1, name: "Фабрика" },
  { id: 2, name: "Розница" },
];

const CreateOrder = () => {
  const [imageId, $imageId] = useState<any>();
  const [department, $department] = useState<number>();
  const [imageLoading, $imageLoading] = useState(false);
  const [payment_type, $payment_type] = useState<string>(paymentType[0]);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      let formData = new FormData();
      formData.append("image", e.target.files[0]);
      $imageLoading(true);
      axios
        .post(`/image/upload`, formData)
        .then(({ data }) => {
          $imageId(data.id);
        })
        .catch((e) => {
          errorToast(e.message);
        })
        .finally(() => $imageLoading(false));
    }
  };

  const handleDept = (val: number) => () => $department(val);
  const handlePayment = (e: ChangeEvent<HTMLSelectElement>) =>
    $payment_type(e.target.value);
  const onSubmit = () => {
    const {
      user_name,
      product_name,
      price,
      payer,
      provider,
      urgent,
      description,
    } = getValues();

    // mutateOrder(
    //   {
    //     category_id: Number(department),
    //     purchaser: user_name,
    //     product: product_name,
    //     seller: provider,
    //     delivery_time: dayjs(selectedDate + selectedTime).toDate(),
    //     price,
    //     payer,
    //     urgent,
    //     description,
    //     payment_type,
    //     image_id: imageId,
    //   },
    //   {
    //     onSuccess: () => {
    //       reset();
    //       successToast("Заказ успешно создано");
    //     },
    //     onError: (error: any) => errorToast(error.toString()),
    //   }
    // );
  };

  // if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Создать заказ"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-group">
          <label>СОТРУДНИК</label>
          <select
            defaultValue={"Select Item"}
            className="form-select"
            onChange={handlePayment}
          >
            {paymentType.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.department.message?.toString()}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>ФИЛИАЛ</label>
          <select
            defaultValue={"Select Item"}
            className="form-select"
            onChange={handlePayment}
          >
            {paymentType.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.department.message?.toString()}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>КАТЕГОРИЯ</label>
          <select
            defaultValue={"Select Item"}
            className="form-select"
            onChange={handlePayment}
          >
            {paymentType.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.department.message?.toString()}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Комментарии</label>
          <textarea
            rows={4}
            {...register("description")}
            className={`form-control ${styles.textArea}`}
            name="description"
            placeholder="Комментарии"
          />
        </div>

        <div className={`row mb-4 col-md-12 ${styles.uploadImage}`}>
          <label>Добавить файл</label>
          <input
            className="form-control"
            type="file"
            multiple
            onChange={handleImage}
            name="file-upload"
            // accept="image/*"
          />
          {errors.image && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.image.message?.toString()}
            </div>
          )}
        </div>
        <div>
          <button
            disabled={imageLoading}
            type="submit"
            className={`btn btn-info btn-fill pull-right ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateOrder;
