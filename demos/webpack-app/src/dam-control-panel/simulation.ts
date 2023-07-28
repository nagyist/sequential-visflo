const DISPLAY_HEIGHT = 0.4;
const WAVE_HEIGHT = 6;
const DAM_WIDTH = 0.05;
const DAM_HEIGHT = 0.7;
const OUTFLOW_HEIGHT = 0.2;
const OUTFLOW_BOTTOM = 0.1;
const WAVE_LENGTH = 22;
const WAVE_SPEED = 4;
const PIPE_HEIGHT = 10;
const LOCK_SPEED = 4;

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
	private lockLevelTarget = 1;
	private lockLevel = 0.5;
	private lastTime: number | null = null;

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
		this.lockLevelTarget = Math.min(100, Math.max(0, value)) / 100;
	}

	public readonly render = () => {
		const now = Date.now();
		const dt = this.lastTime ? (now - this.lastTime) / 1000 : 0;
		this.lastTime = now;

		const width = window.innerWidth;
		const height = window.innerHeight * DISPLAY_HEIGHT;

		this.canvas.width = width;
		this.canvas.height = height;

		const waterLevel = this.getWaterLevel() / 100;

		const damHeight = height * DAM_HEIGHT;
		const damTop = height - damHeight;
		const damWidth = width * DAM_WIDTH;
		const damLeft = width / 2 - damWidth / 2 - 1;

		const outflowHeight = damHeight * OUTFLOW_HEIGHT;
		const outflowBottom = damHeight * OUTFLOW_BOTTOM;
		const outflowTop = height - outflowBottom - outflowHeight;

		this.lockLevel += (this.lockLevelTarget - this.lockLevel) * (LOCK_SPEED * dt);
		const lockHeight = outflowHeight * this.lockLevel;

		const streamHeight = outflowHeight - lockHeight;

		// background
		this.context.fillStyle = '#BFE4F7';
		this.context.fillRect(0, 0, width, height);

		// water
		const waterHeight = damHeight * waterLevel - WAVE_HEIGHT;
		const waterWidth = width / 2 - damWidth / 2;
		const waterTop = height - waterHeight;
		this.context.fillStyle = '#2E8BC0';
		this.context.beginPath();
		this.context.moveTo(0, waterTop);
		for (let x = 0; x < waterWidth; x++) {
			const y = waterTop + Math.sin(x / WAVE_LENGTH + this.waveOffset) * WAVE_HEIGHT + Math.sin(this.waveOffset) * WAVE_HEIGHT;
			this.context.lineTo(x, y);
		}
		this.context.lineTo(waterWidth, height);
		this.context.lineTo(0, height);
		this.context.lineTo(0, height);
		this.context.lineTo(0, 0);
		this.context.closePath();
		this.context.fill();
		this.waveOffset -= dt * WAVE_SPEED;

		// wall
		this.context.fillStyle = '#FFF';
		this.context.fillRect(damLeft, damTop, damWidth, damHeight);

		// pipe
		this.context.fillStyle = '#222';
		this.context.fillRect(damLeft, outflowTop - PIPE_HEIGHT, damWidth, PIPE_HEIGHT * 2 + outflowHeight);

		// water in outflow
		this.context.fillStyle = '#2E8BC0';
		this.context.fillRect(damLeft - 2, outflowTop + lockHeight, damWidth + 2, streamHeight);

		if (this.lockLevel < 0.98) {
			// stream
			this.context.beginPath();
			this.context.arc(
				damLeft + damWidth - 5,
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
		this.context.fillRect(damLeft, outflowTop, damWidth, lockHeight);

		requestAnimationFrame(this.render);
	};
}
