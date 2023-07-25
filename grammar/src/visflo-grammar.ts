import { DefinitionModel } from 'sequential-workflow-editor-model';
import { Definition } from 'sequential-workflow-model';

export interface VisfloGrammar<TDefinition extends Definition = Definition> {
	version: number;
	definitionModel: DefinitionModel<TDefinition>;
	inputsPropertyName?: keyof TDefinition['properties'];
	outputsPropertyName?: keyof TDefinition['properties'];
}
