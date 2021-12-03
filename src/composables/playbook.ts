export type PlayBookFunctions = {
  addToPlayBook: (func: Function, timestamp:number) => void;
  getPlayBookFunctions: () => Array<PlayBookObject>;
  lastAction: () => PlayBookObject;
  clearPlaybook: (yes: true | false) => boolean;
}

export type PlayBookObject = {
  time: number;
  func: Function;
}

const PlayBook = (): PlayBookFunctions=> {
  let playbookFunctions: Array<PlayBookObject> = [];
  const addToPlayBook = (func: Function, timestamp:number) => {
    const obj = {
      time: timestamp,
      func: func,
    } as PlayBookObject;
    playbookFunctions.push(obj);
  };

  const getPlayBookFunctions = () => {
    return playbookFunctions.sort((a,b) => a.time - b.time);
  };

  const lastAction = () => getPlayBookFunctions()[getPlayBookFunctions().length -1 ];

  const clearPlaybook = (yes: true | false) => {
    if(yes){
      playbookFunctions = [];
    }
    return playbookFunctions.length == 0;
  }

  return {
    addToPlayBook,
    getPlayBookFunctions,
    lastAction,
    clearPlaybook,
  };
};

export default PlayBook;
