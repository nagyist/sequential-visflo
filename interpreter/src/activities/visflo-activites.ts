import { Activity } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';
import { createBreakVisfloActivity } from './break-visflo-activity';
import { createForVisfloActivity } from './for-visflo-activity';
import { createIfVisfloActivity } from './if-visflo-activity';
import { createInterruptVisfloActivity } from './interrupt-visflo-activity';
import { createLogVisfloActivity } from './log-visflo-activity';
import { createEquationVisfloActivity } from './equation-visflo-activity';

export function createVisfloActivities(): Activity<VisfloGlobalState>[] {
	return [
		createBreakVisfloActivity(),
		createEquationVisfloActivity(),
		createForVisfloActivity(),
		createIfVisfloActivity(),
		createInterruptVisfloActivity(),
		createLogVisfloActivity()
	];
}
