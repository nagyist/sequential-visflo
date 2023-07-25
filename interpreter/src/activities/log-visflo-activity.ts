import { LogVisfloStep } from '@visflo/grammar';
import { Activity, createAtomActivityFromHandler } from 'sequential-workflow-machine';
import { VisfloGlobalState } from '../visflo-global-state';

export function createLogVisfloActivity(): Activity<VisfloGlobalState> {
	return createAtomActivityFromHandler<LogVisfloStep, VisfloGlobalState>(
		'logVisflo',
		async (step: LogVisfloStep, { $dynamicEvaluator, $variableSet, $logger }: VisfloGlobalState) => {
			let message = await $dynamicEvaluator.evaluateString(step.properties.message);

			for (const variable of step.properties.variables.variables) {
				const value = $variableSet.isSet(variable.name) ? $variableSet.read(variable.name) || '<empty>' : '<not set>';
				const type = typeof value;
				// const name = formatVariableName(variable.name); // TODO
				const name = variable.name;
				message += `\n${name}=${value} (${type})`;
			}

			$logger.info(message);
		}
	);
}
