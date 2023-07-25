import { Definition } from 'sequential-workflow-model';

export interface VisfloScript<TDefinition extends Definition = Definition> {
	version: number;
	definition: TDefinition;
}
