import globals from '@/services/GlobalData'
import stateService, { FlowState } from '@/services/StateService'
import { Tags } from '@/services/TaggingService'
import ThreeService from '@/services/ThreeService'
import ZoneService from '@/services/ZoneService'
import Measurements from '@/Three/defaults.measurements'
import useStartOfSession from '@/Three/playbook.startOfSession'
import Spot from '@/Three/shapes.spotlight'
import { Mesh, BufferGeometry } from 'three'
import useDMX from './useDMX'

const useScenery = (): {
  welcomeScene: () => void
} => {
  const welcomeScene = () => {
    globals.threeService?.ClearScene();
    useDMX().sequence();
    if (globals.zoneService) {
      globals.spotlight = Spot().create(
        globals.zoneService.zones[0].center,
        Measurements().storyCircle.radius,
      );
    }

    globals.spotlightBackground = Spot().spotLightBackground();
    globals.threeService?.AddToScene(globals.spotlight, Tags.Spotlight, 'InitialSpotlight');
    globals.threeService?.AddToScene(globals.spotlightBackground, Tags.Spotlight, 'InitialSpotlightBackground');


    useStartOfSession(globals.threeService as ThreeService, globals.zoneService as ZoneService, globals.spotlight as Mesh<BufferGeometry, any>).showScanImage();
    stateService.changeState(FlowState.welcome);
    stateService.canScanTicket = true
  }

  return {
    welcomeScene,
  }

}
const scenery = useScenery()
export default scenery