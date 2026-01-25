import dotenv from 'dotenv';
dotenv.config({
	path: '../.env.test',
	override: true,
	debug: false, // Prevent as many console.logs
});

import { DockerComposeEnvironment } from 'testcontainers';
import path from 'path';

export default async () => {
	process.env.NODE_ENV = 'test'; // Set environment to test
	process.env.CONTAINER_PREFIX = 'test'; // Container prefix to test so there's no conflict

	const composeFilePath = path.resolve(__dirname, '..');
	const composeFile = 'docker-compose.yml'; // Move to its own variable for clarity

	const environment = await new DockerComposeEnvironment(
		composeFilePath,
		composeFile,
	)
		.withProfiles('test')
		.up(); // Ensure no arguments are passed here

	(global as unknown as any).__TESTCONTAINERS__ = environment;
};
