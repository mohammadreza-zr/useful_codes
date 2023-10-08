import { ColumnType, DefaultRecordType } from "rc-table/lib/interface";

export interface IColumnType<TRecordType extends DefaultRecordType>
  extends ColumnType<TRecordType> {
  dataIndex?: NestedObjectPaths<TRecordType & { action?: any }>;
}

export type IColumnsType<IRecordType extends DefaultRecordType> =
  readonly IColumnType<IRecordType>[];

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], any[D]>> : never;
    }[keyof T]
  : "";

export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], any[D]>> }[keyof T]
  : "";

export type NestedObjectPaths<T> = Paths<T>;
export type NestedObjectLeaves<T> = Leaves<T>;

// const t = {
//   a: 'f',
//   b: {
//     c:'2',
//     d:'3'
//   }
// }
// const f: NestedObjectLeaves<typeof t> = 'b.c'
