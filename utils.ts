import { forEach, map, split } from "lodash";

export const unknownPath = (target: any, path?: string) => {
  const splitPath = split(path, ".");
  let shifting = target;
  forEach(splitPath, (pathItem) => (shifting ? (shifting = shifting[pathItem]) : ""));
  return shifting;
};

export const mapDataToSelectData = <T = any>(
  data?: any[],
  labelField?: keyof T,
  valueField?: keyof T
) => {
  return data
    ? map(data, (item) => {
        return {
          label: unknownPath(item, labelField as any),
          value: unknownPath(item, valueField as any),
        };
      })
    : [];
};
