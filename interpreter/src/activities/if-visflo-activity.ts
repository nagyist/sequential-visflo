import { IfVisfloStep } from '@visflo/grammar';
import { Activity, branchName, createForkActivity } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';

export function createIfVisfloActivity(): Activity<VisfloGlobalState> {
	return createForkActivity<IfVisfloStep, VisfloGlobalState>('ifVisflo', {
		init: () => ({}),
		handler: async (step: IfVisfloStep, { $dynamicEvaluator }: VisfloGlobalState) => {
			const [a, b] = await Promise.all([
				$dynamicEvaluator.evaluate(step.properties.a),
				$dynamicEvaluator.evaluate(step.properties.b)
			]);

			const result = compare(a, b, step.properties.comparison);

			return branchName(result ? 'true' : 'false');
		}
	});
}

function compare(a: any, b: any, comparison: string): boolean {
	switch (comparison) {
		case '==':
			return a == b;
		case '===':
			return a === b;
		case '!=':
			return a != b;
		case '!==':
			return a !== b;
		case '>':
			return a > b;
		case '<':
			return a < b;
		case '>=':
			return a >= b;
		case '<=':
			return a <= b;
	}
	throw new Error(`Comparison is not supported: ${comparison}`);
}
