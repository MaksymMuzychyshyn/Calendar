export const createNumbersArray = (from, to) => {
    const res = [];
    for (let i = from; i <= to; i += 1) {
      res.push(i);
    }
    return res;
  };