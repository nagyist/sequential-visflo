import {
	AnyVariables,
	Dynamic,
	NullableVariable,
	StepModel,
	WellKnownValueType,
	createAnyVariablesValueModel,
	createDynamicValueModel,
	createNullableVariableValueModel,
	createStepModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';
import { VisfloStepModelConfiguration, configureVisfloStepModel } from './visflo-step-model';

export interface LogVisfloStep extends Step {
	type: 'logVisflo';
	componentType: 'task' | string;
	properties: {
		message: Dynamic<string | NullableVariable>;
		variables: AnyVariables;
	};
}

export function createLogVisfloStepModel(configuration?: VisfloStepModelConfiguration): StepModel {
	const componentType = configuration?.componentType ?? 'task';

	return createStepModel<LogVisfloStep>('logVisflo', componentType, step => {
		configureVisfloStepModel(step, {
			category: configuration?.category ?? 'Tracing',
			description: configuration?.description ?? 'Log a message.',
			label: configuration?.label ?? 'Log'
		});

		step.property('message').value(
			createDynamicValueModel({
				models: [
					createStringValueModel({}),
					createNullableVariableValueModel({
						valueType: WellKnownValueType.string
					})
				]
			})
		);

		step.property('variables').value(createAnyVariablesValueModel({}));
	});
}
