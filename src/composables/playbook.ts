export type PlayBookFunctions = {
  addToPlayBook: (func: Function, timestamp:number) => void;
  getPlayBookFunctions: () => Array<{time:number,func:Function}>;
}

const PlayBook = (): PlayBookFunctions=> {
  const playbookFunctions: Array<any> = [];
  const addToPlayBook = (func: Function, timestamp:number) => {
    const obj = {
      time: timestamp,
      func: func,
    }
    playbookFunctions.push(obj);
  };

  const getPlayBookFunctions = () => {
    return playbookFunctions.sort(ob => ob.time) as Array<{time:number,func:Function}>;
  };

  return {
    addToPlayBook,
    getPlayBookFunctions,
  };
};

export default PlayBook;
