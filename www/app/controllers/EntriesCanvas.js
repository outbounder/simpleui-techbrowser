exports = function(view) {
	// TODO investigate why Canvas does not works well without w/h
	var circlePossitions = [ {
		x : 10,
		y : 280
	}, {
		x : 30,
		y : 180
	}, {
		x : 90,
		y : 40
	}, {
		x : 190,
		y : 80
	}, {
		x : 260,
		y : 50
	}, {
		x : 221,
		y : 169
	}, {
		x : 346,
		y : 73
	}, {
		x : 392,
		y : 142
	}, {
		x : 700,
		y : 200
	} ];
	
	var Stage = function(canvas) {
		this.context = canvas.getContext('2d');
		this.circles = [];

		this.add = function(circle) {
			this.circles.push(circle);
		}

		this.at = function(index) {
			return this.circles[index];
		}

		this.render = function() {
			this.context.clearRect(0, 0, 800, 443);

			this.context.beginPath();
			for ( var i = 0; i < this.circles.length; i++) {
				if (i == 0)
					this.context.moveTo(this.circles[i].getCenterX(),
							this.circles[i].getCenterY());
				this.context.lineTo(this.circles[i].getCenterX(),
						this.circles[i].getCenterY());
			}

			this.context.strokeStyle = "#fff";
			this.context.stroke();

			for ( var i = 0; i < this.circles.length; i++)
				this.circles[i].render(this.context);
		}

		this.renderOnReady = function() {
			for ( var i = 0; i < this.circles.length; i++) {
				if (!this.circles[i].ready)
					return;
			}

			this.render();
		}
	}

	var Circle = function(data, image) {

		this.ready = false;
		this.data = data;
		this.image = image;

		this.render = function(context) {
			context.drawImage(this.image, this.data.x, this.data.y);
			if (typeof this.data.number != "undefined"
					&& this.data.number != null) {
				var textWidth = context.measureText(this.data.number).width;
				context.fillText(this.data.number, this.getCenterX()
						- textWidth / 2, this.getCenterY());
			}
		}

		this.getX = function() {
			return this.data.x;
		};
		this.getY = function() {
			return this.data.y;
		};
		this.getWidth = function() {
			return this.image.width;
		};
		this.getHeight = function() {
			return this.image.height;
		};
		this.getCenterX = function() {
			return this.getX() + this.getWidth() / 2;
		};
		this.getCenterY = function() {
			return this.getY() + this.getHeight() / 2;
		};
	};

	var stage = new Stage(view);

	this.setData = function(circlePossitions) {
		var circles = [];
		for ( var i = 0; i < circlePossitions.length; i++) {

			var circleImage = new Image();
			circleImage.src = "/app/views/images/circle" + i + ".png";
			circleImage.index = i;
			circleImage.circle = new Circle(circlePossitions[i]);
			circleImage.onload = function() {
				this.circle.ready = true;
				this.circle.image = this;
				stage.renderOnReady();
			}
			stage.add(circleImage.circle);
		}
	}

	this.setCircleData = function(circleIndex, dataName, dataValue) {
		stage.at(circleIndex).data[dataName] = dataValue;
		stage.renderOnReady();
	}

	this.setData(circlePossitions);
}