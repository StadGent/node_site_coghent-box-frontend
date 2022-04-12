import stateService, { FlowState } from '@/services/StateService'
import ThreeService from '@/services/ThreeService'
import ZoneService from '@/services/ZoneService'
import useStartOfSession from '@/Three/playbook.startOfSession'
import { Mesh, BufferGeometry } from 'three'

const useScenery = (): {
  addSpotlight: (_spotlight: Mesh<BufferGeometry, any>) => void
  addThreeService: (_threeService: ThreeService) => void
  addZoneService: (_zoneService: ZoneService) => void
  welcomeScene: () => void
} => {
  let spotlight: Mesh<BufferGeometry, any> | null = null
  let threeService: ThreeService | null = null
  let zoneService: ZoneService | null = null

  const checkResources = () => {
    return threeService != null && spotlight != null && zoneService != null
  }
  const addSpotlight = (_spotlight: Mesh<BufferGeometry, any>) => {
    if (spotlight === null) {
      spotlight = _spotlight
    } else console.log('You wanted to overide the single spotlight in the 180 wall', _spotlight)
  }
  const addThreeService = (_threeService: ThreeService) => {
    if (threeService === null) {
      threeService = _threeService
    } else console.log('You wanted to overide the threeService in the 180 wall')
  }
  const addZoneService = (_zoneService: ZoneService) => {
    if (zoneService === null) {
      zoneService = _zoneService
    } else console.log('You wanted to overide the zoneService in the 180 wall')
  }

  const welcomeScene = () => {
    if (checkResources()) {
      stateService.changeState(FlowState.welcome)
      useStartOfSession(
        threeService as ThreeService,
        zoneService as ZoneService,
        spotlight as Mesh<BufferGeometry, any>
      ).showScanImage();
    } else console.log(`Could't find alls the components`, {
      threeService: threeService,
      spotlight: spotlight,
      zoneService: zoneService
    })
  }

  return {
    addSpotlight,
    addThreeService,
    addZoneService,
    welcomeScene,
  }
}
const scenery = useScenery()
export default scenery