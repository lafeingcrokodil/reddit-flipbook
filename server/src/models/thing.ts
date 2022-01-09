export type Thing = string | {
  kind: string;
  data: {
    children: Thing[];
    [key: string]: any;
  }
};
