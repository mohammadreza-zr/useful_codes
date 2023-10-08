import { FC, Fragment } from "react";
import { Link } from "react-router-dom";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const generatePages = () => {
    const pageArray: any[] = [];

    if (currentPage > 1) {
      pageArray.push(1);
    }

    if (currentPage > 3) {
      pageArray.push("...");
    }

    if (currentPage > 2) {
      pageArray.push(currentPage - 1);
    }

    pageArray.push(currentPage);

    if (currentPage < totalPages - 1) {
      pageArray.push(currentPage + 1);
    }
    if (currentPage < totalPages - 2) {
      pageArray.push(currentPage + 2);
    }

    if (currentPage < totalPages - 3) {
      pageArray.push("...");
    }

    if (currentPage < totalPages) {
      pageArray.push(totalPages);
    }

    return pageArray;
  };

  const handleClick = (page: number) => {
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pages = generatePages();

  return (
    <nav aria-label="...">
      <ul className="pagination pagination-sm">
        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
          <Link to={"#"} className="page-link" onClick={handlePrev}>
            <i className="icon-arrow"></i>
          </Link>
        </li>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page === "..." ? (
              // eslint-disable-next-line jsx-a11y/role-supports-aria-props
              <li className="page-item" aria-disabled="true">
                <Link to={"#"} className="page-link">
                  ...
                </Link>
              </li>
            ) : (
              <li className={`page-item ${currentPage === page && "active"}`} aria-current="page">
                <Link to={"#"} className="page-link" onClick={() => handleClick(page)}>
                  {page}
                </Link>
              </li>
            )}
          </Fragment>
        ))}
        <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
          <Link to={"#"} className="page-link" onClick={handleNext}>
            <i className="icon-arrow"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
