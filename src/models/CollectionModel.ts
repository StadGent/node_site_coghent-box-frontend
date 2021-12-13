import { Vector3 } from 'three';

export interface Collection {
  count: number,
  limit: number,
  next: string,
  took: number,
  results: Result[]
}

export interface Result {
  id: string,
  type: string,
  title: string,
  data: {},
  identifiers: string[],
  metadata: Metadata[],
  relations: Relation[]
  image: string | undefined
}

export interface Metadata {
  key: string,
  value: string,
  lang: string
}

export interface Relation {
  key: string,
  type: string,
  label?: string
  timestamp_start?: number,
  timestamp_end?: number,
  position?: Vector3,
  scale?: number,
  audioFile?: string
  subtitleFile?: string
  
}
