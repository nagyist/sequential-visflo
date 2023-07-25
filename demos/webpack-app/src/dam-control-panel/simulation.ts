const SIMULATION_HEIGHT = 0.4;
const WAVE_HEIGHT = 6;
const DAM_HEIGHT = 0.7;

export class Simulation {
	public static create() {
		const canvas = document.getElementById('simulation') as HTMLCanvasElement;
		const context = canvas.getContext('2d') as CanvasRenderingContext2D;
		const levelOfWaterInput = document.getElementById('waterLevel') as HTMLInputElement;

		const instance = new Simulation(canvas, context, levelOfWaterInput);
		instance.render();
		return instance;
	}

	private waveOffset = 0;
	private lockLevel = 1;

	private constructor(
		private readonly canvas: HTMLCanvasElement,
		private readonly context: CanvasRenderingContext2D,
		private readonly levelOfWaterInput: HTMLInputElement
	) {}

	public subscribeOnWaterLevelChange(callback: () => void) {
		this.levelOfWaterInput.addEventListener('input', callback, false);
	}

	public getWaterLevel(): number {
		const value = Number(this.levelOfWaterInput.value);
		return Math.min(100, Math.max(40, value));
	}

	public setLockLevel(value: number) {
		this.lockLevel = Math.min(100, Math.max(0, value)) / 100;
	}

	public render() {
		const width = window.innerWidth;
		const height = window.innerHeight * SIMULATION_HEIGHT;

		this.canvas.width = width;
		this.canvas.height = height;

		const damHeight = height * DAM_HEIGHT;
		const damTop = height - damHeight;

		const waterLevel = this.getWaterLevel() / 100;

		const wallWidth = width / 16;
		const wallWidth2 = wallWidth / 2;
		const wallLeft = width / 2 - wallWidth2;

		const outflowHeight = damHeight / 5;
		const outflowBottom = damHeight / 8;
		const outflowTop = height - outflowBottom - outflowHeight;

		const lockHeight = outflowHeight * this.lockLevel;

		const streamHeight = outflowHeight - lockHeight;

		// background
		this.context.fillStyle = '#BFE4F7';
		this.context.fillRect(0, 0, width, height);

		// water
		const waterHeight = damHeight * waterLevel - WAVE_HEIGHT;
		const waterWidth = width / 2 - wallWidth2;
		const waterTop = height - waterHeight;
		this.context.fillStyle = '#2E8BC0';
		this.context.beginPath();
		this.context.moveTo(0, waterTop);
		for (let x = 0; x < waterWidth; x++) {
			const y = waterTop + Math.sin(x / 22 + this.waveOffset) * WAVE_HEIGHT + Math.sin(this.waveOffset) * WAVE_HEIGHT;
			this.context.lineTo(x, y);
		}
		this.context.lineTo(waterWidth, height);
		this.context.lineTo(0, height);
		this.context.lineTo(0, height);
		this.context.lineTo(0, 0);
		this.context.closePath();
		this.context.fill();
		this.waveOffset -= 0.05;

		// wall
		this.context.fillStyle = '#FFF';
		this.context.fillRect(wallLeft, damTop, wallWidth, damHeight);

		// outflow
		this.context.fillStyle = '#222';
		this.context.fillRect(wallLeft, outflowTop - 10, wallWidth, 10);
		this.context.fillRect(wallLeft, outflowTop + outflowHeight, wallWidth, 10);

		// water in outflow
		this.context.fillStyle = '#2E8BC0';
		this.context.fillRect(wallLeft - 2, outflowTop + lockHeight, wallWidth + 2, streamHeight);

		if (this.lockLevel < 1) {
			// stream
			this.context.beginPath();
			this.context.arc(
				wallLeft + wallWidth - 5,
				height,
				height - outflowTop - lockHeight - streamHeight / 2,
				Math.PI * 1.5,
				Math.PI * 2,
				false
			);

			this.context.lineWidth = streamHeight;
			this.context.strokeStyle = '#2E8BC0';
			this.context.stroke();
		}

		// lock
		this.context.fillStyle = '#555';
		this.context.fillRect(wallLeft, outflowTop, wallWidth, lockHeight);

		requestAnimationFrame(() => this.render());
	}
}
