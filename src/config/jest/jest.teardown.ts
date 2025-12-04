import { StartedDockerComposeEnvironment } from 'testcontainers';
import redisClient from '../redis/client';

export default async function teardown(): Promise<void> {
  redisClient.disconnect(); // close redis connection

  const environment = (global as any).__DOCKER_COMPOSE_ENV__ as
    | StartedDockerComposeEnvironment
    | undefined;

  if (environment) {
    await environment.down();
  }
}
