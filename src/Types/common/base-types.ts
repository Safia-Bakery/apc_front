interface BaseParams {
  enabled?: boolean;
  page?: number;
  size?: number;
}
type BasePaginateRes<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
};
