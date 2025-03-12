import {World, Bodies} from 'matter-js';
import {BUCKET_CATEGORY, BUCKET_HEIGHT, FRUIT_CATEGORY} from './constants';

const AddFruitInBucket = (world, position, currentFruit, scale) => {
  const fruitRadius = currentFruit * 10;
  const fruit = Bodies.circle(position.x, position.y, fruitRadius, {
    restitution: 0.2,
    friction: 1,
    density: 1,
    label: 'fruit',
    render: {
      sprite: {
        texture: `../assets/images/fruits/1.png`,
        xScale: scale,
        yScale: scale,
      },
    },
    collisionFilter: {
      category: FRUIT_CATEGORY,
      mask: FRUIT_CATEGORY | BUCKET_CATEGORY,
    },
  });
  World.add(world, fruit);
  return fruit;
};
export default AddFruitInBucket;
