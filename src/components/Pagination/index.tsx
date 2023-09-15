import { FC } from "react";
import ReactPaginate from "react-paginate";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import useQueryString from "src/hooks/useQueryString";

interface PaginationProps {
  totalPages?: number;
  refetch?: () => void;
}

const Pagination: FC<PaginationProps> = ({ totalPages }) => {
  const navigate = useNavigateParams();
  const currentPage = Number(useQueryString("page")) || 1;
  const handleChange = ({ selected }: { selected: number }) =>
    navigate({ page: selected + 1 });

  return (
    <nav>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        previousLinkClassName="page-link"
        previousClassName="page-item"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        onPageChange={handleChange}
        pageRangeDisplayed={2}
        className="pagination"
        activeClassName="active"
        pageLinkClassName="page-link"
        pageCount={totalPages!}
        pageClassName={`page-item`}
        previousLabel="<"
        renderOnZeroPageCount={null}
        forcePage={currentPage - 1}
      />
    </nav>
  );
};

export default Pagination;
