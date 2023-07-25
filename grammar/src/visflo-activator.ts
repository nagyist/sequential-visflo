import { ModelActivator } from 'sequential-workflow-editor-model';
import { VisfloGrammar } from './visflo-grammar';
import { Definition } from 'sequential-workflow-model';
import { VisfloUidGenerator } from './visflo-uid-generator';
import { VisfloScript } from './visflo-script';

export class VisfloActivator<TDefinition extends Definition> {
	public static create<TDef extends Definition>(grammar: VisfloGrammar<TDef>): VisfloActivator<TDef> {
		const activator = ModelActivator.create(grammar.definitionModel, VisfloUidGenerator.next);
		return new VisfloActivator(activator, grammar);
	}

	private constructor(
		private readonly activator: ModelActivator<TDefinition>,
		private readonly grammar: VisfloGrammar<TDefinition>
	) {}

	public activateScript(): VisfloScript<TDefinition> {
		const definition = this.activator.activateDefinition();
		return {
			definition,
			version: this.grammar.version
		};
	}
}

export function activateVisfloScript<TDefinition extends Definition>(grammar: VisfloGrammar<TDefinition>): VisfloScript<TDefinition> {
	return VisfloActivator.create(grammar).activateScript();
}
