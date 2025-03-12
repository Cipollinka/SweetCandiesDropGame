// Create this as src/utils/matterHelper.js

import {Dimensions} from 'react-native';
import Matter from 'matter-js';

const {width, height} = Dimensions.get('window');

// Enable collision events
export const configureCollisionEvents = engine => {
  // Add collision detection
  Matter.Events.on(engine, 'collisionStart', event => {
    if (event.source && event.source.broadphase) {
      const gameEngine = event.source.broadphase.controller;
      if (gameEngine && gameEngine.dispatch) {
        gameEngine.dispatch({type: 'collision', pairs: event.pairs});
      }
    }
  });
};

// Setup world with proper physics settings
export const setupPhysicsWorld = () => {
  const engine = Matter.Engine.create({
    enableSleeping: false,
    constraintIterations: 4,
    velocityIterations: 8,
    positionIterations: 10,
  });

  const world = engine.world;
  world.gravity.y = 0.8;

  // Configure collision events
  configureCollisionEvents(engine);

  return {engine, world};
};

// Create boundary walls
export const createBoundaries = (world, thickness = 30) => {
  const floor = Matter.Bodies.rectangle(
    width / 2,
    height - thickness / 2,
    width,
    thickness,
    {isStatic: true, friction: 0.3, restitution: 0.4, label: 'floor'},
  );

  const leftWall = Matter.Bodies.rectangle(
    thickness / 2,
    height / 2,
    thickness,
    height,
    {isStatic: true, friction: 0.3, restitution: 0.4, label: 'leftWall'},
  );

  const rightWall = Matter.Bodies.rectangle(
    width - thickness / 2,
    height / 2,
    thickness,
    height,
    {isStatic: true, friction: 0.3, restitution: 0.4, label: 'rightWall'},
  );

  Matter.World.add(world, [floor, leftWall, rightWall]);

  return {floor, leftWall, rightWall};
};
