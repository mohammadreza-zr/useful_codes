import { BASE_URL } from "@constants";

export const getFullURL = (url: string) => {
  return `${BASE_URL?.trim()?.replace(/\/+$/, "")}/${url
    ?.toString()
    .trim()
    ?.replace(/^\/|\/$/g, "")}`;
};
