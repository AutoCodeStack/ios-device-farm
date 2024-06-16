// BackFrame to hold the incoming frame
class BackFrame {
	constructor() {
		this.blob = null;
	}

	swap(blob) {
		this.blob = blob;
	}

	consume() {
		const blob = this.blob;
		this.blob = null;
		return blob;
	}

	destroy() {
		this.consume();
	}
}
