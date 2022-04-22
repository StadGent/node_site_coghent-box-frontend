import CircleHelper from '@/Three/helper.circle';
import GroupHelper from '@/Three/helper.group';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import StoryCircle, { StoryCircleObjects } from '../Three/section.storyCircle';

import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
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
import { Entity } from 'coghent-vue-3-component-library/lib';
import { threeDefaultsWall } from '@/Three/defaults.three';
import Common from '@/composables/common';
import globals from '@/services/GlobalData';
import Videos from '@/Three/defaults.videos';
import VideoHelper from '@/Three/helper.video';
import SchemaCircle from '@/Three/schema.circle';

export type PauseScreenObjects = {
  text: Array<Group>;
  banner: Mesh<BoxGeometry, MeshBasicMaterial>;
  storyCircles: Record<string, StoryCircleObjects>;
};

const StoryPaused = (
  taggingService: TaggingService,
  zoneService: ZoneService,
  _storyService: StoryService,
): {
  Create: (_storyData: Array<StoryData>) => Promise<PauseScreenObjects>;
} => {
  const bannerTopPosition =
    -(threeDefaultsWall.viewport.height / 2) + Measurements().pauseScreen.bannerHeight;
  const bannerCenterPosition =
    -(threeDefaultsWall.viewport.height / 2) + (Measurements().pauseScreen.bannerHeight / 2);
  const storyCircle = (
    _storyData: StoryData,
    story: Entity,
    position: Vector3,
    storyColor: number,
  ) => {
    const titleCircle = StoryCircle(_storyService).Create(
      _storyData,
      useStory(_storyService).title(story),
      CircleHelper().CreateSchema(
        position,
        Measurements().storyCircle.radius,
        storyColor,
      ),
      Images.story.defaultIcon,
    );
    return titleCircle;
  };

  const storyEndText = async () => {
    const groups: Array<Group> = [];
    const text = await TextHelper().CreateTextFromRecord(
      HelperText().EndOfStory(new Vector3(-140, bannerCenterPosition, 0)),
      Colors().white,
    );
    const schema = CircleHelper().CreateSchema(new Vector3(0, 0, -1), 350, Colors().black, 1)
    const blackspotlight = SchemaCircle().CreateCircle(schema)
    GroupHelper().AddObjectsTogroups([blackspotlight], groups);
    const video = document.getElementById(Videos.menuVideoId) as HTMLVideoElement;

    if (globals.menuVideoElement != null && video) {
      globals.threeService?.AddToScene(globals.menuVideoElement, Tags.menuVideo)
      video.setAttribute('loop', 'true')
      video.play();
      GroupHelper().AddObjectsTogroups([globals.menuVideoElement], groups);

    } else {
      const manSchema = CubeHelper().CreateSchema(
        new Vector3(0, -125, 0),
        Images.pauseScreen.man,
        new Vector3(500, 250, 0),
      );
      const man = SchemaCube().CreateImageCube(manSchema);
      GroupHelper().AddObjectsTogroups([man], groups);
    }

    GroupHelper().AddObjectsTogroups(text, groups);
    taggingService.tag(
      Tags.PauseScreenCenterText,
      groups,
      `Text displayed on the pause screen where all the stories are shown.`,
    );
    return groups;
  };

  const blackBanner = () => {
    return schemaCube().CreateCube({
      position: new Vector3(0, bannerCenterPosition, Layers.background),
      params: {
        width: zoneService.sceneZone().width + 3,
        height: Measurements().pauseScreen.bannerHeight,
        color: Measurements().pauseScreen.bannerColor,
        opacity: Measurements().pauseScreen.bannerOpacity,
      },
    } as CubeSchema);
  };

  const Create = async (_storyData: Array<StoryData>) => {
    const storyCircles: Record<string, StoryCircleObjects> = {};

    for (const _data of _storyData) {
      storyCircles[_data.storyId] = await storyCircle(
        _data,
        useStory(_storyService).getStory(_data.storyId),
        new Vector3(_data.pausedPosition.x, bannerTopPosition, _data.pausedPosition.z),
        _data.storyColor,
      );
    }

    return {
      text: await storyEndText(),
      banner: blackBanner(),
      storyCircles: storyCircles,
    };
  };
  return { Create };
};

export default StoryPaused;
