//timer function to search
const timer = (func, delay = 1000) => {
  let timerId;
  return (...args) => {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
