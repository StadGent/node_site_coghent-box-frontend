import usePredefined from '@/Three/usePredefined';
import { Group, Vector3 } from 'three';

const TestData = (): {
  story: (showWords: true | false) => Array<Group>;
  storyWordLinks: Record<string, string>;
  centerWords: Record<string, Vector3>;
  titles: () => Array<string>;
} => {
  const storyWordLinks: Record<string, string> = {
    Migratie:
      'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
    Economie:
      'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
    Turkije:
      'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
    Vakantie:
      'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
    Familie:
      'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
  };

  const centerWords: Record<string, Vector3> = {
    Relations: new Vector3(0.5, 2, 0),
    Economie: new Vector3(-1.5, 1, 0),
    Vacation: new Vector3(-2, -1.5, 0),
    Turkije: new Vector3(3, 1, 0),
    School: new Vector3(3, -1.5, 0),
    Other: new Vector3(1, -3, 0),
  };

  const story = (showWords: true | false) => {
    const story = usePredefined().BaseStoryCircle(
      `De komst van \n de Turkse \n handelaar`,
      storyWordLinks,
      centerWords,
      showWords,
    );
    story[0].scale.set(0.5, 0.5, 0.5);
    story[1].scale.set(0.5, 0.5, 0.5);
    story[0].position.set(
      story[0].position.x - 24,
      story[0].position.y,
      story[0].position.z,
    );
    story[1].position.set(
      story[1].position.x - 24,
      story[1].position.y,
      story[1].position.z,
    );
    return story as Array<Group>;
  };

  const titles = () => {
    return [
      'Het belang van\n godsdienst in\n het dagelijkse\n leven',
      'De komst van\n de Turkse\n handelaar',
      'Het Gravesteen\n doorheen de\n tijd',
      'Invloed van de\n Textielfabriek\n vroeger en nu',
    ];
  };

  return { story, storyWordLinks, centerWords, titles };
};

export default TestData;
