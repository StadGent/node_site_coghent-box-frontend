export type PlayBookFunctions = {
  addToPlayBook: (func: Function, timestamp:number, context?:string) => void;
  getPlayBookFunctions: () => Array<PlayBookObject>;
  lastAction: () => PlayBookObject;
  clearPlaybook: (yes: true | false) => boolean;
}

export type PlayBookObject = {
  time: number;
  func: Function;
  context: string;
}

const PlayBook = (): PlayBookFunctions=> {
  let playbookFunctions: Array<PlayBookObject> = [{time: 0,func: () => {}, context: 'Beginning of playbook.'}];
  const addToPlayBook = (func: Function, timestamp:number, context?:string) => {
    const obj = {
      time: timestamp,
      func: func,
      context: context as string,
    } as PlayBookObject;
    playbookFunctions.push(obj);
  };

  const getPlayBookFunctions = () => {
    return playbookFunctions.sort((a,b) => a.time - b.time);
  };

  const lastAction = () => getPlayBookFunctions()[getPlayBookFunctions().length -1 ];

  const clearPlaybook = (yes: true | false) => {
    if(yes){
      playbookFunctions = [{time: 0,func: () => {}, context: 'Beginning of playbook.'}];
    }
    return playbookFunctions.length === 1;
  }

  return {
    addToPlayBook,
    getPlayBookFunctions,
    lastAction,
    clearPlaybook,
  };
};

export default PlayBook;
