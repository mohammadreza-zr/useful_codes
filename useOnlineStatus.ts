import { setOnlineStatus, useAppDispatch, useAppSelector } from "@store";
import { useEffect } from "react";

export const useOnlineStatus = () => {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector((state) => state.portal.isOnline);

  useEffect(() => {
    window.addEventListener("offline", function () {
      dispatch(setOnlineStatus(false));
    });

    window.addEventListener("online", function () {
      dispatch(setOnlineStatus(true));
    });

    return () => {
      window.removeEventListener("offline", () => {});
      window.removeEventListener("online", () => {});
    };
  }, []);

  return {
    isOnline,
  };
};
