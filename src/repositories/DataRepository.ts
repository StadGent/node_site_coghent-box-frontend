import axios from 'axios'
import { Collection } from '../models/CollectionModel'
import { ElasticData } from '../models/ElasticDataModel'

export class DataRepository {
    private searchApi = 'http://localhost:8002/'
    private collectionApi = 'http://localhost:8000/'

    constructor () {
    }

    getRawData (keyword: string): Promise<ElasticData> {
      return axios.get(this.searchApi + 'search/raw?query=metadata.value' + '%3D%22' + keyword + '%22').then((response: any) => {
        return response.data
      }).catch(() => Promise.reject())
    }

    getCollectionData (keyword: string): Promise<Collection> {
      return axios.get(this.searchApi + 'search/collection?query=metadata.value' + '%3D%22' + keyword + '%22').then((response: any) => {
        return response.data
      }).catch(() => Promise.reject())
    }

    getRelationData (id: string): Promise<any> {
      return axios.get(this.collectionApi + '/entities/' + id + '/relations').then((response: any) => {
        return response.data
      }).catch(() => Promise.reject())
    }

    getMediaData (id: string): Promise<any> {
      return axios.get(this.collectionApi + '/entities/' + id + '/mediafiles').then((response: any) => {
        return response.data
      }).catch(() => Promise.reject())
    }
}
