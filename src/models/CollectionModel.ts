export interface Collection {
  count: Number,
  limit: Number,
  next: string,
  took: Number,
  results: Result[]
}

export interface Result {
  _id: string,
  type: string,
  data: {},
  identifiers: string[],
  metadata: Metadata[],
  relations: string[]
  image: string
}

export interface Metadata {
  key: string,
  value: string,
  lang: string
}
