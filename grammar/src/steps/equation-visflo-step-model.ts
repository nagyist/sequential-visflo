import {
	Dynamic,
	NullableVariable,
	WellKnownValueType,
	createChoiceValueModel,
	createStepModel,
	createDynamicValueModel,
	createNullableVariableValueModel,
	createNumberValueModel,
	StepModel
} from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';
import { VisfloStepModelConfiguration, configureVisfloStepModel } from './visflo-step-model';

export interface EquationVisfloStep extends Step {
	type: 'equationVisflo';
	componentType: 'task' | string;
	properties: {
		a: Dynamic<number | NullableVariable>;
		operator: string;
		b: Dynamic<number | NullableVariable>;
		result: NullableVariable;
	};
}

export function createEquationVisfloStepModel(configuration?: VisfloStepModelConfiguration): StepModel {
	const componentType = configuration?.componentType ?? 'task';

	return createStepModel<EquationVisfloStep>('equationVisflo', componentType, step => {
		configureVisfloStepModel(step, {
			category: configuration?.category ?? 'Math',
			description: configuration?.description ?? 'Performs a mathematical operation on two numbers.',
			label: configuration?.label ?? 'Equation'
		});

		const val = createDynamicValueModel({
			models: [
				createNumberValueModel({}),
				createNullableVariableValueModel({
					isRequired: true,
					valueType: WellKnownValueType.number
				})
			]
		});

		step.property('result').value(
			createNullableVariableValueModel({
				valueType: WellKnownValueType.number,
				isRequired: true
			})
		);

		step.property('a').value(val).label('A');

		step.property('operator').value(
			createChoiceValueModel({
				choices: ['+', '-', '*', '/', '%']
			})
		);

		step.property('b').value(val).label('B');
	});
}
