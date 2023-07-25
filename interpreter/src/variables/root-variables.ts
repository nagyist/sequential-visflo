import {
	NullableVariableDefinition,
	Path,
	VariableDefinitions,
	nullableVariableDefinitionValueModelId,
	variableDefinitionsValueModelId
} from 'sequential-workflow-editor-model';
import { Definition } from 'sequential-workflow-model';
import { VisfloGrammar } from '@visflo/grammar';

export class VisfloRootVariables {
	public static create<TDefinition extends Definition>(
		definition: TDefinition,
		grammar: VisfloGrammar<TDefinition>
	): VisfloRootVariables {
		return new VisfloRootVariables(
			grammar.inputsPropertyName ? readVariableNames(definition, grammar, grammar.inputsPropertyName as string) : [],
			grammar.outputsPropertyName ? readVariableNames(definition, grammar, grammar.outputsPropertyName as string) : []
		);
	}

	private constructor(
		public readonly inputNames: string[],
		public readonly outputNames: string[]
	) {}
}

function readVariableNames<TDefinition extends Definition>(
	definition: TDefinition,
	grammar: VisfloGrammar<TDefinition>,
	propertyName: string
): string[] {
	const inputsPath = Path.create(['properties', propertyName]);
	const property = grammar.definitionModel.root.properties.find(p => p.path.equals(inputsPath));
	if (!property) {
		throw new Error(`Property ${propertyName} not found in root model`);
	}

	const value = definition.properties[propertyName];

	switch (property.value.id) {
		case variableDefinitionsValueModelId: {
			const variableDefinitions = value as VariableDefinitions;
			return variableDefinitions.variables.map(v => v.name);
		}
		case nullableVariableDefinitionValueModelId: {
			const variable = value as NullableVariableDefinition;
			return variable ? [variable.name] : [];
		}
		default:
			throw new Error(`Not supported value model id ${property.value.id}`);
	}
}
