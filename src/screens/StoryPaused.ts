import CircleHelper from '@/Three/helper.circle';
import GroupHelper from '@/Three/helper.group';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import StoryCircle, { StoryCircleObjects } from '../Three/section.storyCircle';

import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import CircularProgressBar from '@/Three/shapes.circularProgressbar';
import Colors from '@/Three/defaults.color';
import TextHelper from '@/Three/helper.text';
import SchemaCube, { CubeSchema } from '@/Three/schema.cube';
import CubeHelper from '@/Three/helper.cube';
import HelperText from '@/Three/defaults.helperText';
import StoryService, { StoryData } from '@/services/StoryService';
import TaggingService, { Tags } from '@/services/TaggingService';
import Images from '@/Three/defaults.images';
import Layers from '@/Three/defaults.layers';
import ZoneService from '@/services/ZoneService';
import schemaCube from '@/Three/schema.cube';
import Measurements from '@/Three/defaults.measurements';
import Defaults from '@/Three/defaults.config';

export type PauseScreenObjects = {
  text: Array<Group>,
  banner: Mesh<BoxGeometry, MeshBasicMaterial>,
  storyCircles: Record<string, StoryCircleObjects>,
}


const StoryPaused = (taggingService: TaggingService, zoneService: ZoneService, _storyService: StoryService): {
  Create: (_storyData: Array<StoryData>) => PauseScreenObjects;
} => {
  const bannerTopPosition = -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight;
  const bannerCenterPosition = -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight / 2;
  const storyCircle = (story: Story, currentFrame: number, position: Vector3, storyColor: number) => {
    const titleCircle = StoryCircle(_storyService).Create(
      useStory(_storyService).title(story),
      CircleHelper().CreateSchema(position, Measurements().storyCircle.radius, storyColor),
      Images.story.defaultIcon,
    );
    return titleCircle;
  };

  const storyEndText = () => {
    const groups: Array<Group> = [];
    const text = TextHelper().CreateTextFromRecord(
      HelperText().EndOfStory(new Vector3(-1.4, bannerCenterPosition, 0)),
      Colors().white,
    );
    const manSchema = CubeHelper().CreateSchema(new Vector3(0, bannerTopPosition + 2, 0), Images.pauseScreen.man, new Vector3(5, 2.5, 0));
    const man = SchemaCube().CreateImageCube(manSchema);
    GroupHelper().AddObjectsTogroups(text, groups);
    GroupHelper().AddObjectsTogroups([man], groups);
    taggingService.tag(Tags.PauseScreenCenterText, groups, `Text displayed on the pause screen where all the stories are shown.`)
    return groups;
  };

  const blackBanner = () => {
    return schemaCube().CreateCube({
      position: new Vector3(0, bannerCenterPosition, Layers.background),
      params: {
        width: zoneService.sceneZone().width + Defaults().boundaryPadding(),
        height: Measurements().pauseScreen.bannerHeight,
        color: Measurements().pauseScreen.bannerColor,
        opacity: Measurements().pauseScreen.bannerOpacity
      }
    } as CubeSchema);
  };

  const Create = (_storyData: Array<StoryData>) => {
    const storyCircles: Record<string, StoryCircleObjects> = {};

    _storyData.forEach(_data => {
      console.log('data of story', _data);
      storyCircles[_data.storyId] = storyCircle(
        useStory(_storyService).getStory(_data.storyId),
        _data.totalOfFramesSeen,
        new Vector3(_data.pausedPosition.x, bannerTopPosition, Layers.scene + Layers.fraction),
        _data.storyColor,
      )
    });

    return {
      text: storyEndText(),
      banner: blackBanner(),
      storyCircles: storyCircles,
    };
  };
  return { Create };
};

export default StoryPaused;
