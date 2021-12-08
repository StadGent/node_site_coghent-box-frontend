import { Vector3 } from 'three';

const HelperText =(): {
  EndOfStory: Record<string, Vector3>;
  personOfSensor: Record<string, Vector3>;
} => {

  const EndOfStory: Record<string, Vector3> = {
    'Je hebt het hele': new Vector3(0, 3, 0),
    'hoofdstuk gezien': new Vector3(-0.2, 2.5, 0),
    'Maak een nieuwe keuze': new Vector3(-0.8, 2, 0),
    'door op de lichtgevende': new Vector3(-0.9, 1.5, 0),
    'bol te gaan staan.': new Vector3(-0.1, 1, 0),
  };
  const personOfSensor: Record<string, Vector3> = {
    'Ga terug op de bol staan om': new Vector3(-3, -1.5, 0),
    'verder te luisteren of kies een': new Vector3(-3, -2.5, 0),
    'van de oplichtende bollen om': new Vector3(-3, -3.5, 0),
    'een nieuw verhaal te starten.': new Vector3(-3, -4.5, 0),
  };

  return {
    EndOfStory,
    personOfSensor,
  }
};

export default HelperText;