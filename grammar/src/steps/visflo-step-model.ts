import { StepModelBuilder, createStringValueModel } from 'sequential-workflow-editor-model';
import { Step } from 'sequential-workflow-model';

export interface VisfloStepModelConfiguration {
	componentType?: string;
	label?: string;
	category?: string;
	description?: string;
}

export function configureVisfloStepModel(
	builder: StepModelBuilder<Step>,
	configuration: Required<Omit<VisfloStepModelConfiguration, 'componentType'>>
) {
	builder.label(configuration.label);
	builder.category(configuration.category);
	builder.description(configuration.description);
	builder.name().value(
		createStringValueModel({
			defaultValue: configuration.label
		})
	);
}
