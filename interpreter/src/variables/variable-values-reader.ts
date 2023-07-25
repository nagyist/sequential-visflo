import { VariableValues } from '../types';

export class VariableValuesReader {
	public static read(values: VariableValues | undefined, names: string[]): VariableValues {
		if (values) {
			const values_ = values;
			return names.reduce<VariableValues>((result, name) => {
				const value = values_[name];
				if (value === undefined) {
					throw new Error(`Missing value for ${name}`);
				}
				result[name] = value;
				return result;
			}, {});
		}
		if (names.length > 0) {
			throw new Error('Missing input values');
		}
		return {};
	}
}
