const PlayBook = (): {
  addToPlayBook: (func: any) => void;
  getPlayBookFunctions: () => Array<any>;
} => {
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
