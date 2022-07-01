import globals from '@/services/GlobalData'
import stateService, { FlowState } from '@/services/StateService'
import { Tags } from '@/services/TaggingService'
import ThreeService from '@/services/ThreeService'
import ZoneService from '@/services/ZoneService'
import Measurements from '@/Three/defaults.measurements'
import useStartOfSession from '@/Three/playbook.startOfSession'
import MetadataLabel from '@/Three/shapes.metadataLabel'
import Spot from '@/Three/shapes.spotlight'
import { Mesh, BufferGeometry, Vector3 } from 'three'
import CustomAnimation from './animation'
import useDMX from './useDMX'

const useScenery = (): {
  welcomeScene: () => void
  generateStoryScene: () => void
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

  const generateStoryScene = async () => {
    stateService.canScanTicket = false
    stateService.changeState(FlowState.generateStory);
    globals.garbageHelper?.startOfSession();
    const widthLoader = 20

    const generateText = await MetadataLabel(new Vector3(0, -Measurements().generateLoaderRadius - (widthLoader * 3), 0)).label('we genereren jou verhaal');
    generateText.text.position.x -= generateText.dimensions.x / 2;
    generateText.text.position.y -= generateText.dimensions.y;
    globals.threeService?.AddToScene(generateText.text, Tags.Testing);

    while (stateService.getCurrentState() == FlowState[7]) {
      await CustomAnimation().circularLoader(
        globals.threeService as ThreeService,
        new Vector3(0, 0, 0),
        Measurements().generateLoaderRadius,
        widthLoader,
        [Tags.SmallCountdownRing, Tags.SmallCountdownProgressRing],
      );
    }
    globals.threeService?.RemoveFromScene(generateText.text)
  }

  return {
    welcomeScene,
    generateStoryScene,
  }

}
const scenery = useScenery()
export default scenery