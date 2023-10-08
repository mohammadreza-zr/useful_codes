import { IIcon, NestedObjectLeaves } from "@interfaces";
import { useFormik } from "formik";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
  Dispatch,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import {
  ActionMeta,
  GroupBase,
  MenuPosition,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
} from "react-select";

export interface IOnlyChildren {
  children?: ReactNode;
  className?: string;
}

export interface IModal<T = any> {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
  onClose?: () => void;
  body?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  size?: "xxl" | "xl" | "lg" | "md" | "sm";
  text?: string | ReactNode;
  bodyClass?: string;
  data?: T;
  loading?: boolean;
  full?: boolean;
}

export type IChangePasswordModal = IModal & {
  code: string;
};

export type ISelectBusinessModal = IModal;

export type ISendCodeModal = IModal & {
  setCode: Dispatch<SetStateAction<string>>;
  code: string;
};

export interface IAlertModal {
  isOpen?: boolean;
  colors?: colors;
  icon?: IIcon;
  title?: string;
  body?: string;
  buttonTitle?: string | boolean;
}

export type TPattern = "farsi" | "justNum" | "numAndFarsi" | "phone" | "maskedNumber";

export interface IFormikLabel {
  title: string | ReactNode;
  helper?: string;
  required?: boolean;
  className?: string;
  onClick?: () => void;
}

export type colors =
  | "main"
  | "green"
  | "red"
  | "gray"
  | "dark"
  | "yellow"
  | "white"
  | "light"
  | "danger"
  | "success";

export interface IFormikText
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  className?: string;
  inputClass?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  name: string;
  formik: ReturnType<typeof useFormik<any>>;
  onChange?: (value: any, op?: boolean) => void;
  pattern?: TPattern;
  parseToInt?: boolean;
  format?: (value: string) => string;
  rmFormat?: (value: string) => string;
  priceFormat?: boolean;
}

export interface IOTPInput {
  inputReference: RefObject<any>;
  inputReferenceIndex: number;
  letters: string[];
  setLetters: (value: SetStateAction<string[]>) => void;
  setCurrentIndex: (value: SetStateAction<number>) => void;
}

export interface IFormikMaskedText
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputPrefix?: ReactNode;
  className?: string;
  label?: string;
  name: string;
  formik: ReturnType<typeof useFormik<any>>;
  pattern?: TPattern;
  separator: string;
  parseToInt?: boolean;
}

export interface IFormikPrefixText
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  inputPrefix?: ReactNode;
  align?: "start" | "end" | "center";
  label?: string;
  inputPrefixDirection?: "ltr" | "rtl";
  formik?: ReturnType<typeof useFormik<any>>;
  name: string;
  pattern?: TPattern;
  preValue?: ReactNode;
  maxValue?: number;
  parseToInt?: boolean;
  prefixName?: string;
}

export interface IFormikButton {
  type?: "button" | "submit" | "reset";
  title?: string;
  className?: string;
  buttonClassName?: string;
  loading?: boolean;
  size?: "sm" | "lg" | "md";
  icon?: IIcon;
  color?: colors;
  showIconOnLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
}

export interface IFormikSelect {
  options: OptionsOrGroups<ISelectOption, GroupBase<ISelectOption>>;
  formik: any;
  onChange?: (newValue: SingleValue<ISelectOption>, actionMeta: ActionMeta<ISelectOption>) => void;
  name: string;
  className?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  noOptionsLabel?: string;
  defaultValue?: any;
  disable?: boolean;
  loading?: boolean;
  menuPosition?: MenuPosition;
  style?: any | CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface IFormikMultiSelect {
  options: OptionsOrGroups<ISelectOption, GroupBase<ISelectOption>>;
  formik: any;
  onChange?: (
    newValue: MultiValue<
      { label: any; value: any } | MultiValue<{ label: any; value: any }> | null
    >,
    actionMeta: ActionMeta<
      { label: any; value: any } | MultiValue<{ label: any; value: any }> | null
    >
  ) => void;
  name: string;
  className?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  noOptionsLabel?: string;
  disabled?: boolean;
}

export interface IFormikReactSelect {
  options: OptionsOrGroups<any, GroupBase<any>>;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  name?: string;
  label?: string;
  required?: boolean;
  onChange?: (value: any) => void;
}

export interface IFormikDatePicker {
  className?: string;
  label?: string;
  required?: boolean;
  formik?: any;
  fromToday?: boolean;
  disable?: boolean;
  name: string;
  placeholder?: string;
  minDate?: Date;
  size?: "md" | "sm" | "lg";
  hideHeaderPlugin?: boolean;
  onChange?: (selectedDate: { name: string; value: string }, op?: { name: string }) => void;
}

export interface ISelectOption {
  label: string;
  value: any;
}

export interface NameAndId {
  _id: string;
  name: string;
}

export interface IFormikRadio {
  formik?: ReturnType<typeof useFormik<any>>;
  noDefault?: boolean;
  className?: string;
  label?: string;
  name: string;
  options?: {
    label: string;
    color?: colors | string;
    subLabel?: string;
    icon?: IIcon | string;
    value: string | number | boolean;
    onClick?: () => void;
  }[];
  onChange?: (
    value: { name: string; value: string | number | boolean },
    op?: { name: string }
  ) => void;
  onChangeData?: (value: string | number | boolean) => void;
  value?: number | string;
  disabled?: boolean;
}

export interface IFormikCheckBox {
  formik?: any;
  noDefault?: boolean;
  className?: string;
  label?: string;
  name?: string;
  type?: string;
  options?: {
    label?: string;
    name?: string;
    color?: colors;
    subLabel?: string;
    icon?: IIcon;
    value?: string | number | boolean;
    onClick?: () => void;
  }[];
  onChangeClick?: any;
  values?: string[];
}

export interface IFormikSwitch {
  formik: any;
  onChange?: (value: { value: any; name: string }, op?: any) => void;
  name: string;
  className?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  checkedTitle?: string;
  unCheckedTitle?: string;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
}

export interface IFormikTimePicker {
  className?: string;
  label?: string;
  required?: boolean;
  formik?: any;
  fromToday?: boolean;
  name: string;
  minDate?: Date;
  size?: "md" | "sm" | "lg";
  placeholder?: string;
  style?: CSSProperties;
  onChange?: (selectedDate: { name: string; value: string }, op?: { name: string }) => void;
}

export interface IButton
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  color?: colors;
  loading?: boolean;
  formAction?: string;
}

export interface IIconButton
  extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  color?: colors;
  icon?: IIcon;
  className?: string;
}

export interface IImage<T>
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  name: keyof T;
  className?: string;
}

export interface IStepperStep {
  icon: JSX.Element;
  title: string;
  subTitle: string;
}

export interface IStepper {
  changeStepOnClick?: boolean;
  steps: IStepperStep[];
  step: number;
  setStep?: Dispatch<SetStateAction<number>>;
}

export interface INode {
  _id: string;
  title: string;
  name: string;
  headRole: null | string;
  type: "admin" | "realtor";
  child?: INode[];
}

export interface IObjectOfBoolean {
  [key: string]: boolean;
}

interface IFilterListBase<N> {
  name: N;
  label?: string;
  placeholder?: string;
}
type RequiredPropsByInputType<
  T extends "checkbox" | "radio" | "select" | "date",
  N
> = T extends "date"
  ? IFilterListBase<N> & {
      inputType: T;
      hideHeaderPlugin?: boolean;
    }
  : T extends "select"
  ? IFilterListBase<N> & {
      inputType: T;
      options: ISelectOption[];
    }
  : T extends "radio"
  ? IFilterListBase<N> & {
      inputType: T;
      radioOptions: {
        label: string;
        color?: string;
        subLabel?: string;
        icon?: IIcon | string;
        value: string | number | boolean;
        onClick?: () => void;
      }[];
    }
  : IFilterListBase<N> & { inputType: T };
export type IFilterList<N = any> = RequiredPropsByInputType<
  "checkbox" | "radio" | "select" | "date",
  NestedObjectLeaves<N>
>[];
