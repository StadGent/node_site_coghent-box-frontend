import { Group, Vector3 } from 'three';
import Colors from './defaults.color';
import HorizontalProgressBar from './shapes.horizontalProgressBar';

const TestData = (): {
  centerWords: Record<string, Vector3>;
  titles: () => Array<string>;
  horizontalProgressbar: Array<Group>;
} => {
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


  return { centerWords, titles, horizontalProgressbar };
};

export default TestData;
