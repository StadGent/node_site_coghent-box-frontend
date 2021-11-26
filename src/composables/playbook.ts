export type PlayBookFunctions = {
  addToPlayBook: (func: Function) => void;
  getPlayBookFunctions: () => Array<Function>;
}

const PlayBook = (): PlayBookFunctions=> {
  const playbookFunctions: Array<Function> = [];
  const addToPlayBook = (func: Function) => {
    playbookFunctions.push(func as Function);
  };

  const getPlayBookFunctions = () => {
    return playbookFunctions;
  };

  return {
    addToPlayBook,
    getPlayBookFunctions,
  };
};

export default PlayBook;
