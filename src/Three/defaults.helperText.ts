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
      'Je hebt het hele': new Vector3(0, position.y + 1, 0),
      'hoofdstuk gezien': new Vector3(-0.2, position.y + 0.5, 0),
      'Maak een nieuwe keuze': new Vector3(-0.8, position.y, 0),
      'door op de lichtgevende': new Vector3(-0.9, position.y - 0.5, 0),
      'bol te gaan staan.': new Vector3(-0.1, position.y - 1, 0),
    }
  };

  const personSteppedOfSensor: Record<string, Vector3> = {
    'Ga terug op de bol staan om': new Vector3(-3, -1.5, 0),
    'verder te luisteren of kies een': new Vector3(-3, -2.5, 0),
    'van de oplichtende bollen om': new Vector3(-3, -3.5, 0),
    'een nieuw verhaal te starten.': new Vector3(-3, -4.5, 0),
  };

  const scanYourTicketAgain = (position: Vector3) => {
    return {
      'Scan je ticket': new Vector3(position.x + 2.4, position.y + 1, 0),
      'opnieuw aan de zuil': new Vector3(position.x + 2.2, position.y + 0.5, 0),
      'om verder te gaan': new Vector3(position.x + 2.2, position.y, 0),
    };
  };
  const goToWebPortal = (position: Vector3) => {
    return {
      'Neem je ticket mee': new Vector3(position.x - 2.8, position.y + 1.5, 0),
      'naar huis en ontdek de': new Vector3(position.x - 3, position.y + 1, 0),
      'collectie verder online': new Vector3(position.x - 2.8, position.y + 0.5, 0),
      'wwwcoghentbox.be': new Vector3(position.x - 2.8, position.y, 0),
    };
  };
  const WalkToTouchtable = (position: Vector3) => {
    return {
      'Ga de collectie': new Vector3(position.x, position.y + 1, 0),
      'verder ontdekken': new Vector3(position.x, position.y + 0.5, 0),
      'aan de tafel': new Vector3(position.x, position.y, 0),
    } as Record<string, Vector3>
  };
  const scanYourTicket = (position: Vector3) => {
    return {
      'Scan je ticket in de zuil': new Vector3(position.x + 1.8, position.y + 2, 0),
      'om te gaan': new Vector3(position.x + 2.9, position.y + 1.5, 0),
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
