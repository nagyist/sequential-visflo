import { VisfloDesigner, createVisfloDesigner } from '@visflo/designer';
import { damGrammar } from './grammar';
import { VisfloInterpreter, createVisfloInterpreter } from '@visflo/interpreter';
import { damActivitySet } from './interpreter';
import { Simulation } from './simulation';
import { startScript } from './start-script';

export class App {
	public static create(): App {
		const simulation = Simulation.create();

		const placeholder = document.getElementById('designer') as HTMLElement;
		const designer = createVisfloDesigner(placeholder, damGrammar, startScript, {
			toolbox: {
				isCollapsed: true
			}
		});

		const interpreter = createVisfloInterpreter(damGrammar, damActivitySet, {
			init: s => s
		});

		const app = new App(designer, simulation, interpreter);
		designer.onReady.subscribe(() => app.run());
		designer.onScriptChange.subscribe(() => app.run());
		simulation.subscribeOnWaterLevelChange(() => app.run());
		return app;
	}

	private constructor(
		private readonly designer: VisfloDesigner,
		private readonly simulation: Simulation,
		private readonly interpreter: VisfloInterpreter
	) {}

	private async run() {
		try {
			if (!this.designer.isValid()) {
				throw new Error('Definition is not valid');
			}

			const script = this.designer.getScript();
			const waterLevel = this.simulation.getWaterLevel();
			const interpreter = this.interpreter.create(script, {
				waterLevel
			});
			const outputs = await interpreter.run();

			const lockLevel = (outputs['lockLevel'] as number) || 0;
			this.simulation.setLockLevel(lockLevel);
		} catch (e) {
			console.error(e);
		}
	}
}

window.addEventListener('load', App.create, false);
