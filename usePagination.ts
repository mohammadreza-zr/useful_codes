import { DataTableRef } from "@components";
import { ISelectOption } from "@interfaces";
import { useFormik } from "formik";
import { KeyboardEvent, RefObject, useRef, useState } from "react";
import { ActionMeta } from "react-select";

export interface KeyValue {
  [key: string]: string | boolean;
}

export const usePagination = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sort, setSort] = useState<string>("-date");
  const [search, setSearchState] = useState<KeyValue>({});
  const [fields, setFields] = useState({});
  const [callback, setCallback] = useState(false);
  const searchSave = useRef<null | typeof search>(search);
  const fieldsSave = useRef<null | typeof fields>(fields);

  /**
   * add in onChange event on customized components and done
   *
   * add dot for separate key with brackets [] like this: obj.key.otherKey => obj[key][otherKey] : value
   * @param e event or object with value property
   * @param op select options or object with name property
   */
  const setFilter = (e: any, op?: boolean | ActionMeta<ISelectOption>) => {
    const options = op as any;
    const isHaveDot =
      !!options?.name?.split?.(".")?.[1] || !!options?.target?.name?.split?.(".")?.[1];

    let name = "";
    let value = "";

    if (isHaveDot) {
      const data = options?.name ? options?.name : options?.target?.name;
      let split = data;
      split = split.split(".").slice(1);
      const arr: string[] = [];
      split.forEach((element: any) => {
        arr.push(`[${element}]`);
      });
      name = `${data.split(".")[0]}${arr.join("")}`;
    } else {
      if (typeof op === "boolean") {
        name = `${e.target?.name}[regex]`;
      } else {
        if (op?.name) name = op.name;
      }
    }

    if (typeof op === "boolean") {
      value = e.target?.value;
    } else {
      value = e.value;
    }

    fieldsSave.current = {
      ...fieldsSave.current,
      ...fields,
      [name]: value,
    };
  };

  const resetFilter = (formik?: ReturnType<typeof useFormik<any>>, stopCallback?: boolean) => {
    fieldsSave.current = {};
    setFields({});
    formik?.resetForm();
    if (!stopCallback) setCallback(!callback);
  };

  /**
   * add in onChange event on customized components and done
   *
   * add dot for separate key with brackets [] like this: obj.key.otherKey => obj[key][otherKey] : value
   * @param e event or object with value property
   * @param op select options or object with name property
   */
  const setSearch = (e: any, op?: boolean | ActionMeta<ISelectOption>) => {
    const options = op as any;
    const isHaveDot =
      typeof op === "boolean"
        ? !!e.target?.name?.split(".")?.[1]
        : !!options?.name?.split?.(".")?.[1] || !!options?.target?.name?.split?.(".")?.[1];

    console.log(isHaveDot, op);

    let name = "";
    let value = "";

    if (isHaveDot) {
      const data =
        typeof op === "boolean"
          ? e.target.name
          : options?.name
          ? options?.name
          : options?.target?.name;
      let split = data;
      split = split.split(".").slice(1);
      const arr: string[] = [];
      split.forEach((element: any) => {
        arr.push(`[${element}]`);
      });
      name = `${data.split(".")[0]}${arr.join("")}${typeof op === "boolean" ? "[regex]" : ""}`;
    } else {
      if (typeof op === "boolean") {
        name = `${e.target?.name}[regex]`;
      } else {
        if (op?.name) name = op.name;
      }
    }

    if (typeof op === "boolean") {
      value = e.target?.value;
    } else {
      value = e.value;
    }

    searchSave.current = {
      ...searchSave.current,
      ...search,
      [name]: value,
    };
  };

  const resetSearch = (formik?: ReturnType<typeof useFormik<any>>, stopCallback?: boolean) => {
    searchSave.current = {};
    setSearchState({});
    formik?.resetForm();
    if (!stopCallback) setCallback(!callback);
  };

  /**
   * after change all filters and searches call this function for apply in state
   * @param ref ref of table for reset pages and limits from start
   */
  const applySearch = (ref?: DataTableRef) => {
    if (searchSave.current) setSearchState(searchSave.current);
    if (fieldsSave.current) setFields(fieldsSave.current);
    ref?.setPagination?.({ pageSize: 20, startIndex: 0, page: 1 });
  };

  const resetAll = (formik?: ReturnType<typeof useFormik<any>>) => {
    resetFilter(formik);
    resetSearch(formik, true);
  };

  const applyOnEnter = (e: KeyboardEvent<HTMLInputElement>, ref?: RefObject<DataTableRef>) => {
    if (e.key === "Enter") {
      applySearch((ref as any)?.current);
    }
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    search,
    setSearch,
    fields,
    setFields,
    setFilter,
    setSearchState,
    applySearch,
    resetSearch,
    resetFilter,
    resetAll,
    searchLength: Object.keys(search).length,
    filterLength: Object.keys(fields).length,
    callback,
    applyOnEnter,
  };
};
