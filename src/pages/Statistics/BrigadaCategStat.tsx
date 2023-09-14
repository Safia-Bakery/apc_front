import { Departments, Order, Sphere } from "src/utils/types";
import useStatsBrigadaCateg from "src/hooks/useStatsBrigadaCateg";
import useQueryString from "src/hooks/useQueryString";
import Loading from "src/components/Loader";
import { FC } from "react";

const column = [
  { name: "№", key: "id" as keyof Order["id"] },
  { name: "Бригада", key: "purchaser" as keyof Order["status"] },
  { name: "Категория", key: "category" as keyof Order["status"] },
  {
    name: "Кол-во",
    key: "qnt" as keyof Order["status"],
  },
  {
    name: "Среднее обработка заявков (мин)",
    key: "duration" as keyof Order["status"],
  },
];
interface Props {
  sphere_status: Sphere;
}

const BrigadaCategStat: FC<Props> = ({ sphere_status }) => {
  const start = useQueryString("start");
  const end = useQueryString("end");
  const { isLoading, data } = useStatsBrigadaCateg({
    department: Departments.apc,
    sphere_status,
    ...(!!start && { started_at: start }),
    ...(!!end && { finished_at: end }),
  });

  const calculator = (idx: number, arr: any[]) => {
    const sumWithInitial = arr.reduce(
      (accumulator, currentValue) => accumulator + currentValue[idx],
      0
    );

    return sumWithInitial;
  };
  return (
    <>
      <table className="table table-bordered w-100 border-dark">
        <thead>
          <tr>
            {column.map(({ name, key }) => (
              <th key={key} className={"border-dark"}>
                {name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
          {data &&
            Object.keys(data)?.map((mainKey: string, idx) => (
              <tr key={mainKey} className="bg-blue mb-2 ">
                <td className="border-dark" width="40">
                  {idx + 1}
                </td>

                <td className="border-dark">{mainKey}</td>
                <td className="p-0 border-dark">
                  <div className="d-flex flex-column">
                    {data?.[mainKey]?.map((categ, idx) => (
                      <span
                        key={idx}
                        className="border-bottom py-2 px-1 border-dark"
                      >
                        {categ[1]}
                      </span>
                    ))}
                    <span className="border-bottom py-2 px-1 text-center font-weight-bold">
                      Общее
                    </span>
                  </div>
                </td>

                <td className="p-0 border-dark">
                  <div className="d-flex flex-column border-dark">
                    {data[mainKey]?.map((qnt, idx) => (
                      <span
                        key={idx}
                        className="border-bottom text-center py-2 px-1 border-dark"
                      >
                        {qnt[2]}
                      </span>
                    ))}
                    <span className=" py-2 px-1 text-center font-weight-bold ">
                      {calculator(2, data[mainKey])}
                    </span>
                  </div>
                </td>

                <td className="p-0 border-dark">
                  <div className="d-flex flex-column">
                    {data[mainKey]?.map((timer, idx) => (
                      <span
                        key={idx}
                        className="border-bottom py-2 px-1 text-center border-dark"
                      >
                        {timer[3]}
                      </span>
                    ))}
                    <span className="border-bottom py-2 px-1 text-center font-weight-bold">
                      {calculator(3, data[mainKey])}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* <Chart
        options={options}
        series={series}
        type="pie"
        // width={380}
        height={400}
      /> */}
      {!data && !isLoading && (
        <div className="w-100">
          <p className="text-center w-100 ">Спосок пуст</p>
        </div>
      )}
    </>
  );
};

export default BrigadaCategStat;
