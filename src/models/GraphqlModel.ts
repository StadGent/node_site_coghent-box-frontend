import { MediaFile } from 'coghent-vue-3-component-library/lib/queries';
import { Metadata, Relation } from './CollectionModel';

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
export type Entity = {
  id: string;
  type: string;
  metadata: Array<Metadata>;
  title: Array<Metadata>;
  relations?: Array<Relation[]>;
  mediafiles?: Array<MediaFile>;
};
