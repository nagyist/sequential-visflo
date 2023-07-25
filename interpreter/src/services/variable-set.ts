import { VariableValues } from '../types';

export class VariableSet {
	public static create(values: VariableValues): VariableSet {
		return new VariableSet(values);
	}

	private constructor(private readonly values: VariableValues) {}

	public read<TValue = unknown>(variableName: string): TValue {
		const value = this.values[variableName];
		if (value === undefined) {
			throw new Error(`Cannot read unset variable: ${variableName}`);
		}
		return value as TValue;
	}

	public set<TValue>(variableName: string, value: TValue) {
		if (value === undefined) {
			throw new Error('Cannot set variable to undefined');
		}
		this.values[variableName] = value;
	}

	public isSet(variableName: string): boolean {
		return this.values[variableName] !== undefined;
	}

	public delete(variableName: string) {
		if (this.isSet(variableName)) {
			delete this.values[variableName];
		} else {
			throw new Error(`Cannot delete unset variable: ${variableName}`);
		}
	}
}
