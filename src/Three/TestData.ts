import { Group, Vector3 } from 'three';
import Colors from './defaults.color';
import HorizontalProgressBar from './shapes.horizontalProgressBar';

const TestData = (): {
  storyWordLinks: Record<string, string>;
  centerWords: Record<string, Vector3>;
  titles: () => Array<string>;
  horizontalProgressbar: Array<Group>;
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

  const titles = () => {
    return [
      'Het belang van\n godsdienst in\n het dagelijkse\n leven',
      'De komst van\n de Turkse\n handelaar',
      'Het Gravesteen\n doorheen de\n tijd',
      'Invloed van de\n Textielfabriek\n vroeger en nu',
    ];
  };

  const horizontalProgressbar = HorizontalProgressBar().create(new Vector3(0,0,1), [2,3,4], 8, 5, Colors().yellow);


  return { storyWordLinks, centerWords, titles, horizontalProgressbar };
};

export default TestData;
