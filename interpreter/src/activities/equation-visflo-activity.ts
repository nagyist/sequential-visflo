import { Activity, createAtomActivity } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';
import { EquationVisfloStep } from '@visflo/grammar';

export function createEquationVisfloActivity(): Activity<VisfloGlobalState> {
	return createAtomActivity<EquationVisfloStep, VisfloGlobalState>('equationVisflo', {
		init: () => ({}),
		handler: async (step: EquationVisfloStep, { $variableSet, $dynamicEvaluator }: VisfloGlobalState) => {
			if (!step.properties.result) {
				throw new Error('Result variable is not defined');
			}

			const [a, b] = await Promise.all([
				$dynamicEvaluator.evaluateNumber(step.properties.a),
				$dynamicEvaluator.evaluateNumber(step.properties.b)
			]);

			const result = calculate(a, b, step.properties.operator);
			$variableSet.set(step.properties.result.name, result);
		}
	});
}

function calculate(a: number, b: number, operator: string): number {
	switch (operator) {
		case '+':
			return a + b;
		case '-':
			return a - b;
		case '*':
			return a * b;
		case '/':
			return a / b;
		case '%':
			return a % b;
		default:
			throw new Error(`Unknown operator: ${operator}`);
	}
}
