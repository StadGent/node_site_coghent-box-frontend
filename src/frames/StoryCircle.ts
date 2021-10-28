import SchemaCircle, { CircleSchema } from '@/Three/CircleSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import SchemaText from '@/Three/Textschema';
import { Group } from 'three';

const StoryCircle = (): {
  Create: (title: string, middleCircleSchema: CircleSchema) => Group;
} => {
  const circle_schema = SchemaCircle();
  const text_schema = SchemaText();

  const main = (schema: CircleSchema) => {
    return circle_schema.CreateCircle(schema);
  };
  const outer = (schema: CircleSchema) => {
    return circle_schema.CreateOuterCircle(schema.params.radius + 1);
  };

  const title = (title: string) => {
    const storyTitle = text_schema.LoadText(Defaults().Word(title));
    storyTitle.position.x += 1.4;
    storyTitle.position.y += 0.3;
    return storyTitle;
  };

  const Create = (storyTitle: string, circleSchema: CircleSchema) => {
    const group: Group = GroupHelper().CreateGroup([
      main(circleSchema),
      title(storyTitle),
      outer(circleSchema),
    ]);
    return group;
  };

  return { Create };
};

export default StoryCircle;
