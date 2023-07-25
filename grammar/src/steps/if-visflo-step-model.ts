import {
	Dynamic,
	NullableAnyVariable,
	StepModel,
	createBooleanValueModel,
	createBranchedStepModel,
	createBranchesValueModel,
	createChoiceValueModel,
	createDynamicValueModel,
	createNullableAnyVariableValueModel,
	createNumberValueModel,
	createStringValueModel
} from 'sequential-workflow-editor-model';
import { BranchedStep } from 'sequential-workflow-model';
import { VisfloStepModelConfiguration, configureVisfloStepModel } from './visflo-step-model';

export interface IfVisfloStep extends BranchedStep {
	type: 'ifVisflo';
	componentType: 'switch' | string;
	properties: {
		a: Dynamic<string | number | boolean | NullableAnyVariable>;
		comparison: string;
		b: Dynamic<string | number | boolean | NullableAnyVariable>;
	};
}

export function createIfVisfloStepModel(configuration?: VisfloStepModelConfiguration): StepModel {
	const componentType = configuration?.componentType ?? 'switch';

	return createBranchedStepModel<IfVisfloStep>('ifVisflo', componentType, step => {
		configureVisfloStepModel(step, {
			category: configuration?.category ?? 'Flow',
			description: configuration?.description ?? 'Branches the flow of execution.',
			label: configuration?.label ?? 'If'
		});

		const ab = createDynamicValueModel({
			models: [
				createNumberValueModel({}),
				createStringValueModel({}),
				createBooleanValueModel({}),
				createNullableAnyVariableValueModel({
					isRequired: true,
					valueTypes: ['string', 'number', 'boolean']
				})
			]
		});

		step.property('a').value(ab).hint('Left value of the comparison');
		step.property('comparison').value(
			createChoiceValueModel({
				choices: ['==', '===', '!=', '!==', '>', '<', '>=', '<='],
				defaultValue: '=='
			})
		);
		step.property('b').value(ab).hint('Right value of the comparison');
		step.branches().value(
			createBranchesValueModel({
				branches: {
					true: [],
					false: []
				}
			})
		);
	});
}
