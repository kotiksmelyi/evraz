export interface IPageResult<Item> {
  items: Item[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface IPageQuery {
  page: number;
  size: number;
}
