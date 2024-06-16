$(document).ready(() => {
	// RenderLoop to handle drawing frames onto the canvas
	class RenderLoop {
		constructor(pipeline, canvas) {
			this.timer = null;
			this.pipeline = pipeline;
			this.canvas = canvas;
			this.context = canvas.getContext("2d");
		}

		start() {
			this.stop();
			this.next();
		}

		stop() {
			cancelAnimationFrame(this.timer);
		}

		next() {
			this.timer = requestAnimationFrame(() => this.run());
		}

		run() {
			const frame = this.pipeline.consume();
			if (frame) {
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.context.drawImage(frame.image, 0, 0, this.canvas.width, this.canvas.height);
			}
			this.next();
		}
	}
});
