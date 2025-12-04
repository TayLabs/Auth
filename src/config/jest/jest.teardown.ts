import { StartedDockerComposeEnvironment } from 'testcontainers';

export default async function teardown(): Promise<void> {
	const environment = (global as any).__DOCKER_COMPOSE_ENV__ as
		| StartedDockerComposeEnvironment
		| undefined;

	if (environment) {
		await environment.down();
	}
}
