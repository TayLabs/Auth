import { StartedDockerComposeEnvironment } from 'testcontainers';
import redisClient from '../redis/client';

export default async function teardown(): Promise<void> {
	// close redis connection gracefully
	try {
		await redisClient.quit();
	} catch (err) {
		// Redis might already be disconnected, ignore errors
	}

	const environment = (global as any).__DOCKER_COMPOSE_ENV__ as
		| StartedDockerComposeEnvironment
		| undefined;

	if (environment) {
		await environment.down();
	}
}
