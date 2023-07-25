import {
	NullableVariable,
	Step,
	VariableDefinitions,
	VisfloDefinition,
	createEquationVisfloStepModel,
	createIfVisfloStepModel,
	createNullableVariableValueModel,
	createNumberValueModel,
	createRootModel,
	createStepModel,
	createVariableDefinitionsValueModel,
	createVisfloGrammar
} from '@visflo/grammar';

export interface DamDefinition extends VisfloDefinition {
	properties: {
		inputs: VariableDefinitions;
		outputs: VariableDefinitions;
	};
}

export interface SetNumberStep extends Step {
	type: 'setNumber';
	componentType: 'task';
	properties: {
		variable: NullableVariable;
		value: number;
	};
}

const rootModel = createRootModel(root => {
	root.property('inputs').value(
		createVariableDefinitionsValueModel({
			defaultValue: {
				variables: [{ name: 'waterLevel', type: 'number' }]
			}
		})
	);
	root.property('outputs').value(
		createVariableDefinitionsValueModel({
			defaultValue: {
				variables: [{ name: 'lockLevel', type: 'number' }]
			}
		})
	);
});

export const damGrammar = createVisfloGrammar<DamDefinition>(gr => {
	gr.inputsPropertyName('inputs');
	gr.outputsPropertyName('outputs');
	gr.definitionModel(def => {
		def.valueTypes(['number']);
		def.root(rootModel);

		def.step(createIfVisfloStepModel());
		def.step(createEquationVisfloStepModel());

		def.step(
			createStepModel<SetNumberStep>('setNumber', 'task', step => {
				step.property('variable').value(
					createNullableVariableValueModel({
						valueType: 'number',
						isRequired: true
					})
				);
				step.property('value').value(createNumberValueModel({}));
			})
		);
	});
});
