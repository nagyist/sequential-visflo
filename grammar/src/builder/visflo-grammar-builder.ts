import { DefinitionModelBuilder } from 'sequential-workflow-editor-model';
import { Definition } from 'sequential-workflow-model';
import { VisfloGrammar } from '../visflo-grammar';

export class VisfloGrammarBuilder<TDefinition extends Definition> {
	private readonly definitionModelBuilder = new DefinitionModelBuilder<TDefinition>();
	private _version = 0;
	private _inputsPropertyName?: keyof TDefinition['properties'];
	private _outputsPropertyName?: keyof TDefinition['properties'];

	public version(version: number): this {
		this._version = version;
		return this;
	}

	public definitionModel(build: (builder: DefinitionModelBuilder<TDefinition>) => void): this {
		build(this.definitionModelBuilder);
		return this;
	}

	public inputsPropertyName(name: keyof TDefinition['properties']): this {
		this._inputsPropertyName = name;
		return this;
	}

	public outputsPropertyName(name: keyof TDefinition['properties']) {
		this._outputsPropertyName = name;
		return this;
	}

	public build(): VisfloGrammar<TDefinition> {
		return {
			version: this._version,
			definitionModel: this.definitionModelBuilder.build(),
			inputsPropertyName: this._inputsPropertyName,
			outputsPropertyName: this._outputsPropertyName
		};
	}
}

export function createVisfloGrammar<TDefinition extends Definition = Definition>(
	build: (builder: VisfloGrammarBuilder<TDefinition>) => void
): VisfloGrammar<TDefinition> {
	const builder = new VisfloGrammarBuilder<TDefinition>();
	build(builder);
	return builder.build();
}
