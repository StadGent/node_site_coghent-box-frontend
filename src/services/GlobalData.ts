import { Mesh, BufferGeometry, BoxGeometry, MeshBasicMaterial } from 'three'
import TaggingService from './TaggingService'
import ThreeService from './ThreeService'
import ZoneService from './ZoneService'

class GlobalData {
  spotlight: Mesh<BufferGeometry, any> | null
  spotlightBackground: Mesh<BoxGeometry, MeshBasicMaterial> | null
  threeService: ThreeService | null
  taggingService: TaggingService
  zoneService: ZoneService | null
  startVideoElement: HTMLVideoElement | null
  menuVideoElement: HTMLVideoElement | null

  constructor(){
    this.spotlight = null
    this.spotlightBackground = null
    this.threeService = null
    this.taggingService = new TaggingService()
    this.zoneService = null
    this.startVideoElement= null
    this.menuVideoElement= null
  }
  getGlobalData(){
    console.log(`/ spotlight`, this.spotlight)
    console.log(`/ spotlightBackground`, this.spotlightBackground)
    console.log(`/ threeService`, this.threeService)
    console.log(`/ zoneService`, this.zoneService)
  }
}

const globals = new GlobalData()
export default globals