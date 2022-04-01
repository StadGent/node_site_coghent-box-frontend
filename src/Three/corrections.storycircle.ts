import Common from '@/composables/common'
import StoryService, { StoryData } from '@/services/StoryService'
import TaggingService, { Tags } from '@/services/TaggingService'
import ThreeService from '@/services/ThreeService'
import { Vector3 } from 'three'
import Development from './defaults.development'
import Layers from './defaults.layers'
import SceneHelper from './helper.scene'
import WallGarbageHelper from './helper.wall.garbage'
import StoryCircle from './section.storyCircle'

const StoryCircleCorrections = (_threeService: ThreeService, _storyService: StoryService, _taggingService: TaggingService): {
  ringprogressToCenterOfScreen: (_storydata: StoryData) => Promise<void>
} => {
  const ringprogressToCenterOfScreen = async (_storydata: StoryData) => {
    WallGarbageHelper(_threeService, _taggingService).removeArrayOfGroupsByTag(Tags.ActiveStoryCircleFrameRing);
    WallGarbageHelper(_threeService, _taggingService).removeActiveFrameDots()
    // create the progresscircle
    await Common().awaitTimeout(400)
    const circle = StoryCircle(_storyService).progressOfFrames(new Vector3(0, 0, Layers.scene), _storydata.storyColor, _storydata)
    _threeService.AddGroupsToScene(circle.ring, Tags.ActiveStoryCircleFrameRing, 'Storycircle progress ring added again for bug ')
    SceneHelper(_threeService, _storyService).addFrameProgressDotsToScene(circle.dots, _storydata.storyId, _storydata.totalOfFramesSeen, true)
  }
  return {
    ringprogressToCenterOfScreen
  }
}

export default StoryCircleCorrections