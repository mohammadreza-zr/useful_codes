import React, { CSSProperties, useState } from "react";

type TooltipProps = {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  disable?: boolean;
  styles?: CSSProperties;
  color?: "red";
  backgroundColor?: string;
  textColor?: string;
};

export function Tooltip({
  content,
  children,
  styles,
  position = "top",
  disable = false,
  color,
  backgroundColor,
  textColor,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(disable);

  const handleMouseEnter = () => {
    if (!disable) setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getTooltipStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      position: "absolute",
      backgroundColor: backgroundColor
        ? backgroundColor
        : color === "red"
        ? "var(--mainred)"
        : "black",
      color: textColor ? textColor : "white",
      padding: "0.5rem",
      borderRadius: "0.25rem",
      fontSize: "0.875rem",
      zIndex: 99999999999999,
      minWidth: "5rem",
      maxWidth: "20rem",
      width: "fit-content",
      visibility: isVisible ? "visible" : "hidden",
      transition: "all 300ms",
    };

    switch (position) {
      case "bottom":
        return {
          ...baseStyle,
          top: "110%",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "top":
        return {
          ...baseStyle,
          bottom: "130%",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          ...baseStyle,
          top: "50%",
          right: "110%",
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          ...baseStyle,
          top: "50%",
          left: "110%",
          transform: "translateY(-50%)",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} onMouseLeave={handleMouseLeave}>
      <div style={{ display: "inline-block" }} onMouseEnter={handleMouseEnter}>
        {children}
      </div>
      <div style={{ ...getTooltipStyle(), ...styles }}>
        <span
          style={{
            zIndex: "1",
            position: "relative",
            visibility: isVisible ? "visible" : "hidden",
          }}
        >
          {content}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "1rem",
            height: "1rem",
            transform: "translateX(-50%) rotate(45deg)",
            backgroundColor: backgroundColor
              ? backgroundColor
              : color === "red"
              ? "var(--mainred)"
              : "black",
            position: "absolute",
            bottom: "-0.25rem",
            left: "50%",
            zIndex: "0",
            visibility: isVisible ? "visible" : "hidden",
          }}
        ></span>
      </div>
    </div>
  );
}
