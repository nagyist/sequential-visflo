import { SimpleEvent, SimpleEventListener } from 'sequential-workflow-editor-model';

export class EventDispatcher {
	private readonly e = new SimpleEvent<unknown>();

	public dispatch(event: unknown) {
		this.e.forward(event);
	}

	public subscribe(listener: SimpleEventListener<unknown>) {
		return this.e.subscribe(listener);
	}
}
