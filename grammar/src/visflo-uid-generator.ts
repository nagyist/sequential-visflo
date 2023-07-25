const LENGTH = 32;

export class VisfloUidGenerator {
	public static next(): string {
		let result = '';
		for (let i = 0; i < LENGTH; i++) {
			const char = Math.floor(Math.random() * 26) + 97;
			result += String.fromCharCode(char);
		}
		return result;
	}
}
