import { InterruptVisfloStep } from '@visflo/grammar';
import { Activity, createAtomActivityFromHandler, interrupt } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';
import { InterruptedVisfloError } from '../errors';

export function createInterruptVisfloActivity(): Activity<VisfloGlobalState> {
	return createAtomActivityFromHandler<InterruptVisfloStep, VisfloGlobalState>('interruptVisflo', async (step, globalState) => {
		const [message, code] = await Promise.all([
			globalState.$dynamicEvaluator.evaluateString(step.properties.message),
			globalState.$dynamicEvaluator.evaluateNumber(step.properties.code)
		]);

		globalState.interruptedError = new InterruptedVisfloError(message, code);
		return interrupt();
	});
}
