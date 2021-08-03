import axios from "axios"
import { ElasticData } from "../models/ElasticDataModel"

export class DataRepository {
    private url = 'http://localhost:8002/search?query=metadata.value'
  
    constructor() {
    }
  
    getData(keyword: String): Promise<ElasticData> {
      return axios.get(this.url + '%3D%22' + keyword + '%22').then((response: any) => {
          return response.data
      }).catch(() => Promise.reject())
    }
  }