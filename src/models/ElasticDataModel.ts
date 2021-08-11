export interface ElasticData {
  took: number,
  hits: {
    total: {
        value: number,
        relation: string
    },
    max_score: number,
    hits: ElasticHit[]
  }
}

export interface ElasticHit {
  _index: string,
  _type: string,
  _id: string,
  _score: number,
  _source: {
      identifiers: string[],
      metadata: ElasticMeta[],
      type: string
  }
}

export interface ElasticMeta {
  key: string,
  value: string,
  lang: string
}
