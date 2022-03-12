import { Vector3 } from 'three';

const HelperText = (): {
  EndOfStory: (position: Vector3) => Record<string, Vector3>;
  personSteppedOfSensor: Record<string, Vector3>;
  scanYourTicketAgain: (position: Vector3) => Record<string, Vector3>;
  scanYourTicket: (position: Vector3) => Record<string, Vector3>;
  goToWebPortal: (position: Vector3) => Record<string, Vector3>;
  WalkToTouchtable: (position: Vector3) => Record<string, Vector3>;
} => {
  const EndOfStory = (position: Vector3) => {
    return {
      'Je hebt het hele hoofdstuk gezien.': new Vector3(
        position.x - 190,
        position.y + 50,
        0,
      ),
      'Maak een nieuwe keuze door op de': new Vector3(position.x - 2, position.y, 0),
      'bol te gaan staan.': new Vector3(position.x - 50, position.y - 50, 0),
    };
  };

  const personSteppedOfSensor: Record<string, Vector3> = {
    'Ga terug op de bol staan om': new Vector3(-300, -150, 0),
    'verder te luisteren of kies een': new Vector3(-300, -25, 0),
    'van de oplichtende bollen om': new Vector3(-300, -35, 0),
    'een nieuw verhaal te starten.': new Vector3(-300, -45, 0),
  };

  const scanYourTicketAgain = (position: Vector3) => {
    return {
      'Scan je ticket': new Vector3(position.x + 20, position.y + 100, 0),
      'opnieuw aan de zuil': new Vector3(position.x, position.y + 50, 0),
      'om verder te gaan': new Vector3(position.x, position.y, 0),
    };
  };
  const goToWebPortal = (position: Vector3) => {
    return {
      'Neem je ticket mee': new Vector3(position.x + 30, position.y + 150, 0),
      'naar huis en ontdek de': new Vector3(position.x, position.y + 100, 0),
      'collectie verder online': new Vector3(position.x, position.y + 50, 0),
      'wwwcoghentbox.be': new Vector3(position.x, position.y, 0),
    };
  };
  const WalkToTouchtable = (position: Vector3) => {
    return {
      'Ga de collectie': new Vector3(position.x, position.y + 100, 0),
      'verder ontdekken': new Vector3(position.x, position.y + 50, 0),
      'aan de tafel': new Vector3(position.x, position.y, 0),
    } as Record<string, Vector3>;
  };
  const scanYourTicket = (position: Vector3) => {
    return {
      'Scan je ticket in de zuil': new Vector3(position.x - 220, position.y + 50, 0),
      'om te gaan': new Vector3(position.x - 100, position.y, 0),
    };
  };

  return {
    EndOfStory,
    personSteppedOfSensor,
    scanYourTicketAgain,
    scanYourTicket,
    goToWebPortal,
    WalkToTouchtable,
  };
};

export default HelperText;
