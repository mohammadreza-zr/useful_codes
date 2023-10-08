import { useClickOutside } from "@hooks";
import { ImageCompressor, classNames, getFullURL, unknownPath } from "@utilities";
import { useFormik } from "formik";
import { IUploadDocs } from "pages/personnel/personnelList/components/Table";
import { FC, useEffect, useRef, useState } from "react";
import { IconButton } from "../IconButton";
import {
  actionContainer,
  description,
  fullScreenContainer,
  fullScreenContainerHidden,
  fullScreenContainerShow,
  fullScreenImage,
  fullScreenImageBackground,
  image,
  imageContainer,
  imageNormal,
  imageSelected,
  imageSelector,
  imageSelectorLabel,
  imageSelectorLabelProcess,
  imageShow,
} from "./ImageSelector.module.scss";

interface Props {
  title: string;
  Formik?: ReturnType<typeof useFormik<IUploadDocs>>;
  name: keyof IUploadDocs;
  accept?: string;
  disabled?: boolean;
}
export const ImageSelector: FC<Props> = ({ title, Formik, name, accept, disabled }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const fullScreenRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef<any>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [processing, setProcessing] = useState(0);
  const [isProcessingDone, setIsProcessingDone] = useState(true);

  useClickOutside(fullScreenRef, () => {
    if (isFullScreen) setIsFullScreen(false);
  });

  const getText = () => {
    if (processing === -1) {
      return "پردازش انجام شد";
    } else if (isProcessingDone) {
      return "انتخاب فایل";
    } else if (processing >= 0 && processing <= 100) {
      return `در حال دردازش ${processing}%`;
    }
  };

  useEffect(() => {
    if (Formik) {
      const file = unknownPath(Formik?.values, name);
      if (typeof file === "string") {
        setImageSrc(getFullURL(unknownPath(Formik.values, name) ?? "") ?? "");
      } else if (file !== undefined) {
        setImageSrc(URL.createObjectURL(unknownPath(Formik.values, name) ?? "") ?? "");
      }
    }
    return () => {};
  }, [unknownPath(Formik?.values, name)]);

  return (
    <div className={imageSelector}>
      <div className={description}>
        <p>{title}</p>
        <p>پسوند های فایل png, jpg, jpeg</p>
      </div>
      <label className={classNames(imageSelectorLabel)}>
        <span
          className={classNames(imageSelectorLabelProcess)}
          style={{
            width: `${processing}%`,
          }}
        ></span>
        <p
          style={{
            color: !isProcessingDone ? "gray" : "black",
          }}
        >
          {getText()}
        </p>
        <input
          type="file"
          name={name}
          accept={accept ? accept : `image/png, image/jpg, image/jpeg`}
          className="d-none"
          onChange={(e) => {
            if (e.currentTarget.files?.[0]) {
              setIsProcessingDone(false);
              Formik?.setFieldValue(name, e.currentTarget.files[0]);
              const src = URL.createObjectURL(e.currentTarget.files[0]);
              if (imageRef.current) {
                imageRef.current.src = src;
              }
              setImageSrc(src);
              ImageCompressor({
                file: e?.currentTarget?.files[0],
                callback: (file) => {
                  Formik?.setFieldValue(name, file);
                  const names = [...(Formik?.values.isChanged ?? []), name];
                  Formik?.setFieldValue("isChanged", names);
                },
                onProgress(progress) {
                  setProcessing(progress);
                  if (progress === 100) {
                    setProcessing(-1);
                    setIsProcessingDone(true);
                    setTimeout(() => {
                      setProcessing(0);
                    }, 700);
                  }
                },
              });
            }
          }}
          disabled={disabled || !isProcessingDone}
        />
      </label>
      <div className={imageContainer}>
        <img
          src={imageSrc ?? ""}
          alt=""
          ref={imageRef}
          className={classNames(image, imageNormal, {
            show: imageSrc ? imageSelected : "",
          })}
          onError={(e) => {
            e.currentTarget.style.display = "none !important";
          }}
        />
      </div>
      <div className={actionContainer}>
        <IconButton
          icon="icon-fullscreen"
          onClick={() => {
            if (imageSrc) {
              isFirstRender.current = true;
              setIsFullScreen(true);
            }
          }}
        />
        <IconButton
          icon="icon-trash"
          color="red"
          onClick={() => {
            setImageSrc("");
            setIsFullScreen(false);
            Formik?.setFieldValue(name, undefined);
          }}
        />
      </div>
      <div
        className={classNames(fullScreenContainer, {
          show: isFullScreen ? imageShow : "",
          showing: isFullScreen
            ? fullScreenContainerShow
            : isFirstRender.current
            ? fullScreenContainerHidden
            : "",
        })}
        ref={fullScreenRef}
      >
        <span className={fullScreenImageBackground}></span>
        <img
          src={imageSrc ?? ""}
          alt=""
          className={classNames(fullScreenImage, {
            show: isFullScreen ? imageSelected : "",
          })}
          onError={(e) => {
            e.currentTarget.style.display = "none !important";
          }}
        />
        <div
          className={classNames(actionContainer)}
          style={{
            display: isFullScreen ? "block" : "none",
          }}
        >
          <IconButton
            icon="icon-close"
            color="red"
            onClick={() => {
              setIsFullScreen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
