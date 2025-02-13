import { reactive } from 'vue';

export const createWallModule = () => {
  const walls = reactive([]);
  let wallLayer = null;
  const MIN_THICKNESS = 50;  // 최소 두께 50mm

  const setWallLayer = (layer) => {
    wallLayer = layer;
  };

  const findWallById = (id) => {
    return walls.find(wall => wall.id === id);
  };

  const updateWallThickness = (wall, thickness) => {
    if (wall) {
      wall.thickness = Math.max(thickness, MIN_THICKNESS);
    }
  };

  return {
    walls,
    setWallLayer,
    getWallLayer: () => wallLayer,
    findWallById,
    updateWallThickness,
    MIN_THICKNESS
  };
}; 