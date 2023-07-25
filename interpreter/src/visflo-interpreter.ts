import { ActivitySet, WorkflowMachineBuilder, createWorkflowMachineBuilder } from 'sequential-workflow-machine';
import { VisfloGlobalState } from './visflo-global-state';
import { Definition } from 'sequential-workflow-model';
import { VisfloGrammar, VisfloScript } from '@visflo/grammar';
import { VisfloScriptInterpreter, VisfloScriptInterpreterConfiguration } from './visflo-script-interpreter';
import { VisfloRootVariables } from './variables/root-variables';
import { VariableValues } from './types';

export class VisfloInterpreter<TDefinition extends Definition = Definition, TGlobalState extends VisfloGlobalState = VisfloGlobalState> {
	public static create<TDef extends Definition, TGlobState extends VisfloGlobalState>(
		grammar: VisfloGrammar<TDef>,
		activitySet: ActivitySet<TGlobState>,
		configuration: VisfloScriptInterpreterConfiguration<TGlobState>
	) {
		const activityTypes = activitySet.getTypes();
		const grammarTypes = Object.keys(grammar.definitionModel.steps);
		const missingTypes = grammarTypes.filter(t => !activityTypes.includes(t));
		if (missingTypes.length > 0) {
			throw new Error(`Missing activity types: ${missingTypes.join(', ')}`);
		}

		const builder = createWorkflowMachineBuilder<TGlobState>(activitySet);
		return new VisfloInterpreter<TDef, TGlobState>(builder, grammar, configuration);
	}

	private constructor(
		private readonly builder: WorkflowMachineBuilder<TGlobalState>,
		private readonly grammar: VisfloGrammar<TDefinition>,
		private readonly configuration: VisfloScriptInterpreterConfiguration<TGlobalState>
	) {}

	public interpret(script: VisfloScript<TDefinition>, inputs: VariableValues): Promise<VariableValues> {
		const interpreter = this.create(script, inputs);
		return interpreter.run();
	}

	public create(script: VisfloScript<TDefinition>, inputs: VariableValues): VisfloScriptInterpreter<TGlobalState> {
		const rootVariables = VisfloRootVariables.create(script.definition, this.grammar);
		const machine = this.builder.build(script.definition);
		return VisfloScriptInterpreter.create(machine, rootVariables, inputs, this.configuration);
	}
}

export const createVisfloInterpreter = VisfloInterpreter.create;
