import { FormikLabel } from "@components";
import { useFormik } from "formik";
import React, { RefObject, useEffect, useRef, useState } from "react";

export interface IPInputRef {
  reset?: () => void;
}
interface IPInputProps {
  onSubmit?: (ip: string) => void;
  isValid?: (status: boolean) => void;
  label: string;
  name: string;
  required?: boolean;
  formik?: ReturnType<typeof useFormik<any>>;
  className?: string;
}

export function IPInput({
  onSubmit,
  label,
  formik,
  name,
  required,
  className,
  isValid,
}: IPInputProps) {
  const [octet1, setOctet1] = useState("");
  const [octet2, setOctet2] = useState("");
  const [octet3, setOctet3] = useState("");
  const [octet4, setOctet4] = useState("");

  const octet1Ref = useRef<HTMLInputElement>(null);
  const octet2Ref = useRef<HTMLInputElement>(null);
  const octet3Ref = useRef<HTMLInputElement>(null);
  const octet4Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formik?.values?.[name]) {
      const octets = formik.values[name]?.split(".");
      setOctet1(parseInt(octets?.[0], 10).toString());
      setOctet2(parseInt(octets?.[1], 10).toString());
      setOctet3(parseInt(octets?.[2], 10).toString());
      setOctet4(parseInt(octets?.[3], 10).toString());
    }
    return () => {};
  }, [formik?.values?.[name]]);

  const separateOctets = (ip: string) => {
    const octets = ip.split(".");
    setOctet1(parseInt(octets[0], 10).toString());
    setOctet2(parseInt(octets[1], 10).toString());
    setOctet3(parseInt(octets[2], 10).toString());
    setOctet4(parseInt(octets[3], 10).toString());
    const validateList = new Array(4).fill(false);
    octets.forEach((item, i) => {
      if (item.length !== 0 && validateIP(item)) {
        validateList[i] = true;
      } else {
        validateList[i] = false;
      }
    });
    formik?.setFieldValue(name, ip);
    if (validateList.every((item) => item === true)) {
      onSubmit?.(ip);
      isValid?.(true);
    } else {
      isValid?.(false);
    }
  };

  const handleOctet1Change = (value: string) => {
    value = value.toString();
    if (value.length <= 3) {
      const newIP = `${value}.${octet2}.${octet3}.${octet4}`;
      separateOctets(newIP);
      if (validateIP(value)) {
        if (octet1Ref.current) octet1Ref.current.style.borderColor = "rgba(176, 190, 197, 0.6)";
        if (value.length === 3 || value === "0" || value.split("").includes(".")) {
          if (value.split("").includes(".")) {
            handleOctet2Change(value.split(".")[1]);
          }
          octet2Ref.current?.focus();
        }
      } else {
        if (octet1Ref.current) octet1Ref.current.style.borderColor = "red";
      }
    }
  };

  const handleOctet2Change = (value: string) => {
    value = value.toString();
    if (value.length <= 3) {
      const newIP = `${octet1}.${value}.${octet3}.${octet4}`;
      separateOctets(newIP);
      if (validateIP(value)) {
        if (octet2Ref.current) octet2Ref.current.style.borderColor = "rgba(176, 190, 197, 0.6)";
        if (value.length === 3 || value === "0" || value.split("").includes(".")) {
          if (value.split("").includes(".")) {
            handleOctet3Change(value.split(".")[1]);
          }
          octet3Ref.current?.focus();
        }
      } else {
        if (octet2Ref.current) octet2Ref.current.style.borderColor = "red";
      }
    }
  };

  const handleOctet3Change = (value: string) => {
    value = value.toString();
    if (value.length <= 3) {
      const newIP = `${octet1}.${octet2}.${value}.${octet4}`;
      separateOctets(newIP);
      if (validateIP(value)) {
        if (octet3Ref.current) octet3Ref.current.style.borderColor = "rgba(176, 190, 197, 0.6)";
        if (value.length === 3 || value === "0" || value.split("").includes(".")) {
          if (value.split("").includes(".")) {
            handleOctet4Change(value.split(".")[1]);
          }
          octet4Ref.current?.focus();
        }
      } else {
        if (octet3Ref.current) octet3Ref.current.style.borderColor = "red";
      }
    }
  };

  const handleOctet4Change = (value: string) => {
    value = value.toString();

    if (value.length <= 3) {
      const newIP = `${octet1}.${octet2}.${octet3}.${value}`;
      separateOctets(newIP);
      if (validateIP(value)) {
        if (octet4Ref.current) octet4Ref.current.style.borderColor = "rgba(176, 190, 197, 0.6)";
      } else {
        if (octet4Ref.current) octet4Ref.current.style.borderColor = "red";
      }
    }
  };

  const validateIP = (value: string) => {
    const octet = parseInt(value, 10);
    if (isNaN(octet) || octet < 0 || octet > 255) {
      return false;
    }
    return true;
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    ref: RefObject<HTMLInputElement>
  ) => {
    const { key } = event;
    if ((key === "Backspace" || key === "Delete") && event.currentTarget.value.length === 0) {
      ref.current?.focus();
    }
  };

  return (
    <div className={className}>
      <FormikLabel title={label} required={required} />
      <div className="form-row row flex-row-reverse col-12 m-0">
        <div className="form-group col-3 p-0">
          <input
            ref={octet1Ref}
            type="number"
            className="form-control"
            value={octet1 ?? ""}
            onChange={(e) => handleOctet1Change(e.target.value)}
            placeholder="127"
            maxLength={3}
            dir="ltr"
            style={{
              padding: "12px",
              height: "45px",
              textAlign: "start",
              border: "1px solid rgba(176, 190, 197, 0.6)",
            }}
          />
        </div>
        <div className="form-group col-3 p-0 px-1">
          <input
            ref={octet2Ref}
            type="number"
            className="form-control"
            value={octet2 ?? ""}
            onChange={(e) => handleOctet2Change(e.target.value)}
            placeholder="0"
            maxLength={3}
            dir="ltr"
            onKeyDown={(e) => handleKeyDown(e, octet1Ref)}
            style={{
              padding: "12px",
              height: "45px",
              textAlign: "start",
              border: "1px solid rgba(176, 190, 197, 0.6)",
            }}
          />
        </div>
        <div className="form-group col-3 p-0">
          <input
            ref={octet3Ref}
            type="number"
            className="form-control"
            value={octet3 ?? ""}
            onChange={(e) => handleOctet3Change(e.target.value)}
            placeholder="0"
            maxLength={3}
            dir="ltr"
            onKeyDown={(e) => handleKeyDown(e, octet2Ref)}
            style={{
              padding: "12px",
              height: "45px",
              textAlign: "start",
              border: "1px solid rgba(176, 190, 197, 0.6)",
            }}
          />
        </div>
        <div className="form-group col-3 p-0 ps-1">
          <input
            ref={octet4Ref}
            type="number"
            className="form-control"
            value={octet4 ?? ""}
            onChange={(e) => handleOctet4Change(e.target.value)}
            placeholder="0"
            maxLength={3}
            dir="ltr"
            onKeyDown={(e) => handleKeyDown(e, octet3Ref)}
            style={{
              padding: "12px",
              height: "45px",
              textAlign: "start",
              border: "1px solid rgba(176, 190, 197, 0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default IPInput;
