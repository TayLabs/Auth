import path from 'node:path';
import {
	DockerComposeEnvironment,
	type StartedDockerComposeEnvironment,
} from 'testcontainers';

export default async function setup(): Promise<void> {
	const directory = path.resolve(__dirname, '../../..');
	const environment: StartedDockerComposeEnvironment =
		await new DockerComposeEnvironment(directory, ['docker-compose.yml'])
			.withProfiles('test')
			.withEnvironment({
				NODE_ENV: 'test',
				CONTAINER_PREFIX: 'test',
			})
			.withEnvironmentFile(path.resolve(__dirname, '../../../.env.test'))
			.up();

	(global as any).__DOCKER_COMPOSE_ENV__ = environment;
}
