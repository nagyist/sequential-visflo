import { SimpleEvent } from 'sequential-workflow-editor-model';

export interface LogItem {
	level: 'info' | 'warn' | 'error';
	message: string;
}

export class Logger {
	public readonly onLog = new SimpleEvent<LogItem>();

	public info(message: string): void {
		this.onLog.forward({
			level: 'info',
			message
		});
	}

	public warn(message: string): void {
		this.onLog.forward({
			level: 'warn',
			message
		});
	}

	public error(message: string): void {
		this.onLog.forward({
			level: 'error',
			message
		});
	}
}
