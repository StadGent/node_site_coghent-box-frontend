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

export type Story = {
  id: string;
  type: string;
  title: Array<Metadata>;
  metadata: Array<Metadata>;
  mediafiles: Array<Mediafiles>;
  frames: Array<Frame>;
};

export type Mediafiles = {
  _id: string;
  original_file_location: string;
  thumbnail_file_location: string;
  entities: Array<string>;
};

export type Frame = {
  id: string;
  type: string;
  title: Array<Metadata>;
  metadata: Array<Metadata>;
  mediafiles: Array<Mediafiles>;
  assets: Array<Asset>;
  relationMetadata: Array<ComponentMetadata>;
};

export type Position = {
  x: number;
  y: number;
  z: number;
}

export type ComponentMetadata = {
  key: string;
  label: string;
  timestamp_start: number;
  timestamp_end: number;
  postion: Position;
  scale: number;
};

export type Asset = {
  id: string;
  title: Array<Metadata>;
  collections: Array<Metadata>;
  dimensions: Array<Metadata>;
  timestamps: Array<Metadata>;
  mediafiles: Array<Mediafiles>;
};