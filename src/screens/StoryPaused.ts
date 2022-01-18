import CircleHelper from '@/Three/helper.circle';
import GroupHelper from '@/Three/helper.group';
import { Group, Vector3 } from 'three';
import StoryCircle from '../Three/section.storyCircle';

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

const StoryPaused = (taggingService: TaggingService, zoneService: ZoneService, _storyService: StoryService): {
  Create: (_storyData: Array<StoryData>) => Array<Group>;
} => {
  const bannerTopPosition = -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight;
  const bannerCenterPosition = -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight / 2;
  const storyCircle = (story: Story, currentFrame: number, position: Vector3, storyColor: number) => {
    const groups: Array<Group> = [];
    const titleCircle = StoryCircle().Create(
      useStory(_storyService).title(story),
      CircleHelper().CreateSchema(position, 2, storyColor),
      [currentFrame, story.frames.length],
      Images.story.defaultIcon,
    );

    const progressBar = CircularProgressBar().createActiveSegment(
      position,
      Measurements().storyCircle.outerCircle,
      story.frames.length,
      currentFrame,
      storyColor,
    );
    GroupHelper().AddObjectsTogroups([titleCircle.basic,titleCircle.progress, titleCircle.text], groups);
    GroupHelper().AddObjectsTogroups(progressBar.object, groups);
    taggingService.tag(Tags.StoryCircle, groups, `StoryCircle with progress for story ${story.id}`, story.id)
    return groups;
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
    taggingService.tag(Tags.StoryEndText, groups, `Text displayed on the pause screen where all the stories are shown.`)
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
    const groups: Array<Group> = [];

    _storyData.forEach(_data => {
      GroupHelper().AddObjectsTogroups(
        storyCircle(
          useStory(_storyService).getStory(_data.storyId),
          _data.totalOfFramesSeen,
          new Vector3(_data.pausedPosition.x, bannerTopPosition, Layers.scene + Layers.fraction),
          _data.storyColor,
        ),
        groups,
      );
    })
    

    GroupHelper().AddObjectsTogroups(storyEndText(), groups);
    GroupHelper().AddObjectsTogroups([blackBanner()], groups);
    return groups
  };
  return { Create };
};

export default StoryPaused;
