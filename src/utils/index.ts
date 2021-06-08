export const mutateArray = (update) => (prevArray) => {
  const arrayToReturn = [...prevArray];
  update(arrayToReturn);
  return arrayToReturn;
}

export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}