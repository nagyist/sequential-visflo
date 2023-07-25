import { StepModel } from 'sequential-workflow-editor-model';
import { createBreakVisfloStepModel } from './break-visflo-step-model';
import { createForVisfloStepModel } from './for-visflo-step-model';
import { createIfVisfloStepModel } from './if-visflo-step-model';
import { createInterruptVisfloStepModel } from './interrupt-visflo-step-model';
import { createLogVisfloStepModel } from './log-visflo-step-model';
import { createEquationVisfloStepModel } from './equation-visflo-step-model';

export function createVisfloStepModels(): StepModel[] {
	return [
		createBreakVisfloStepModel(),
		createEquationVisfloStepModel(),
		createForVisfloStepModel(),
		createIfVisfloStepModel(),
		createInterruptVisfloStepModel(),
		createLogVisfloStepModel()
	];
}
