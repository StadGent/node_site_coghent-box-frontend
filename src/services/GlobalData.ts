import { Mesh, BufferGeometry, BoxGeometry, MeshBasicMaterial } from 'three'
import ThreeService from './ThreeService'
import ZoneService from './ZoneService'

class GlobalData {
  spotlight: Mesh<BufferGeometry, any> | null
  spotlightBackground: Mesh<BoxGeometry, MeshBasicMaterial> | null
  threeService: ThreeService | null
  zoneService: ZoneService | null

  constructor(){
    this.spotlight = null
    this.spotlightBackground = null
    this.threeService = null
    this.zoneService = null
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