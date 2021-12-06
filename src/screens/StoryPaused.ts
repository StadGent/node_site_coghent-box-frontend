import CircleHelper from '@/Three/CircleHelper';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import { Group, Vector3 } from 'three';
import StoryCircle from '../Three/SectionStoryCircle';

import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import CircularProgressBar from '@/Three/CircularProgressbar';
import Positions from '@/Three/defaults.positions';
import DefaultsPauseState from '@/Three/defaults.pauseState';
import Colors from '@/Three/defaults.color';
import TextHelper from '@/Three/TextHelper';
import SchemaCube from '@/Three/CubeSchema';
import CubeHelper from '@/Three/CubeHelper';

const StoryPaused = (storyData: Array<Story>): {
  Create: (progress: Array<number>) => Array<Group>;
} => {
  const storyCircle = (story: Story, currentFrame: number, position: Vector3, storyColor: number) => {
    const groups: Array<Group> = [];
    const titleCircle = StoryCircle().Create(
      useStory().title(story),
      CircleHelper().CreateSchema(position, 2, storyColor),
      [currentFrame, story.frames.length],
      'https://cdn-icons-png.flaticon.com/512/844/844994.png',
      true,
      false
    );

    const progressBar = CircularProgressBar().createActiveSegment(
      position,
      2.5,
      story.frames.length,
      currentFrame,
      storyColor,
    );
    GroupHelper().AddObjectsTogroups(titleCircle, groups);
    GroupHelper().AddObjectsTogroups(progressBar.object, groups);
    return groups;
  };

  const storyEndText = () => {
    const groups: Array<Group> = [];
    const text = TextHelper().CreateTextFromRecord(
      DefaultsPauseState().topTextState1,
      Colors().black,
    );
    const manSchema = CubeHelper().CreateSchema(new Vector3(0,0,0),"@/assets/man.svg", new Vector3(3,2,0));
    const man = SchemaCube().CreateImageCube(manSchema);
    GroupHelper().AddObjectsTogroups(text, groups);
    GroupHelper().AddObjectsTogroups([man], groups);
    return groups;
  };

  const Create = (progress: Array<number>) => {
    const groups: Array<Group> = [];
    for (let i = 0; i < useStory().GetStoryTitles(storyData).length; i++) {
      GroupHelper().AddObjectsTogroups(
        storyCircle(
          storyData[i],
          progress[i],
          Positions().StoryPausePositions()[i],
          Defaults().StoryColors()[i],
        ),
        groups,
      );
    }
    GroupHelper().AddObjectsTogroups(storyEndText(), groups);
    return groups
  };
  return { Create };
};

export default StoryPaused;
