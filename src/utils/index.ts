export const mutateArray = (update) => (prevArray) => {
  const arrayToReturn = [...prevArray];
  update(arrayToReturn);
  return arrayToReturn;
}

export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const preventTransformOffscreen = (element, transform, max) => {
  const checkTopLeft = () => {
    if (transform.x >= 0 && transform.y >= 0) return;
    if (transform.x < 0) transform.x = 0;
    if (transform.y < 0) transform.y = 0;
    element.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }
  const checkBottomRight = () => {
    if (transform.x <= max.x && transform.y <= max.y) return;
    if (transform.x > max.x) transform.x = max.x;
    if (transform.y > max.y) transform.y = max.y;
    element.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }
  checkTopLeft();
  checkBottomRight();
}