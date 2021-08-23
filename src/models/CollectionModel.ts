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
