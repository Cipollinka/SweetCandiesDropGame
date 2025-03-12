import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {useMachine} from '@xstate/react';
import {appMachine} from '@/machines/appMachine';
import {GameEngine} from 'react-native-game-engine';
import Matter, {Bodies, Body, Engine, Events, World} from 'matter-js';
import {
  BUCKET_CATEGORY,
  BUCKET_HEIGHT,
  BUCKET_THICKNESS,
  BUCKET_WIDTH,
  FRUIT_CATEGORY,
  SCALE,
} from '@/utils/constants';
import Bucket from '@/utils/Bucket';
import AddFruitInBucket from '@/utils/AddFruitInBucket';
import {FRUIT_BY_TYPE} from '@/utils/fruits';
import Background from '@/components/Background';
import HomeIcon from '@/assets/icons/home.svg';
import StrokedText from '@/components/ui/StrokedText';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@/components/ui/CustomText';
import Button from '@/components/ui/Button';
import {AppMachineContext} from 'App';

const {width, height} = Dimensions.get('window');

// Improved rendering components with proper positioning
const FruitRenderer = memo(props => {
  const {body, size, fruitType = 1} = props;
  const xPos = body.position.x - size / 2;
  const yPos = body.position.y - size / 2;

  // Use dynamic image based on fruit type if available
  const fruitImage = FRUIT_BY_TYPE[fruitType];

  return (
    <Image
      source={fruitImage}
      style={[
        styles.fruit,
        {
          left: xPos,
          top: yPos,
          width: size,
          height: size,
          transform: [{rotate: `${body.angle}rad`}],
        },
      ]}
      resizeMode="contain"
    />
  );
});

const BucketWall = props => {
  const {body, width, height, color} = props;
  const xPos = body.position.x - width / 2;
  const yPos = body.position.y - height / 2;

  return (
    <View
      style={[
        styles.wall,
        {
          left: xPos,
          top: yPos,
          width: width,
          height: height,
          // backgroundColor: color || '#28A5BA',
        },
      ]}
    />
  );
};

// Improved physics system
const Physics = (entities, {time}) => {
  if (!entities || !entities.physics) return entities;
  const {engine} = entities.physics;
  Engine.update(engine, time.delta * 0.7);
  return entities;
};

// Improved move system that properly updates entity positions
const MoveEntities = entities => {
  if (!entities) return entities;

  // Skip physics entity and gameState
  Object.keys(entities)
    .filter(key => key !== 'physics' && key !== 'gameState')
    .forEach(key => {
      if (entities?.[key] && entities?.[key]?.body) {
        const body = entities[key].body;

        if (body.position.y > height + 100) {
          World.remove(entities.physics.world, body);
          delete entities[key];
        }

        // For simple entities - directly update position and angle
        entities[key].body.position = body.position;
        entities[key].body.angle = body.angle;
      }
    });
  return entities;
};

export default function Game() {
  const navigation = useNavigation<any>();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const engineRef = useRef(null);
  const gameEngineRef = useRef<GameEngine>(null);
  const [currentFruit, setCurrentFruit] = useState(
    Math.floor(Math.random() * 4) + 1,
  );
  // Create a state for entities to properly initialize them
  const bestScore = AppMachineContext.useSelector(
    state => state.context.bestScore,
  );
  const {send} = AppMachineContext.useActorRef();
  const [entities, setEntities] = useState(null);
  // Add a state to track entity IDs for proper cleanup

  const initGame = () => {
    // Create the physics engine
    const engine = Engine.create({
      enableSleeping: false,
      positionIterations: 10,
      velocityIterations: 10,
      constraintIterations: 10,
    });
    const world = engine.world;
    engineRef.current = engine;

    // Bucket position
    const x = width / 2;
    const y = height;

    // Create bucket
    const {leftWall, rightWall, base} = Bucket(
      world,
      x,
      y,
      BUCKET_WIDTH,
      BUCKET_HEIGHT,
      BUCKET_THICKNESS,
    );

    // Create next fruit preview
    const nextFruitBody = Bodies.circle(width - 80, 120, currentFruit * 10, {
      isStatic: true,
      label: 'nextFruit',
    });
    World.add(world, nextFruitBody);

    // Define initial entities
    const initialEntities = {
      physics: {engine, world},
      bucket: {
        left: {
          body: leftWall,
          renderer: BucketWall,
          width: BUCKET_THICKNESS,
          height: BUCKET_HEIGHT,
          color: '#28A5BA',
        },
        right: {
          body: rightWall,
          renderer: BucketWall,
          width: BUCKET_THICKNESS,
          height: BUCKET_HEIGHT,
          color: '#28A5BA',
        },
        base: {
          body: base,
          renderer: BucketWall,
          width: BUCKET_WIDTH,
          height: BUCKET_THICKNESS,
        },
      },
      nextFruit: {
        body: nextFruitBody,
        size: currentFruit * 20,
        fruitType: currentFruit,
        renderer: FruitRenderer,
      },
      gameState: {
        isGameOver: false,
        maxHeight: height * 0.2,
        activeFruits: new Set(),
      },
    };

    // Set entities in state
    setEntities(initialEntities);

    // Set up collision detection
    Events.on(engine, 'collisionStart', event => {
      event.pairs.forEach(({bodyA, bodyB}) => {
        if (
          bodyA.label === 'fruit' &&
          bodyB.label === 'fruit' &&
          bodyA.circleRadius === bodyB.circleRadius
        ) {
          // Get body information before removing
          const positionA = {...bodyA.position};
          const positionB = {...bodyB.position};
          const radius = bodyA.circleRadius;
          const fruitTypeA = bodyA.fruitType || 1;

          // Calculate mid-point for new fruit
          const newPosition = {
            x: (positionA.x + positionB.x) / 2,
            y: (positionA.y + positionB.y) / 2,
          };

          // Remove the collided fruits from the physics world
          World.remove(world, bodyA);
          World.remove(world, bodyB);

          // Create new merged fruit with larger radius
          const nextRadius = radius + 10;
          const nextSize = nextRadius * 2;

          const newFruit = Bodies.circle(
            newPosition.x,
            newPosition.y,
            nextRadius,
            {
              restitution: 0.2,
              friction: 1,
              density: 1,
              label: 'fruit',
              fruitType: Math.min(fruitTypeA + 1, 4),
              collisionFilter: {
                category: FRUIT_CATEGORY,
                mask: FRUIT_CATEGORY | BUCKET_CATEGORY,
              },
            },
          );

          // Add new fruit to physics world
          World.add(world, newFruit);

          // Update entities in game engine
          if (gameEngineRef.current) {
            const currentEntities = gameEngineRef.current.state.entities;

            if (currentEntities.gameState) {
              delete currentEntities[bodyA.id];
              delete currentEntities[bodyB.id];

              currentEntities.gameState.activeFruits.delete(bodyA.id);
              currentEntities.gameState.activeFruits.delete(bodyB.id);

              currentEntities[newFruit.id] = {
                body: newFruit,
                size: nextSize,
                fruitType: newFruit.fruitType || Math.min(fruitTypeA + 1, 4),
                renderer: FruitRenderer,
              };

              currentEntities.gameState.activeFruits.add(newFruit.id);

              if (newPosition.y < currentEntities.gameState.maxHeight) {
                currentEntities.gameState.isGameOver = true;
                setGameOver(true);
              }

              setScore(prevScore => {
                const newScore = prevScore + nextSize;
                const currentBestScore = bestScore;
                const thresholds = [1500, 2500, 4000, 5500];
                const nextThreshold =
                  thresholds.find(t => t > currentBestScore) || 5500;

                if (newScore >= nextThreshold && !hasWon) {
                  setHasWon(true);
                }

                return newScore;
              });

              gameEngineRef.current.swap(currentEntities);
            }
          }
        }
      });
    });

    return engine;
  };

  useEffect(() => {
    const engine = initGame();
    return () => {
      Events.off(engine, 'collisionStart');
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  const resetGame = () => {
    // Reset game state
    setScore(0);
    setGameOver(false);
    setHasWon(false);
    setCurrentFruit(Math.floor(Math.random() * 4) + 1);
    if (gameEngineRef.current) {
      console.log('here');

      // gameEngineRef.current.clear();
      gameEngineRef.current.state.entities = {};
      setEntities(null);
    }

    // Clean up existing engine
    if (engineRef.current) {
      Events.off(engineRef.current, 'collisionStart');
      World.clear(engineRef.current.world, false);
      Engine.clear(engineRef.current);
    }

    // Reinitialize the game
    setTimeout(() => {
      initGame();
    }, 0);

    // Reset game engine if needed
  };
  console.log('gameEngineRef', gameEngineRef);

  useEffect(() => {
    if (hasWon) {
      // Update best score when player wins
      send({
        type: 'UPDATE_BEST_SCORE',
        score: score,
      });
      // Stop the game engine when player wins
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
      // Clear physics world
      if (engineRef.current && engineRef.current.world) {
        World.clear(engineRef.current.world, false);
      }
    }
  }, [hasWon, score, send]);

  const handlePress = event => {
    if (!engineRef.current || !gameEngineRef.current || hasWon) return;

    // Safety check for entities
    if (!gameEngineRef.current.state.entities) {
      console.warn('Entities not initialized in gameEngineRef');
      return;
    }

    const position = {
      x: event.nativeEvent.locationX,
      y: event.nativeEvent.locationY,
    };

    const currentEntities = {...gameEngineRef.current.state.entities};

    // Safety check for bucket
    if (!currentEntities.bucket) {
      console.warn('Bucket not found in entities');
      return;
    }

    const bucket = currentEntities.bucket;

    // Check if press is inside bucket
    const isInsideBucket =
      position.x > bucket?.left?.body?.position?.x + BUCKET_THICKNESS / 2 &&
      position.x < bucket?.right?.body?.position?.x - BUCKET_THICKNESS / 2 &&
      position.y < bucket?.base?.body?.position?.y &&
      position.y > bucket?.base?.body?.position?.y - BUCKET_HEIGHT;

    if (isInsideBucket) {
      // Add fruit to bucket
      const newFruit = AddFruitInBucket(
        engineRef.current.world,
        position,
        currentFruit,
        SCALE[currentFruit - 1],
      );

      // Add fruit type to physics body for merging logic
      newFruit.fruitType = currentFruit;

      // Add new fruit to entities
      currentEntities[newFruit.id] = {
        body: newFruit,
        size: currentFruit * 20,
        fruitType: currentFruit,
        renderer: FruitRenderer,
      };

      // Update active fruits
      if (currentEntities.gameState) {
        currentEntities.gameState.activeFruits.add(newFruit.id);
      }

      // Generate next fruit
      const nextFruitType = Math.floor(Math.random() * 4) + 1;

      // Safety check for nextFruit
      if (currentEntities?.nextFruit?.body) {
        // Update next fruit preview
        const nextFruitBody = currentEntities?.nextFruit?.body;

        // Remove old next fruit body
        World.remove(engineRef.current.world, nextFruitBody);

        // Create new next fruit body
        const updatedNextFruit = Bodies.circle(
          width - 80,
          120,
          nextFruitType * 10,
          {
            isStatic: true,
            label: 'nextFruit',
            fruitType: nextFruitType,
          },
        );

        // Add to world
        World.add(engineRef.current.world, updatedNextFruit);

        // Update entity
        currentEntities.nextFruit = {
          body: updatedNextFruit,
          size: nextFruitType * 20,
          fruitType: nextFruitType,
          renderer: FruitRenderer,
        };

        // Update current fruit state
        setCurrentFruit(nextFruitType);
      }

      // Force re-render by swapping entire entities object
      gameEngineRef.current.swap(currentEntities);
    }
  };

  const handleHomePress = () => {
    navigation.replace('Home');
  };

  return (
    <Background>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          <View className="flex-row items-center justify-between gap-2 mt-8 mx-4 z-20">
            <View className="opacity-0">
              <HomeIcon />
            </View>
            <StrokedText fontSize={40} y={30}>
              {score}
            </StrokedText>

            <TouchableOpacity onPress={handleHomePress}>
              <HomeIcon />
            </TouchableOpacity>
          </View>

          {entities ? (
            <GameEngine
              ref={gameEngineRef}
              style={styles.gameContainer}
              systems={[Physics, MoveEntities]}
              entities={gameEngineRef?.current?.state?.entities || entities}>
              <View style={styles.gameArea} />
            </GameEngine>
          ) : (
            <View style={styles.loadingContainer}>
              <Text>Loading game...</Text>
            </View>
          )}

          {entities?.bucket?.base && (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#FEFD1A', '#FD8704']}
              style={{
                position: 'absolute',
                top: entities?.bucket?.base?.body?.position?.y - 10,
                left: entities?.bucket?.base?.body?.position?.x - width / 2,
                width: 400,
                height: 100,
                zIndex: 20,
                borderTopWidth: 1,
                borderTopColor: 'red',
              }}
            />
          )}

          {gameOver && (
            <View style={styles.gameOverContainer}>
              <CustomText style={styles.gameOverText}>Game Over</CustomText>
              <StrokedText fontSize={35} y={25}>
                Final Score:
              </StrokedText>
              <StrokedText fontSize={35} y={25}>
                {score}
              </StrokedText>
              <Button
                width={200}
                title="Play Again"
                onPress={resetGame}
                variant="green"
              />
            </View>
          )}

          {hasWon && (
            <View style={styles.gameOverContainer}>
              <CustomText style={[styles.gameOverText, {color: '#FFD700'}]}>
                You Won!
              </CustomText>
              <StrokedText fontSize={35} y={25}>
                Final Score:
              </StrokedText>
              <StrokedText fontSize={35} y={25}>
                {score}
              </StrokedText>
              <View className="gap-4 w-[200px] mx-auto mt-4">
                <Button
                  width={200}
                  title="Play Again"
                  onPress={resetGame}
                  variant="green"
                />
                <Button width={200} title="Home" onPress={handleHomePress} />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gameArea: {
    flex: 1,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    zIndex: 10,
  },
  debug: {
    fontSize: 16,
    padding: 10,
    zIndex: 10,
    position: 'absolute',
    top: 60,
  },
  fruit: {
    position: 'absolute',
  },
  wall: {
    position: 'absolute',
    backgroundColor: 'red',
    zIndex: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 30,
    color: 'white',
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#28A5BA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  resetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
