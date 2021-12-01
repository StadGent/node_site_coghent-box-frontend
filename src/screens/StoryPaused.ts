import CircleHelper from '@/Three/CircleHelper';
import { CirclePoint } from '@/Three/CircleSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import SchemaLine from '@/Three/LineSchema';
import { Group, Vector3 } from 'three';
import StoryCircle from '../Three/SectionStoryCircle';
import EndOfStoryText from '@/Three/EndOfStoryText';
import useStoryCircle from '@/Three/useStoryCircle.playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import CircularProgressBar from '@/Three/CircularProgressbar';
import Positions from '@/Three/defaults.positions';

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

  const Create = (progress: Array<number>) => {
    const groups: Array<Group> = [];
    // groups.push(EndOfStoryText().Create(currentStory, 'endOfstorytext'));
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
    return groups
  };
  return { Create };
};

export default StoryPaused;
