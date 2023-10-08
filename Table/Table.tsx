import Table from "rc-table";
import { TableProps } from "rc-table/lib/Table";
import { DefaultRecordType } from "rc-table/lib/interface";
import {
  ForwardedRef,
  ReactNode,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import ReactSelect from "react-select";

import { selectStyles, selectTheme } from "@config";
import { unknownPath } from "@utilities";
import { Loading } from "../Loading";
import { Pagination } from "../Pagination";
import "./Table.styles.scss";

export interface DataTablePagination {
  /** 10 20 30 40... */
  pageSize: number;
  /** 0 10 20 30 40... */
  startIndex: number;
  // 1 2 3
  page: number;
}

export interface DataTableProps<TRecordType extends DefaultRecordType> {
  /** @see TableProps */
  table: TableProps<TRecordType>;
  total?: number;
  xScroll?: number;
  loading?: boolean;
  onPaginationChange?: (pagination: DataTablePagination) => void;
  sticky?: boolean;
  lineNumbers?: boolean;
  showPagination?: boolean;
  head?: ReactNode;
  className?: string;
  scrollRef?: RefObject<HTMLDivElement>;
}

export interface DataTableRef {
  setPagination: (pag: Partial<DataTablePagination>) => void;
}

function CustomTableRenderFn<TRecordType extends DefaultRecordType>(
  {
    table,
    total = 0,
    xScroll = 280,
    loading = false,
    onPaginationChange,
    sticky = false,
    lineNumbers = true,
    showPagination = true,
    scrollRef,
    head,
    className,
  }: DataTableProps<TRecordType>,
  ref: ForwardedRef<DataTableRef>
) {
  const [pagination, setPagination] = useState<DataTablePagination>({
    pageSize: 20,
    startIndex: 0,
    page: 1,
  });
  const {
    pageSize, // 10 20 30 40...
    startIndex, // 0 10 20 30 40...
  } = pagination;
  const page = Math.round(startIndex / pageSize + 1); // 1 2 3 4...

  // default values
  table = {
    emptyText: "داده ای یافت نشد",
    ...table,
    //add column index
    columns: [
      // {
      //   title: "ردیف",
      //   key: "column",
      //   render: (_, __, i) => <>{1 + i + startIndex}</>,
      // },
      ...(lineNumbers
        ? [
            {
              title: "#",
              key: "column",
              render: (_: any, __: any, i: number) => <>{1 + i + startIndex}</>,
            },
          ]
        : []),

      ...(table?.columns?.map((column) => {
        if ((column as any).dataIndex) {
          if ((column as any).render) {
            return {
              ...column,
              render: (_: any, __: any, i: number) =>
                (column as any).render(
                  unknownPath(table.data?.[i], (column as any).dataIndex),
                  __,
                  i
                ),
            };
          }
          return {
            ...column,
            render: (_: any, __: any, i: number) =>
              unknownPath(table.data?.[i], (column as any).dataIndex),
          };
        } else {
          return column;
        }
      }) ?? []),
    ],
  };

  useImperativeHandle(
    ref,
    () => ({
      setPagination: (pag: Partial<DataTablePagination>) => paginate(pag),
    }),
    []
  );

  function paginate(pag: Partial<DataTablePagination>) {
    setPagination((current) => {
      const res = {
        ...current,
        ...pag,
      };

      onPaginationChange?.(res);

      return res;
    });
  }

  //add index key
  const data = table.data?.map((item, i) => ({ ...item, key: item._id ? item._id : i })) ?? [];

  return (
    <div className="custom-table table-mlk">
      {head}
      <div className={`body table ${className}`}>
        <Table
          rowClassName={(record) => record.className}
          {...table}
          data={data}
          scroll={{ x: xScroll }}
          sticky={sticky}
        />
        <Loading show={loading} />
      </div>
      {showPagination && (
        <div className="foot">
          <div className="options-table form-no-icon d-flex align-items-center justify-content-between w-100">
            <div className="form-select-base form-edit-select mb-0 mt-0">
              <ReactSelect
                onChange={(e) => {
                  if (e?.value !== pageSize) {
                    if (scrollRef?.current) window.scrollTo(0, scrollRef.current.offsetTop);
                    else window.scroll(0, 0);
                    paginate({ startIndex: 0, pageSize: e?.value, page });
                  }
                }}
                theme={selectTheme}
                styles={selectStyles}
                value={{
                  label: `نمایش ${pagination.pageSize - 19} تا ${pagination.pageSize}`,
                  value: pagination.pageSize,
                }}
                options={[
                  {
                    value: 20,
                    label: "نمایش 1 تا 20",
                  },
                  {
                    value: 40,
                    label: "نمایش 21 تا 40",
                  },
                  {
                    value: 60,
                    label: "نمایش 41 تا 60",
                  },
                  {
                    value: 80,
                    label: "نمایش 61 تا 80",
                  },
                ]}
              />
            </div>
            <Pagination
              totalPages={total}
              currentPage={page}
              onPageChange={(changedPage: number) => {
                if (page !== changedPage) {
                  if (scrollRef?.current) window.scrollTo(0, scrollRef.current.offsetTop);
                  else window.scroll(0, 0);
                  paginate({
                    startIndex: pageSize * (changedPage - 1),
                    pageSize,
                    page: changedPage,
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
/**
 * Based on rc-table
 *
 * Paging only shows you where you are, so pagination needs to be done in the backend or managed by yourself.
 *
 * Default pageSize: 20, default startIndex: 0, default page: 1
 */
export const CustomTable = forwardRef(CustomTableRenderFn) as <
  TRecordType extends DefaultRecordType
>(
  p: DataTableProps<TRecordType> & { ref?: ForwardedRef<DataTableRef> }
) => JSX.Element;
