import { WorkflowMachine, WorkflowMachineInterpreter } from 'sequential-workflow-machine';
import { VisfloGlobalState } from './visflo-global-state';
import { Logger } from './services/logger';
import { VariableSet } from './services/variable-set';
import { DynamicEvaluator } from './services/dynamic-evaluator';
import { VisfloRootVariables } from './variables/root-variables';
import { SimpleEvent } from 'sequential-workflow-editor-model';
import { VariableValues } from './types';
import { VariableValuesReader } from './variables/variable-values-reader';
import { EventDispatcher } from './services/event-dispatcher';

export interface VisfloScriptInterpreterConfiguration<TGlobalState extends VisfloGlobalState> {
	init: (state: VisfloGlobalState) => TGlobalState;
}

export class VisfloScriptInterpreter<TGlobalState extends VisfloGlobalState> {
	public static create<TGlobState extends VisfloGlobalState>(
		machine: WorkflowMachine<TGlobState>,
		rootVariables: VisfloRootVariables,
		inputs: VariableValues,
		configuration: VisfloScriptInterpreterConfiguration<TGlobState>
	) {
		const variableValues = VariableValuesReader.read(inputs, rootVariables.inputNames);
		const logger = new Logger();
		const variableSet = VariableSet.create(variableValues);
		const dynamicEvaluator = new DynamicEvaluator(variableSet);
		const eventDispatcher = new EventDispatcher();

		const interpreter = machine.create({
			init: () => {
				const state: VisfloGlobalState = {
					startTime: Date.now(),
					variableValues,
					$logger: logger,
					$variableSet: variableSet,
					$dynamicEvaluator: dynamicEvaluator,
					$eventDispatcher: eventDispatcher
				};
				return configuration.init(state);
			}
		});
		return new VisfloScriptInterpreter<TGlobState>(interpreter, rootVariables, logger, eventDispatcher);
	}

	public readonly onStatePathChanged = new SimpleEvent<string[]>();

	private constructor(
		private readonly interpreter: WorkflowMachineInterpreter<TGlobalState>,
		private readonly rootVariables: VisfloRootVariables,
		public readonly logger: Logger,
		public readonly eventDispatcher: EventDispatcher
	) {}

	public run(): Promise<VariableValues> {
		return new Promise((resolve, reject) => {
			try {
				this.interpreter.onChange(() => {
					const snapshot = this.interpreter.getSnapshot();
					this.onStatePathChanged.forward(snapshot.statePath);
				});
				this.interpreter.onDone(() => {
					const snapshot = this.interpreter.getSnapshot();

					if (snapshot.unhandledError) {
						reject(snapshot.unhandledError);
						return;
					}
					if (snapshot.globalState.interruptedError) {
						reject(snapshot.globalState.interruptedError);
						return;
					}

					const outputs = VariableValuesReader.read(snapshot.globalState.variableValues, this.rootVariables.outputNames);
					resolve(outputs);
				});
				this.interpreter.start();
			} catch (e) {
				reject(e);
			}
		});
	}
}
