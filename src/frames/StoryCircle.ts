import SchemaCircle from '@/Three/CircleSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import SchemaText from '@/Three/Textschema';
import { Group } from 'three';

const StoryCircle = (): {
  Create: (title: string) => Group;
} => {
  const circle_schema = SchemaCircle();
  const text_schema = SchemaText();

  const main = () => {
    return circle_schema.CreateCircle(Defaults().Circle());
  };
  const outer = () => {
    return circle_schema.CreateOuterCircle(Defaults().Circle().params.radius + 1);
  };

  const title = (title: string) => {
    return text_schema.LoadText(Defaults().Word(title));
  };

  const Create = (storyTitle: string) => {
    const group: Group = GroupHelper().CreateGroup([main(), title(storyTitle), outer()]);
    return group;
  };

  return { Create };
};

export default StoryCircle;
