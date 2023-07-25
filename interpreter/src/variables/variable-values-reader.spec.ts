import { VariableValuesReader } from './variable-values-reader';

describe('VariableValuesReader', () => {
	it('returns only values for the given names', () => {
		const values = { a: 1, b: 2, c: 3 };

		const output = VariableValuesReader.read(values, ['a', 'c']);

		expect(output).toEqual({ a: 1, c: 3 });
	});

	it('returns an empty object if no names', () => {
		const values = { a: 1, b: 2, c: 3 };

		const output = VariableValuesReader.read(values, []);

		expect(output).toEqual({});
	});
});
