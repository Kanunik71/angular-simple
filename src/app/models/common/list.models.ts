export interface ListQueryModel<F> {
  page: number;
  pageSize: number;
  filters: F;
}

export interface ListPageModel<T> {
  items: T[];
  total: number;
}
