export class InterruptedVisfloError extends Error {
	public constructor(
		message: string,
		public readonly code: number
	) {
		super(message);
		this.name = 'InterruptedVisfloError';
	}
}
