import { InterruptedVisfloError } from './errors';
import { DynamicEvaluator } from './services/dynamic-evaluator';
import { EventDispatcher } from './services/event-dispatcher';
import { Logger } from './services/logger';
import { VariableSet } from './services/variable-set';
import { VariableValues } from './types';

export interface VisfloGlobalState {
	readonly startTime: number;
	readonly variableValues: VariableValues;
	interruptedError?: InterruptedVisfloError;

	// Services should have $ prefix.
	readonly $logger: Logger;
	readonly $variableSet: VariableSet;
	readonly $dynamicEvaluator: DynamicEvaluator;
	readonly $eventDispatcher: EventDispatcher;
}
