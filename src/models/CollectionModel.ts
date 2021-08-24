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
  entity: Result | undefined
}
