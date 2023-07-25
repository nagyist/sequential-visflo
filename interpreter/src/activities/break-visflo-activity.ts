import { BreakVisfloStep } from '@visflo/grammar';
import { Activity, break_, createBreakActivity } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';

export function createBreakVisfloActivity(): Activity<VisfloGlobalState> {
	return createBreakActivity<BreakVisfloStep, VisfloGlobalState>('breakVisflo', {
		init: () => ({}),
		loopName: () => -1,
		handler: async () => {
			return break_();
		}
	});
}
