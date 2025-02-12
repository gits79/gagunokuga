import { reactive } from 'vue';

export const createWallModule = () => {
  const walls = reactive([]);
  let wallLayer = null;

  const setWallLayer = (layer) => {
    wallLayer = layer;
  };

  const findWallById = (id) => {
    return walls.find(wall => wall.id === id);
  };

  return {
    walls,
    setWallLayer,
    getWallLayer: () => wallLayer,
    findWallById
  };
}; 