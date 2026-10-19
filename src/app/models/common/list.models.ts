export interface ListQueryType<F> {
  page: number;
  pageSize: number;
  filters: F;
}

export interface ListPageType<T> {
  items: T[];
  total: number;
}
