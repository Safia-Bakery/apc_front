import useQueryString from "src/hooks/useQueryString";
import { itemsPerPage } from "src/utils/helpers";

interface ItemsTypes {
  data: { items: any[]; total: number } | undefined;
}

const ItemsCount = ({ data }: ItemsTypes) => {
  const currentPage = Number(useQueryString("page")) || 1;
  if (!data) {
    return null;
  }

  const { total } = data;

  const indexOfLastItem = Math.min(currentPage * itemsPerPage, total);
  const indexOfFirstItem = Math.min(
    (currentPage - 1) * itemsPerPage + 1,
    total
  );

  return (
    <div>
      Показаны записи{" "}
      <b>
        {indexOfFirstItem}-{indexOfLastItem === 0 ? 0 : indexOfLastItem}
      </b>{" "}
      из <b>{total}</b>.
    </div>
  );
};

export default ItemsCount;
