import {
	VisfloGlobalState,
	createActivitySet,
	createAtomActivityFromHandler,
	createVisfloInterpreter,
	createVisfloActivities
} from '@visflo/interpreter';
import { SetNumberStep, damGrammar } from './grammar';

export type AlarmGlobalState = VisfloGlobalState;

const setNumberActivity = createAtomActivityFromHandler<SetNumberStep, AlarmGlobalState>('setNumber', async (step, { $variableSet }) => {
	if (!step.properties.variable) {
		throw new Error('Variable is not defined');
	}
	$variableSet.set(step.properties.variable.name, step.properties.value);
});

export const damActivitySet = createActivitySet([...createVisfloActivities(), setNumberActivity]);

export const damInterpreter = createVisfloInterpreter(damGrammar, damActivitySet, {
	init: gs => gs
});
