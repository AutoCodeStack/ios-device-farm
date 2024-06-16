$(document).ready(() => {
	// Pipeline to manage the flow of frames
	class Pipeline {
		constructor() {
			this.back = new BackFrame();
			this.mid = new FrontFrame("mid");
			this.front = new FrontFrame("front");
		}

		push(blob) {
			this.back.swap(blob);

			if (!this.mid.loading && !this.mid.loaded) {
				this.mid.load(this.back.consume());
			}
		}

		consume() {
			if (this.mid.loaded) {
				const temp = this.mid;
				this.mid = this.front;
				this.front = temp;
				this.mid.load(this.back.consume());
			} else if (!this.mid.loading) {
				this.mid.load(this.back.consume());
			}

			return this.front.consume();
		}

		destroy() {
			this.back.destroy();
			this.mid.destroy();
			this.front.destroy();
		}
	}
});
