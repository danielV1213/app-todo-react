"use strict";

export function first(array) { return array[0];}

export function second(array) { return array[1]; }

export function third(array) { return array[2]; }

export function fourth(array) { return array[3]; }

export function fifth(array) { return array[4]; }

export function fifthLast(array) { return array[array.length - 5]; }

export function fourthLast(array) { return array[array.length - 4]; }

export function thirdLast(array) { return array[array.length - 3]; }

export function secondLast(array) { return array[array.length - 2]; }

export function firstLast(array) { return array[array.length - 1]; }

export function last(array) { return array[array.length - 1]; }

export function head(array) { return array.slice(0, 1); }

export function tail(array) { return array.slice(1); }

export function back(array) { return array.slice(array.length - 1); }

export function front(array) { return array.slice(0, Math.max(1, array.length - 1)); }

export function push(array1, array2) { Array.prototype.push.apply(array1, array2); }

export function unshift(array1, array2) { Array.prototype.unshift.apply(array1, array2); }

export function concat(array1, elementOrArray2) {
  const array2 = (elementOrArray2 instanceof Array) ?
                    elementOrArray2 :
                     [elementOrArray2];
  
  push(array1, array2);
}

export function clear(array) {
  const start = 0;
  
  return array.splice(start);
}

export function copy(array1, array2) {
  const start = 0,
        deleteCount = array2.length;  ///
  
  splice(array1, start, deleteCount, array2);
}

export function merge(array1, array2) { Array.prototype.push.apply(array1, array2); }

export function splice(array1, start, deleteCount = Infinity, array2 = []) {
  const args = [start, deleteCount, ...array2],
        deletedItemsArray = Array.prototype.splice.apply(array1, args);

  return deletedItemsArray;
}

export function replace(array, element, callback) {
  let start;
  
  const found = array.some((element, index) => {
    const passed = callback(element, index);

    if (passed) {
      start = index;  ///
      
      return true;
    }
  });
  
  if (found) {
    const deleteCount = 1;

    array.splice(start, deleteCount, element);
  }

  return found;
}

export function filter(array, callback) {
  const filteredElements = [];
  
  backwardsForEach(array, (element, index) => {
    const passed = callback(element, index);

    if (!passed) {
      const start = index,  ///
            deleteCount = 1,
            deletedElements = array.splice(start, deleteCount),
            firstDeletedElement = first(deletedElements);
      
      filteredElements.unshift(firstDeletedElement);  ///
    }
  });
  
  return filteredElements;
}

export function find(array, callback) {
  const elements = [];

  forwardsForEach(array, (element, index) => {
    const passed = callback(element, index);

    if (passed) {
      elements.push(element);
    }
  });

  return elements;
}

export function prune(array, callback) {
  let prunedElement = undefined;
  
  array.some((element, index) => {
    const passed = callback(element, index);

    if (!passed) {
      const start = index,  ///
            deleteCount = 1,
            deletedElements = array.splice(start, deleteCount),
            firstDeletedElement = first(deletedElements);
      
      prunedElement = firstDeletedElement;  ///

      return true;
    }
  });
  
  return prunedElement;
}

export function patch(array, element, callback) {
  const found = array.some((element, index) => {
    const passed = callback(element, index);

    if (passed) {
      return true;
    }
  });


  if (found) {
    array.push(element);
  }

  return found;
}

export function augment(array1, array2, callback) {
  array2.forEach((element, index) => {
    const passed = callback(element, index);

    if (passed) {
      array1.push(element);
    }
  });
}

export function separate(array, array1, array2, callback) {
  array.forEach((element, index) => {
    const passed = callback(element, index);

    passed ?
      array1.push(element) :
        array2.push(element);
  });
}

export function forwardsFind(array, callback) {
  const arrayLength = array.length;

  for (let index = 0; index < arrayLength; index++) {
    const element = array[index],
          passed = callback(element, index);

    if (passed) {
      return element;
    }
  }

  return false;
}

export function backwardsFind(array, callback) {
  const arrayLength = array.length;

  for (let index = arrayLength - 1; index >= 0; index--) {
    const element = array[index],
          passed = callback(element, index);

    if (passed) {
      return element;
    }
  }

  return false;
}

export function forwardsSome(array, callback) {
  const arrayLength = array.length;

  for (let index = 0; index < arrayLength; index++) {
    const element = array[index],
          passed = callback(element, index);
    
    if (passed) {
      return true;
    }
  }

  return false;
}

export function backwardsSome(array, callback) {
  const arrayLength = array.length;

  for (let index = arrayLength - 1; index >= 0; index--) {
    const element = array[index],
          passed = callback(element, index);

    if (passed) {
      return true;
    }
  }

  return false;
}

export function forwardsEvery(array, callback) {
  const arrayLength = array.length;

  for (let index = 0; index < arrayLength; index++) {
    const element = array[index],
          passed = callback(element, index);

    if (!passed) {
      return false;
    }
  }

  return true;
}

export function backwardsEvery(array, callback) {
  const arrayLength = array.length;

  for (let index = arrayLength - 1; index >= 0; index--) {
    const element = array[index],
          passed = callback(element, index);

    if (!passed) {
      return false;
    }
  }

  return true;
}

export function forwardsReduce(array, callback, initialValue) {
  let value = initialValue; ///

  const arrayLength = array.length;

  for (let index = 0; index < arrayLength; index++) {
    const element = array[index];

    value = callback(value, element, index);
  }

  return value;
}

export function backwardsReduce(array, callback, initialValue) {
  let value = initialValue; ///

  const arrayLength = array.length;

  for (let index = arrayLength - 1; index >= 0; index--) {
    const element = array[index];

    value = callback(value, element, index);
  }

  return value;
}

export function forwardsForEach(array, callback) {
  const arrayLength = array.length;

  for (let index = 0; index < arrayLength; index++) {
    const element = array[index];

    callback(element, index);
  }
}

export function backwardsForEach(array, callback) {
  const arrayLength = array.length;

  for (let index = arrayLength - 1; index >= 0; index--) {
    const element = array[index];

    callback(element, index);
  }
}

export default {
  first,
  second,
  third,
  fourth,
  fifth,
  fifthLast,
  fourthLast,
  thirdLast,
  secondLast,
  firstLast,
  last,
  head,
  tail,
  back,
  front,
  push,
  unshift,
  concat,
  clear,
  copy,
  merge,
  splice,
  replace,
  filter,
  find,
  prune,
  patch,
  augment,
  separate,
  forwardsFind,
  backwardsFind,
  forwardsSome,
  backwardsSome,
  forwardsEvery,
  backwardsEvery,
  forwardsReduce,
  backwardsReduce,
  forwardsForEach,
  backwardsForEach
};
