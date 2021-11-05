export type SearchFilter = {
  value?: String;
  isAsc?: Boolean;
  key?: String;
  raw?: Boolean;
  relation_filter?: [String];
  type?: String;
};

export type FullEntitiesQuery = {
  limit?: number | null | undefined;
  skip?: number | null | undefined;
  searchValue: SearchFilter;
  fetchPolicy?: string | null | undefined;
};

export type ComponentRelation = {
  key: string;
  type: string;
  order: number;
};