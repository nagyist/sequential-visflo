import { ForVisfloStep } from '@visflo/grammar';
import { Activity, createLoopActivity } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';

interface ForVisfloActivityState {
	indexVariableName: string;
}

export function createForVisfloActivity(): Activity<VisfloGlobalState> {
	return createLoopActivity<ForVisfloStep, VisfloGlobalState, ForVisfloActivityState>('forVisflo', {
		loopName: step => `FOR_${step.id}`,
		init: step => {
			if (!step.properties.indexVariable) {
				throw new Error('Index variable is not defined');
			}
			return {
				indexVariableName: step.properties.indexVariable.name
			};
		},
		onEnter: async (step, { $variableSet, $dynamicEvaluator }, { indexVariableName }) => {
			const startIndex = await $dynamicEvaluator.evaluateNumber(step.properties.from);

			$variableSet.set(indexVariableName, startIndex);
		},
		onLeave: (_, { $variableSet }, { indexVariableName }) => {
			$variableSet.delete(indexVariableName);
		},
		condition: async (step, { $variableSet, $dynamicEvaluator }, { indexVariableName }) => {
			const [from, increment] = await Promise.all([
				$dynamicEvaluator.evaluateNumber(step.properties.from),
				$dynamicEvaluator.evaluateNumber(step.properties.increment)
			]);
			if (increment === 0) {
				throw new Error('Increment cannot be 0');
			}

			const currentIndex = $variableSet.read<number>(indexVariableName);

			let canContinue: boolean;
			switch (step.properties.operator) {
				case '<':
					canContinue = currentIndex < from;
					break;
				case '<=':
					canContinue = currentIndex <= from;
					break;
				default:
					throw new Error('Comparison is not supported');
			}

			const newIndex = currentIndex + increment;

			$variableSet.set(indexVariableName, newIndex);
			return canContinue;
		}
	});
}
