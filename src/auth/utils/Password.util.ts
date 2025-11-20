import argon2 from 'argon2';

export async function hashPasswordAsync(password: string) {
	try {
		const hash = await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16, // 64 MB
			timeCost: 5, // 5 iterations
			parallelism: 1, // 1 thread (node is single threaded)
		});

		return hash;
	} catch (err) {
		throw new Error('Password hashing failed');
	}
}

export async function verifyAsync(hash: string, password: string) {
	return argon2.verify(hash, password);
}
