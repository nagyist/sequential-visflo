import {
	Dynamic,
	NullableVariable,
	StepModel,
	createDynamicValueModel,
	createNullableVariableValueModel,
	createNumberValueModel,
	createStepModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';
import { VisfloStepModelConfiguration, configureVisfloStepModel } from './visflo-step-model';

export interface InterruptVisfloStep extends Step {
	type: 'interruptVisflo';
	componentType: 'task' | string;
	properties: {
		code: Dynamic<number | NullableVariable>;
		message: Dynamic<string | NullableVariable>;
	};
}

export function createInterruptVisfloStepModel(configuration?: VisfloStepModelConfiguration): StepModel {
	const componentType = configuration?.componentType ?? 'task';

	return createStepModel<InterruptVisfloStep>('interruptVisflo', componentType, step => {
		configureVisfloStepModel(step, {
			category: configuration?.category ?? 'Flow',
			description: configuration?.description ?? 'Interrupt the execution.',
			label: configuration?.label ?? 'Interrupt'
		});

		step.property('code').value(
			createDynamicValueModel({
				models: [
					createNullableVariableValueModel({
						valueType: 'number',
						isRequired: true
					}),
					createNumberValueModel({})
				]
			})
		);

		step.property('message').value(
			createDynamicValueModel({
				models: [
					createNullableVariableValueModel({
						valueType: 'string',
						isRequired: true
					}),
					createStringValueModel({})
				]
			})
		);
	});
}
