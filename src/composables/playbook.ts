export type PlayBookFunctions = {
  addToPlayBook: (func: Function, timestamp:number) => void;
  getPlayBookFunctions: () => Array<{time:number,func:Function}>;
  clearPlaybook: (yes: true | false) => boolean;
}

const PlayBook = (): PlayBookFunctions=> {
  let playbookFunctions: Array<any> = [];
  const addToPlayBook = (func: Function, timestamp:number) => {
    const obj = {
      time: timestamp,
      func: func,
    }
    playbookFunctions.push(obj);
  };

  const getPlayBookFunctions = () => {
    return playbookFunctions.sort((a,b) => a.time - b.time) as Array<{time:number,func:Function}>;
  };

  const clearPlaybook = (yes: true | false) => {
    if(yes){
      playbookFunctions = [];
    }
    return playbookFunctions.length == 0;
  }

  return {
    addToPlayBook,
    getPlayBookFunctions,
    clearPlaybook,
  };
};

export default PlayBook;
