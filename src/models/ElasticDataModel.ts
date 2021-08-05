export interface ElasticData {
  took: Number,
  hits: {
    total: {
        value: Number,
        relation: string
    },
    max_score: Number,
    hits: ElasticHit[]
  }
}

export interface ElasticHit {
  _index: string,
  _type: string,
  _id: string,
  _score: Number,
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