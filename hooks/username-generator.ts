// usernameGenerator.ts

const adjectives = [
	"Swift",
	"Silent",
	"Brave",
	"Clever",
	"Mighty",
	"Lucky",
	"Fuzzy",
	"Bright",
	"Chill",
	"Witty",
];

const nouns = [
	"Falcon",
	"Tiger",
	"Otter",
	"Wolf",
	"Panda",
	"Eagle",
	"Shark",
	"Lion",
	"Fox",
	"Bear",
];

// Simple hash function to get a deterministic number from userId
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

export function generateUsername(userId: string): string {
	const hash = hashString(userId);

	// Pick adjective and noun based on hash
	const adj = adjectives[hash % adjectives.length];
	const noun = nouns[(hash >> 3) % nouns.length];

	// Add a short unique suffix from the hash for extra uniqueness
	const suffix = (hash % 10000).toString().padStart(4, "0");

	return `${adj}${noun}${suffix}`;
}

// Example usage:
// const username = generateUsername("265202e4-c031-701e-e2a8-f35e780c116d");
// console.log(username); // e.g., "SwiftFalcon1234"
