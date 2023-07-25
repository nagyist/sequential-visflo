import { Designer, DesignerExtension, StepsConfiguration, SimpleEvent } from 'sequential-workflow-designer';
import { EditorProvider } from 'sequential-workflow-editor';
import { Definition, DefinitionWalker } from 'sequential-workflow-model';
import { VisfloGrammar, VisfloScript, VisfloUidGenerator } from '@visflo/grammar';

export interface VisfloDesignerConfiguration {
	theme?: string;
	definitionWalker?: DefinitionWalker;
	isReadonly?: boolean;
	editor?: {
		isHeaderHidden?: boolean;
		isCollapsed?: boolean;
	};
	toolbox?: {
		isCollapsed?: boolean;
	};
	steps?: StepsConfiguration;
	undoStackSize?: number;
	designerExtensions?: DesignerExtension[];
}

export class VisfloDesigner {
	public static create<TDefinition extends Definition>(
		placeholder: HTMLElement,
		grammar: VisfloGrammar<TDefinition>,
		script: VisfloScript,
		configuration?: VisfloDesignerConfiguration
	) {
		// TODO: update the definition to highest version if needed

		const editorProvider = EditorProvider.create(grammar.definitionModel, {
			uidGenerator: VisfloUidGenerator.next,
			definitionWalker: configuration?.definitionWalker,
			isHeaderHidden: configuration?.editor?.isHeaderHidden
		});

		const designer = Designer.create(placeholder, script.definition, {
			theme: configuration?.theme,
			undoStackSize: configuration?.undoStackSize,
			isReadonly: configuration?.isReadonly,
			editors: {
				isCollapsed: configuration?.editor?.isCollapsed,
				globalEditorProvider: editorProvider.createRootEditorProvider(),
				stepEditorProvider: editorProvider.createStepEditorProvider()
			},
			validator: {
				step: editorProvider.createStepValidator(),
				root: editorProvider.createRootValidator()
			},
			steps: configuration?.steps ?? {},
			toolbox: {
				isCollapsed: configuration?.toolbox?.isCollapsed,
				groups: editorProvider.getToolboxGroups(),
				labelProvider: editorProvider.createStepLabelProvider()
			},
			controlBar: true,
			definitionWalker: configuration?.definitionWalker,
			extensions: configuration?.designerExtensions
		});

		const instance = new VisfloDesigner(designer, grammar.version);
		designer.onDefinitionChanged.subscribe(() => instance.onScriptChange.forward(instance.getScript()));
		return instance;
	}

	public readonly onScriptChange: SimpleEvent<VisfloScript> = new SimpleEvent<VisfloScript>();

	public readonly onReady: SimpleEvent<void> = this.designer.onReady;
	public readonly onIsEditorCollapsedChanged: SimpleEvent<boolean> = this.designer.onIsEditorCollapsedChanged;
	public readonly onIsToolboxCollapsedChanged: SimpleEvent<boolean> = this.designer.onIsToolboxCollapsedChanged;
	public readonly onSelectedStepIdChanged: SimpleEvent<string | null> = this.designer.onSelectedStepIdChanged;

	private constructor(
		private readonly designer: Designer,
		private readonly version: number
	) {}

	public getScript(): VisfloScript {
		return {
			version: this.version,
			definition: this.designer.getDefinition()
		};
	}

	public readonly setIsReadonly = this.designer.setIsReadonly.bind(this.designer);
	public readonly isToolboxCollapsed = this.designer.isToolboxCollapsed.bind(this.designer);
	public readonly setIsToolboxCollapsed = this.designer.setIsToolboxCollapsed.bind(this.designer);
	public readonly isEditorCollapsed = this.designer.isEditorCollapsed.bind(this.designer);
	public readonly setIsEditorCollapsed = this.designer.setIsEditorCollapsed.bind(this.designer);
	public readonly isValid = this.designer.isValid.bind(this.designer);
}

export const createVisfloDesigner = VisfloDesigner.create;
