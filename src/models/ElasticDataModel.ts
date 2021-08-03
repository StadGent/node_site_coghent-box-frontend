export interface ElasticData {
  took: Number,
  hits: {
    total: {
        value: Number,
        relation: String
    },
    max_score: Number,
    hits: ElasticHit[]
  }
}

export interface ElasticHit {
  _index: String,
  _type: String,
  _id: String,
  _score: Number,
  _source: {
      identifiers: String[],
      metadata: ElasticMeta[],
      type: String
  }
}

export interface ElasticMeta {
  key: String,
  value: String,
  lang: String
}