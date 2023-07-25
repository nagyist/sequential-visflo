import {
	Dynamic,
	NullableVariable,
	NullableVariableDefinition,
	StepModel,
	WellKnownValueType,
	createChoiceValueModel,
	createDynamicValueModel,
	createNullableVariableDefinitionValueModel,
	createNullableVariableValueModel,
	createNumberValueModel,
	createSequentialStepModel
} from 'sequential-workflow-editor-model';
import { SequentialStep } from 'sequential-workflow-model';
import { VisfloStepModelConfiguration, configureVisfloStepModel } from './visflo-step-model';

export interface ForVisfloStep extends SequentialStep {
	type: 'forVisflo';
	componentType: 'container' | string;
	properties: {
		from: Dynamic<number | NullableVariable>;
		to: Dynamic<number | NullableVariable>;
		increment: Dynamic<number | NullableVariable>;
		operator: string;
		indexVariable: NullableVariableDefinition;
	};
}

export function createForVisfloStepModel(configuration?: VisfloStepModelConfiguration): StepModel {
	const componentType = configuration?.componentType ?? 'container';

	return createSequentialStepModel<ForVisfloStep>('forVisflo', componentType, step => {
		configureVisfloStepModel(step, {
			category: configuration?.category ?? 'Flow',
			description: configuration?.description ?? 'Loop over a range of numbers.',
			label: configuration?.label ?? 'For'
		});

		step.property('from')
			.label('From')
			.value(
				createDynamicValueModel({
					models: [
						createNumberValueModel({}),
						createNullableVariableValueModel({
							isRequired: true,
							valueType: WellKnownValueType.number
						})
					]
				})
			);

		step.property('operator')
			.label('Operator')
			.value(
				createChoiceValueModel({
					choices: ['<', '<=']
				})
			);

		step.property('to')
			.label('To')
			.value(
				createDynamicValueModel({
					models: [
						createNumberValueModel({}),
						createNullableVariableValueModel({
							isRequired: true,
							valueType: WellKnownValueType.number
						})
					]
				})
			);

		step.property('increment')
			.label('Increment')
			.value(
				createDynamicValueModel({
					models: [
						createNumberValueModel({
							defaultValue: 1
						}),
						createNullableVariableValueModel({
							isRequired: true,
							valueType: WellKnownValueType.number
						})
					]
				})
			);

		step.property('indexVariable')
			.label('Index variable')
			.value(
				createNullableVariableDefinitionValueModel({
					valueType: WellKnownValueType.number,
					isRequired: true,
					defaultValue: {
						name: 'index',
						type: WellKnownValueType.number
					}
				})
			);
	});
}
