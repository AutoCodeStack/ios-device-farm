// FrontFrame to manage image loading and rendering
class FrontFrame {
	constructor(name) {
		this.name = name;
		this.blob = null;
		this.image = new Image();
		this.url = null;
		this.loading = false;
		this.loaded = false;
		this.fresh = false;

		// Arrow functions automatically bind 'this' to the class instance
		this.image.onload = () => {
			this.loading = false;
			this.loaded = true;
			this.fresh = true;
		};

		this.image.onerror = () => {
			this.loading = false;
			this.loaded = false;
		};
	}

	load(blob) {
		// Reset before loading a new blob
		this.reset();

		if (!blob) return;

		this.blob = blob;
		this.url = URL.createObjectURL(this.blob);
		this.loading = true;
		this.loaded = false;
		this.fresh = false;
		this.image.src = this.url;
	}

	reset() {
		this.loading = false;
		this.loaded = false;
		if (this.blob) {
			URL.revokeObjectURL(this.url);
			this.blob = null;
			this.url = null;
		}
	}

	consume() {
		if (!this.fresh) return null;
		this.fresh = false;
		return this;
	}

	destroy() {
		this.reset();
		this.image = null;
	}
}
