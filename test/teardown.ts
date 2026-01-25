export default async () => {
	if ((global as any).__TESTCONTAINERS__) {
		await (global as any).__TESTCONTAINERS__.down();
	}
};
