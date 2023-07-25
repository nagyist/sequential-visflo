import { StepModel, createStepModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';
import { VisfloStepModelConfiguration, configureVisfloStepModel } from './visflo-step-model';

export interface BreakVisfloStep extends Step {
	type: 'breakVisflo';
	componentType: 'task' | string;
}

export function createBreakVisfloStepModel(configuration?: VisfloStepModelConfiguration): StepModel {
	const componentType = configuration?.componentType ?? 'task';

	return createStepModel<BreakVisfloStep>('breakVisflo', componentType, step => {
		configureVisfloStepModel(step, {
			category: configuration?.category ?? 'Flow',
			description: configuration?.description ?? 'Breaks the loop.',
			label: configuration?.label ?? 'Break'
		});

		step.validator({
			validate(context) {
				const parentTypes = context.getParentStepTypes();
				return parentTypes.indexOf('forVisflo') >= 0 ? null : 'Break must be inside a loop.';
			}
		});
	});
}
