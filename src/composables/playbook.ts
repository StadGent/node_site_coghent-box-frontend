import Development from '@/Three/defaults.development';

export type PlayBookFunctions = {
  addToPlayBook: (func: Function, timestamp:number, context?:string) => void;
  getSortedPlayBookActions: () => Array<PlayBookObject>;
  getPlayBookActions: () => Array<PlayBookObject>;
  lastAction: () => PlayBookObject;
  clearPlaybook: (yes: true | false) => boolean;
  mergeActionsWithPlaybook: (playbookActions: Array<PlayBookObject>) => void;
}

export type PlayBookObject = {
  time: number;
  func: Function;
  context: string;
}

const PlayBook = (): PlayBookFunctions=> {
  let playbookActions: Array<PlayBookObject> = [{time: 0,func: () => {}, context: 'Beginning of playbook.'}];

  const addToPlayBook = (func: Function, timestamp:number, context?:string) => {
    if(Development().showplayBookLogs()){
      console.log(`| Add to playbook`)
      console.log(`| timestamp: ${timestamp}`)
      console.log(`| context: ${context}`)
    }
    const obj = {
      time: timestamp,
      func: func,
      context: context as string,
    } as PlayBookObject;
    playbookActions.push(obj);
  };

  const getSortedPlayBookActions = () => {
    return playbookActions.sort((a,b) => a.time - b.time);
  };

  const getPlayBookActions = () => {
    return playbookActions;
  };

  const lastAction = () => getPlayBookActions()[getPlayBookActions().length -1 ];

  const clearPlaybook = (yes: true | false) => {
    if(yes){
      playbookActions = [{time: 0,func: () => {}, context: 'Beginning of playbook.'}];
    }
    return playbookActions.length === 1;
  }

  const mergeActionsWithPlaybook = (actions: Array<PlayBookObject>) => {
    playbookActions = playbookActions.concat(actions);
  }

  return {
    addToPlayBook,
    getSortedPlayBookActions,
    getPlayBookActions,
    lastAction,
    clearPlaybook,
    mergeActionsWithPlaybook,
  };
};

export default PlayBook;
