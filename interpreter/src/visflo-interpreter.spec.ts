import {
	VisfloDefinition,
	createVisfloGrammar,
	Step,
	VariableDefinitions,
	createRootModel,
	createStepModel,
	createVariableDefinitionsValueModel
} from '@visflo/grammar';
import { createActivitySet, createAtomActivity } from 'sequential-workflow-machine';
import { VisfloGlobalState } from './visflo-global-state';
import { createVisfloInterpreter } from './visflo-interpreter';

describe('VisfloInterpreter', () => {
	interface XDefinition extends VisfloDefinition {
		properties: {
			inputs: VariableDefinitions;
			outputs: VariableDefinitions;
		};
	}

	interface XGlobalState extends VisfloGlobalState {
		userIp: string;
	}

	interface CopyInToOutStep extends Step {
		type: 'copyInToOut';
		componentType: 'task';
		properties: {};
	}

	const grammar = createVisfloGrammar<XDefinition>(gr => {
		gr.version(4);
		gr.inputsPropertyName('inputs');
		gr.outputsPropertyName('outputs');
		gr.definitionModel(def => {
			def.root(
				createRootModel<XDefinition>(root => {
					root.property('inputs').value(createVariableDefinitionsValueModel({}));
					root.property('outputs').value(createVariableDefinitionsValueModel({}));
				})
			);
			def.steps([
				createStepModel<CopyInToOutStep>('copyInToOut', 'task', step => {
					step.category('test');
				})
			]);
		});
	});

	const activitySet = createActivitySet([
		createAtomActivity<CopyInToOutStep, XGlobalState>('copyInToOut', {
			init: () => ({}),
			handler: async (_, { $variableSet, userIp }) => {
				expect(userIp).toBe('127.0.0.1');

				const black = $variableSet.read('black');
				$variableSet.set('white', black);
			}
		})
	]);

	const definition: XDefinition = {
		properties: {
			inputs: {
				variables: [{ name: 'black', type: 'string' }]
			},
			outputs: {
				variables: [{ name: 'white', type: 'string' }]
			}
		},
		sequence: [
			{
				componentType: 'task',
				type: 'copyInToOut',
				id: '0x1',
				name: 'copy',
				properties: {}
			}
		]
	};

	const interpreter = createVisfloInterpreter(grammar, activitySet, {
		init: s => ({
			...s,
			userIp: '127.0.0.1'
		})
	});

	it('executes correctly', async () => {
		const outputs = await interpreter.interpret(
			{ definition, version: 4 },
			{
				black: '0xCCC'
			}
		);

		expect(outputs['white']).toBe('0xCCC');
	});
});
