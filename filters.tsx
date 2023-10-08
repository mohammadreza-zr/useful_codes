import {
  DataTableRef,
  FormikDatePicker,
  FormikLabel,
  FormikRadio,
  FormikSelect,
  FormikSwitch,
} from "@components";
import { IFilterList } from "@interfaces";
import { unknownPath } from "@utilities";
import { useFormik } from "formik";
import { Fragment, useEffect } from "react";

export const Filters = ({
  callback,
  setFilter,
  filterList,
  Formik,
}: {
  applySearch?: (ref?: DataTableRef) => void;
  filterList: IFilterList;
  setFilter: any;
  callback: any;
  Formik: ReturnType<typeof useFormik<any>>;
}) => {
  useEffect(() => {
    Formik.resetForm();
  }, [callback]);

  const getInput = (item: IFilterList[0]) => {
    switch (item.inputType) {
      case "checkbox":
        return (
          <>
            <div className={`form-select-base col-12 col-md-4 col-lg-3 mgb-10 text-right`}>
              <FormikSwitch
                formik={Formik}
                name={item.name}
                label={item.label}
                placeholder={item.placeholder}
                onChange={setFilter}
              />
            </div>
          </>
        );

      case "date":
        return (
          <>
            <div className="form-select-base form-no-icon col-12 col-md-4 col-lg-3">
              <FormikDatePicker
                formik={Formik}
                name={item.name}
                label={item.label}
                placeholder={item.placeholder}
                onChange={setFilter}
                hideHeaderPlugin={item.hideHeaderPlugin}
              />
            </div>
          </>
        );

      case "radio":
        return (
          <>
            <div className="form-select-base form-no-icon col-12 col-md-4 col-lg-3 d-flex align-items-center">
              <FormikLabel className="form-select-base pdr-0" title={item.label} />
              <FormikRadio
                name={item.name}
                formik={Formik}
                options={item.radioOptions ?? []}
                value={unknownPath(Formik?.values, item.name)}
                onChange={setFilter}
                className="list-pay-buyer radio-row"
              />
            </div>
          </>
        );
      case "select":
        return (
          <>
            <div className="form-select-base form-no-icon col-12 col-md-4 col-lg-3">
              <FormikSelect
                options={item.options ?? []}
                formik={Formik}
                name={item.name}
                placeholder={item.placeholder}
                label={item.label}
                onChange={setFilter}
              />
            </div>
          </>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="row px-5 pb-5">
      {filterList.map((item, i) => {
        return <Fragment key={i}>{getInput(item)}</Fragment>;
      })}
    </div>
  );
};
