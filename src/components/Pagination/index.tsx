import { FC } from "react";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import useQueryString from "src/hooks/useQueryString";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  refetch?: () => void;
}

const Pagination: FC<PaginationProps> = ({ totalItems, itemsPerPage }) => {
  const navigate = useNavigateParams();
  const currentPage = Number(useQueryString("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handleChange = (page: number) => navigate({ page });

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handleChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
