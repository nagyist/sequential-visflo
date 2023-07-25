import {
	Dynamic,
	NullableAnyVariable,
	NullableVariable,
	booleanValueModelId,
	nullableAnyVariableValueModelId,
	nullableVariableValueModelId,
	numberValueModelId,
	stringValueModelId
} from 'sequential-workflow-editor-model';
import { VariableSet } from './variable-set';

export class DynamicEvaluator {
	public constructor(private readonly variableSet: VariableSet) {}

	public async evaluate<TValue>(dynamic: Dynamic<unknown>): Promise<TValue> {
		switch (dynamic.modelId) {
			case stringValueModelId:
			case numberValueModelId:
			case booleanValueModelId:
				return dynamic.value as TValue;

			case nullableVariableValueModelId:
			case nullableAnyVariableValueModelId: {
				const variable = dynamic.value as NullableVariable | NullableAnyVariable;
				if (!variable || !variable.name) {
					throw new Error('Variable is not set');
				}
				return this.variableSet.read<TValue>(variable.name);
			}
		}
		throw new Error(`Dynamic evaluator does not support model id: ${dynamic.modelId}`);
	}

	public evaluateString(dynamic: Dynamic<unknown>): Promise<string> {
		return this.evaluateTyped<string>(dynamic, 'string');
	}

	public evaluateNumber(dynamic: Dynamic<unknown>): Promise<number> {
		return this.evaluateTyped<number>(dynamic, 'number');
	}

	public evaluateBoolean(dynamic: Dynamic<unknown>): Promise<boolean> {
		return this.evaluateTyped<boolean>(dynamic, 'boolean');
	}

	private async evaluateTyped<TValue>(dynamic: Dynamic<unknown>, expectedType: string): Promise<TValue> {
		const value = await this.evaluate<TValue>(dynamic);
		const type = typeof value;
		if (type !== expectedType) {
			throw new Error(`Invalid type, expected ${expectedType}, got ${type}`);
		}
		return value;
	}
}
