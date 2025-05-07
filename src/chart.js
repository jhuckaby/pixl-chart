// pixl-chart
// Very simple timeline chart
// Copyright (c) 2021 Joseph Huckaby and PixlCore.com
// MIT License

class Chart {
	
	constructor(args = {}) {
		this.events = {};
		this.canvas = null;
		this.layers = [];
		this.colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#3F51B5", "#4CAF50", "#546E7A", "#D4526E", "#A5978B", "#C7F464", "#81D4FA", "#2B908F", "#F9A3A4", "#90EE7E", "#FA4443", "#449DD1", "#F86624", "#69D2E7", "#EA3546", "#662E9B", "#C5D86D", "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044", "#662E9B", "#F86624", "#F9C80E", "#EA3546", "#43BCCD", "#5C4742", "#A5978B", "#8D5B4C", "#5A2A27", "#C4BBAF", "#A300D6", "#7D02EB", "#5653FE", "#2983FF", "#00B1F2", "#03A9F4", "#33B2DF", "#4ECDC4", "#13D8AA", "#FD6A6A", "#F9CE1D", "#FF9800"];
		this.background = '';
		this.fontFamily = 'Helvetica, sans-serif';
		this.fontSize = 12;
		this.fontColor = 'rgb(128, 128, 128)';
		this.titleSize = 16;
		this.titleStyle = 'bold';
		this.titlePadding = 15;
		this.title = '';
		this.subtitle = '';
		this.showSubtitle = true;
		this.lineWidth = 2;
		this.lineJoin = 'round';
		this.lineCap = 'butt';
		this.lineDashes = false;
		this.stroke = true;
		this.fill = 0.5;
		this.clip = false;
		this.horizTicks = 6;
		this.vertTicks = 6;
		this.vertLabelPadding = 10;
		this.vertLabelSide = 'left';
		this.horizLabelPadding = 25;
		this.borderColor = 'rgba(128, 128, 128, 0.25)';
		this.density = window.devicePixelRatio || 1;
		this.autoResize = true;
		this.autoManage = true;
		this.dataType = 'integer';
		this.dataSuffix = '';
		this.floatPrecision = 2;
		this.legend = true;
		this.legendMaxLines = 2;
		this.legendPadding = 5;
		this.zeroFloor = true;
		this.smoothing = true;
		this.smoothingMaxSamples = 200;
		this.hover = true;
		this.hoverSort = 0;
		this.cursor = 'crosshair';
		this.showDataGaps = false;
		this.dataGapImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAAXNSR0IArs4c6QAAADRJREFUCNedyjERAEEQAsERsjpwhQUK6Z9cRvZpVxNXPQDoVXHMUsxSxdJrvwmWeixVLMUfKik183saHHcAAAAASUVORK5CYII=";
		this.autoHeadroom = true;
		this.padding = { left:0, top:0, right:10, bottom:0 };
		this.zoom = null;
		this.width = 0;
		this.height = 0;
		this.progressive = false;
		this.delta = false;
		this.deltaMinValue = false;
		this.divideByDelta = false;
		this.flatten = null;
		
		this.dirty = false;
		this.hidden = false;
		
		// setup date/time stuff
		var opts = Intl.DateTimeFormat().resolvedOptions();
		this.locale = opts.locale;
		this.timeZone = opts.timeZone;
		this.dateStyles = {
			minute: {
				hour: 'numeric',
				hour12: false,
				minute: '2-digit',
				second: '2-digit'
			},
			hour: {
				hour: 'numeric',
				hour12: true,
				minute: '2-digit'
			},
			day: {
				hour: 'numeric',
				hour12: true
			},
			month: {
				month: 'short',
				day: 'numeric'
			},
			year: {
				month: 'short',
				// year: 'numeric'
			},
			tooltip: {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				hour12: true,
				minute: '2-digit'
			}
		};
		
		// allow args to override
		for (var key in args) this[key] = args[key];
		
		// fill out padding if user sparsely populated it
		this.padding.left = this.padding.left || 0;
		this.padding.top = this.padding.top || 0;
		this.padding.right = this.padding.right || 0;
		this.padding.bottom = this.padding.bottom || 0;
		
		this.init();
	}
	
	clone(overrides = {}) {
		// clone self and apply overrides
		var args = Object.assign({}, this);
		
		// cleanup and copy some deep props
		delete args.canvas;
		delete args.ctx;
		delete args.dirty;
		delete args.bounds;
		delete args.observer;
		delete args.events;
		delete args.tooltip;
		delete args.manager;
		delete args.idx;
		
		if (!('colors' in overrides)) args.colors = JSON.parse( JSON.stringify(args.colors) );
		if (!('dateStyles' in overrides)) args.dateStyles = JSON.parse( JSON.stringify(args.dateStyles) );
		if (!('padding' in overrides)) args.padding = JSON.parse( JSON.stringify(args.padding) );
		
		return new Chart( Object.assign(args, overrides) );
	}
	
	init() {
		// setup canvas and context
		var self = this;
		
		// preprocess data if user passed in layers
		if (this.layers.length) {
			var temp = this.layers;
			this.layers = [];
			this.addLayers(temp);
		}
		
		if (typeof(this.canvas) == 'string') this.canvas = document.querySelector(this.canvas);
		this.ctx = this.canvas.getContext('2d');
		
		if (this.cursor) {
			this.canvas.style.cursor = this.cursor;
		}
		if (this.autoResize) {
			this.setupObserver();
		}
		if (this.autoManage) {
			if (!ChartManager.inited) ChartManager.init();
			ChartManager.add(this);
		}
		if (this.hover) {
			this.setupHover();
		}
		if (this.showDataGaps && !this.gapPattern) {
			this.setupDataGaps();
		}
		else this.ready = true;
	}
	
	setupObserver() {
		// monitor canvas element for DOM size changes
		var self = this;
		var first = true;
		
		this.observer = new ResizeObserver( function() {
			if (first) { first = false; return; }
			self.dirty = true;
		} );
		
		this.observer.observe( this.canvas );
	}
	
	addLayer(layer_in) {
		// add new layer
		// layer: { title, data }
		
		// immediately make a copy so we don't touch the user's object
		var layer = Object.assign({}, layer_in);
		
		// deep copy the data array
		layer.data = JSON.parse( JSON.stringify(layer_in.data || []) );
		
		// assign idx and color
		layer.idx = this.layers.length;
		layer.color = layer.color || this.colors[ layer.idx % this.colors.length ];
		
		// detect date/time formats, parse as needed
		if (layer.data.length) {
			if (Array.isArray(layer.data[0])) {
				layer.data = layer.data.map( function(pair) { return { x: pair[0], y: pair[1] }; } );
			}
			
			if (typeof(layer.data[0].x) == 'string') {
				// assume date/time strings, parse them all
				layer.data.forEach( function(row) { row.x = (new Date(row.x)).getTime() / 1000; } ); 
			}
			else if (layer.data[0].x > 9999999999) {
				// assume millisecond-epoch, divide all by 1000
				layer.data.forEach( function(row) { row.x /= 1000; } );
			}
			
			if (layer.offsetX || layer.offsetY) {
				layer.data.forEach( function(row) {
					row.x += layer.offsetX || 0;
					row.y += layer.offsetY || 0;
				} );
			}
			
			if (this.delta) {
				for (var idx = layer.data.length - 1; idx >= 1; idx--) {
					layer.data[idx].oy = layer.data[idx].y;
					layer.data[idx].y -= layer.data[idx - 1].y;
					if ((this.deltaMinValue !== false) && (layer.data[idx].y < this.deltaMinValue)) layer.data[idx].y = this.deltaMinValue;
					if (this.divideByDelta) layer.data[idx].y /= ((layer.data[idx].x - layer.data[idx - 1].x) || 1);
				}
				layer.data[0].oy = layer.data[0].y;
				layer.data[0].y = 0;
				
				// copy second delta sample onto first one, as we have to fill in the gap
				// (delta layers don't have a sample 0, but we don't want to drop the sample as it won't line up with other non-delta graphs)
				if (layer.data.length > 1) layer.data[0].y = layer.data[1].y;
			}
		}
		
		this.layers.push(layer);
		this.dirty = true;
	}
	
	addLayers(layers) {
		// add multiple layers at once
		var self = this;
		layers.forEach( function(layer) { self.addLayer(layer); } );
		this.dirty = true;
	}
	
	addLayerSample(idx, row, max) {
		// append data sample to single layer, massage values as needed
		var layer = this.layers[idx];
		
		if (Array.isArray(row)) {
			// convert array to object
			row = { x: row[0], y: row[1] };
		}
		
		if (typeof(row.x) == 'string') {
			// assume date/time string, parse it
			row.x = (new Date(row.x)).getTime() / 1000;
		}
		else if (row.x > 9999999999) {
			// assume millisecond-epoch, divide by 1000
			row.x /= 1000;
		}
		
		if (layer.offsetX || layer.offsetY) {
			// apply layer offsets
			row.x += layer.offsetX || 0;
			row.y += layer.offsetY || 0;
		}
		
		if (this.delta) {
			// apply delta logic
			row.oy = row.y;
			
			if (layer.data.length) {
				var idx = layer.data.length;
				row.y -= layer.data[idx - 1].oy;
				if ((this.deltaMinValue !== false) && (row.y < this.deltaMinValue)) row.y = this.deltaMinValue;
				if (this.divideByDelta) row.y /= ((row.x - layer.data[idx - 1].x) || 1);
			}
			else {
				row.y = 0;
			}
		}
		
		// all done, push row onto layer
		layer.data.push(row);
		if (max && (layer.data.length > max)) layer.data.shift();
		this.dirty = true;
	}
	
	render() {
		// render the complete graph from scratch
		// set canvas width/height based on its size in the DOM
		if (!this.ready) return;
		
		// set canvas size based on DOM, or custom properties
		if (this.width && this.height) {
			this.canvas.width = this.width * this.density;
			this.canvas.height = this.height * this.density;
		}
		else if (this.autoResize) {
			this.canvas.width = this.canvas.offsetWidth * this.density;
			this.canvas.height = this.canvas.offsetHeight * this.density;
		}
		
		// do the actual canvas drawing
		this.draw();
		
		// redraw hover tooltip if visible
		this.redrawTooltip();
		
		// unset dirty flag
		this.dirty = false;
		
		// emit event for userspace
		this.emit('render');
	}
	
	draw() {
		// internal method for drawing only
		var padding = this.padding;
		
		var width = Math.ceil( this.canvas.width / this.density );
		var height = Math.ceil( this.canvas.height / this.density );
		this.ctx.clearRect( 0, 0, width, height );
		
		if (this.background) {
			this.ctx.save();
			this.ctx.fillStyle = this.background;
			this.ctx.fillRect( 0, 0, width, height );
			this.ctx.restore();
		}
		
		this.bounds = {
			x: 0 + padding.left,
			y: 0 + padding.top,
			width: width - (padding.left + padding.right),
			height: height - (padding.top + padding.bottom)
		};
		
		this.flattenLayers();
		this.locateDataLimits();
		
		this.renderTitle();
		this.renderLegend();
		this.renderVertAxis();
		this.renderHorizAxis();
		this.renderDataGaps();
		this.renderData();
	}
	
	flattenLayers() {
		// optionally flatten all layers into a single layer
		if (!this.flatten) return;
		
		var flatten = this.flatten;
		var merge_type = flatten.type || 'avg';
		var yes_round = !!this.dataType.match(/(integer|bytes|seconds|milliseconds)/);
		var time_index = {};
		
		// make sure we have all required props
		if (!('color' in flatten)) flatten.color = this.colors[0];
		if (!('fill' in flatten)) flatten.fill = 0.5;
		
		this.layers.forEach( function(layer) {
			layer.data.forEach( function(row) {
				if (!time_index[row.x]) {
					time_index[row.x] = { 
						x: row.x,
						total: row.y, 
						count: 1, 
						min: row.y, 
						max: row.y
					};
				}
				else {
					time_index[row.x].total += row.y;
					time_index[row.x].count++;
					if (row.y < time_index[row.x].min) time_index[row.x].min = row.y;
					if (row.y > time_index[row.x].max) time_index[row.x].max = row.y;
				}
				if (row.label) time_index[row.x].label = row.label;
			} );
		} );
		
		var rows = [];
		var sorted_times = Object.keys(time_index).sort( function(a, b) {
			return parseInt(a) - parseInt(b);
		});
		
		sorted_times.forEach( function(key) {
			var index = time_index[key];
			var row = { x: index.x };
			if (index.label) row.label = index.label;
			
			switch (merge_type) {
				case 'avg': 
				case 'average': 
					var avg = index.total / index.count;
					if (yes_round) avg = Math.round(avg);
					row.y = avg;
				break;
				
				case 'total': 
					row.y = index.total;
				break;
				
				case 'min': 
				case 'minimum':
					row.y = index.min;
				break;
				
				case 'max': 
				case 'maximum':
					row.y = index.max;
				break;
			} // switch merge_type
			
			rows.push(row);
		});
		
		flatten.idx = 0;
		flatten.data = rows;
	}
	
	locateDataLimits() {
		// locate data extremes (limits) in 4 directions
		var limits = {
			xMin: null, yMin: null, xMax: null, yMax: null
		};
		
		if (this.flatten) {
			// layers have been collapsed into one
			var data = this.flatten.data, x = 0, y = 0;
			for (var idx = 0, len = data.length; idx < len; idx++) {
				x = data[idx].x;
				y = data[idx].y;
				if ((limits.xMin === null) || (x < limits.xMin)) limits.xMin = x;
				if ((limits.xMax === null) || (x > limits.xMax)) limits.xMax = x;
				if ((limits.yMin === null) || (y < limits.yMin)) limits.yMin = y;
				if ((limits.yMax === null) || (y > limits.yMax)) limits.yMax = y;
			}
		}
		else {
			// normal layers
			this.layers.forEach( function(layer) {
				if (layer.hidden) return;
				var data = layer.data, x = 0, y = 0;
				for (var idx = 0, len = data.length; idx < len; idx++) {
					x = data[idx].x;
					y = data[idx].y;
					if ((limits.xMin === null) || (x < limits.xMin)) limits.xMin = x;
					if ((limits.xMax === null) || (x > limits.xMax)) limits.xMax = x;
					if ((limits.yMin === null) || (y < limits.yMin)) limits.yMin = y;
					if ((limits.yMax === null) || (y > limits.yMax)) limits.yMax = y;
				}
			} );
		}
		
		// make copy before zoom, for things like auto-subtitle generation
		this.origDataLimits = Object.assign({}, limits);
		
		if (this.zoom) {
			// user has supplied custom data limits (i.e. zoom)
			for (var key in this.zoom) {
				limits[key] = this.zoom[key];
			}
		}
		
		this.dataLimits = limits;
		
		// sanity checks
		if (this.zeroFloor && ((limits.yMin === null) || (limits.yMin > 0))) {
			limits.yMin = 0;
		}
		if (!limits.yMax) limits.yMax = 1;
		if (limits.yMin == limits.yMax) limits.yMin--;
		
		if (!limits.xMin || !limits.xMax) {
			limits.xMax = Math.floor( Date.now() / 1000 );
			limits.xMin = limits.xMax - 1;
		}
		if (limits.xMin == limits.xMax) limits.xMin--;
		
		if (this.autoHeadroom) this.addHeadroom();
		
		if (this.minHorizScale && ((limits.xMax - limits.xMin) < this.minHorizScale)) limits.xMax = limits.xMin + this.minHorizScale;
		if (this.minVertScale && ((limits.yMax - limits.yMin) < this.minVertScale)) limits.yMax = limits.yMin + this.minVertScale;
		
		limits.width = limits.xMax - limits.xMin;
		limits.height = limits.yMax - limits.yMin;
		
		var x_range = limits.xMax - limits.xMin;
		var date_fmt = '';
		
		if (x_range > 86400 * 32) date_fmt = 'year';
		else if (x_range > 86400 * 2) date_fmt = 'month';
		else if (x_range > 43200) date_fmt = 'day';
		else if (x_range > 120) date_fmt = 'hour';
		else date_fmt = 'minute';
		
		this.dateRange = date_fmt;
	}
	
	addHeadroom() {
		// add some vertical headroom based on data type and highest y
		// (this is so the y-axis labels are more sane, and the overall look is more pleasing)
		var limits = this.dataLimits;
		if (limits.yMax <= 0) return;
		
		switch (this.dataType) {
			case 'bytes':
				limits.yMax = Math.ceil( limits.yMax );
				if (limits.yMax < 1024) {
					// bytes
					if (limits.yMax < 10) {
						if (limits.yMax >= 7) limits.yMax = 10;
					}
					else {
						if (limits.yMax > 15) limits.yMax = Math.ceil( limits.yMax / 10 ) * 10;
						if (limits.yMax > 150) limits.yMax = Math.ceil( limits.yMax / 100 ) * 100;
					}
					if (limits.yMax > 1024) limits.yMax = 1024;
				}
				else {
					if (limits.yMax > 1024 * 1.5) limits.yMax = Math.ceil( limits.yMax / 1024 ) * 1024; // KB
					if (limits.yMax > 10240 * 1.5) limits.yMax = Math.ceil( limits.yMax / 10240 ) * 10240; // 10KB
					if (limits.yMax > 102400 * 1.5) limits.yMax = Math.ceil( limits.yMax / 102400 ) * 102400; // 100KB
					
					if (limits.yMax > 1048576 * 1.5) limits.yMax = Math.ceil( limits.yMax / 1048576 ) * 1048576; // MB
					if (limits.yMax > 10485760 * 1.5) limits.yMax = Math.ceil( limits.yMax / 10485760 ) * 10485760; // 10MB
					if (limits.yMax > 104857600 * 1.5) limits.yMax = Math.ceil( limits.yMax / 104857600 ) * 104857600; // 100MB
					
					if (limits.yMax > 1073741824 * 1.5) limits.yMax = Math.ceil( limits.yMax / 1073741824 ) * 1073741824; // GB
					if (limits.yMax > 10737418240 * 1.5) limits.yMax = Math.ceil( limits.yMax / 10737418240 ) * 10737418240; // 10GB
					if (limits.yMax > 107374182400 * 1.5) limits.yMax = Math.ceil( limits.yMax / 107374182400 ) * 107374182400; // 100GB
					
					if (limits.yMax > 1099511627776 * 1.5) limits.yMax = Math.ceil( limits.yMax / 1099511627776 ) * 1099511627776; // TB
				}
			break;
			
			case 'seconds':
				limits.yMax = Math.ceil( limits.yMax );
				if (limits.yMax < 60) {
					if (limits.yMax < 10) {
						if (limits.yMax >= 7) limits.yMax = 10;
					}
					else {
						if (limits.yMax > 15) limits.yMax = Math.ceil( limits.yMax / 10 ) * 10;
					}
					if (limits.yMax > 60) limits.yMax = 60;
				}
				else if (limits.yMax < 3600) {
					limits.yMax = Math.ceil( limits.yMax / 60 ) * 60;
					if (limits.yMax > 900) limits.yMax = Math.ceil( limits.yMax / 600 ) * 600;
				}
				else if (limits.yMax < 86400) {
					limits.yMax = Math.ceil( limits.yMax / 3600 ) * 3600;
				}
				else {
					limits.yMax = Math.ceil( limits.yMax / 86400 ) * 86400;
				}
			break;
			
			case 'milliseconds':
				if (limits.yMax < 0.1) {
					if (limits.yMax > 0.015) limits.yMax = Math.ceil( limits.yMax * 100 ) / 100;
					if (limits.yMax >= 0.07) limits.yMax = 0.1;
				}
				else if (limits.yMax < 1.0) {
					if (limits.yMax > 0.15) limits.yMax = Math.ceil( limits.yMax * 10 ) / 10;
					if (limits.yMax >= 0.7) limits.yMax = 1.0;
				}
				else if (limits.yMax < 10) {
					limits.yMax = Math.ceil( limits.yMax );
					if (limits.yMax >= 7) limits.yMax = 10;
				}
				else {
					limits.yMax = Math.ceil( limits.yMax );
					if (limits.yMax > 15) limits.yMax = Math.ceil( limits.yMax / 10 ) * 10;
					if (limits.yMax > 150) limits.yMax = Math.ceil( limits.yMax / 100 ) * 100;
					if (limits.yMax >= 1000) {
						limits.yMax = Math.ceil( limits.yMax / 1000 ) * 1000;
						if (limits.yMax < 60000) {
							if (limits.yMax < 10000) {
								if (limits.yMax >= 7000) limits.yMax = 10000;
							}
							else {
								if (limits.yMax > 15000) limits.yMax = Math.ceil( limits.yMax / 10000 ) * 10000;
							}
							if (limits.yMax > 60000) limits.yMax = 60000;
						}
						else if (limits.yMax < 3600000) {
							limits.yMax = Math.ceil( limits.yMax / 60000 ) * 60000;
							if (limits.yMax > 900000) limits.yMax = Math.ceil( limits.yMax / 600000 ) * 600000;
						}
						else if (limits.yMax < 86400000) {
							limits.yMax = Math.ceil( limits.yMax / 3600000 ) * 3600000;
						}
						else {
							limits.yMax = Math.ceil( limits.yMax / 86400000 ) * 86400000;
						}
					}
				}
			break;
			
			case 'integer':
			case 'float':
				if (limits.yMax < 0.1) {
					if (limits.yMax > 0.015) limits.yMax = Math.ceil( limits.yMax * 100 ) / 100;
					if (limits.yMax >= 0.07) limits.yMax = 0.1;
				}
				else if (limits.yMax < 1.0) {
					if (limits.yMax > 0.15) limits.yMax = Math.ceil( limits.yMax * 10 ) / 10;
					if (limits.yMax >= 0.7) limits.yMax = 1.0;
				}
				else if (limits.yMax < 10) {
					limits.yMax = Math.ceil( limits.yMax );
					if (limits.yMax >= 7) limits.yMax = 10;
				}
				else {
					limits.yMax = Math.ceil( limits.yMax );
					if (limits.yMax > 15) limits.yMax = Math.ceil( limits.yMax / 10 ) * 10;
					if (limits.yMax > 150) limits.yMax = Math.ceil( limits.yMax / 100 ) * 100;
					if (limits.yMax > 1500) limits.yMax = Math.ceil( limits.yMax / 1000 ) * 1000;
					if (limits.yMax > 15000) limits.yMax = Math.ceil( limits.yMax / 10000 ) * 10000;
					if (limits.yMax > 150000) limits.yMax = Math.ceil( limits.yMax / 100000 ) * 100000;
					if (limits.yMax > 1500000) limits.yMax = Math.ceil( limits.yMax / 1000000 ) * 1000000;
					if (limits.yMax > 15000000) limits.yMax = Math.ceil( limits.yMax / 10000000 ) * 10000000;
					if (limits.yMax > 150000000) limits.yMax = Math.ceil( limits.yMax / 100000000 ) * 100000000;
				}
			break;
		}
	}
	
	renderVertAxis() {
		// render data labels on left, adjust bounds for data and time ticks
		var ctx = this.ctx;
		var limits = this.dataLimits;
		var bounds = this.bounds;
		
		// first, pre-adjust bounds for horiz axis, which is a known fixed height
		bounds.height -= (this.horizLabelPadding + this.fontSize);
		
		ctx.save();
		ctx.scale( this.density, this.density );
		ctx.font = 'normal ' + this.fontSize + 'px ' + this.fontFamily;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = this.fontColor;
		ctx.strokeStyle = this.borderColor;
		ctx.lineWidth = 1;
		
		var labels = [];
		var widest = 0;
		var zlabel = false;
		
		// generate and measure all labels
		for (var idx = 0; idx <= this.vertTicks; idx++) {
			var value = limits.yMin + (((limits.yMax - limits.yMin) / this.vertTicks) * idx);
			if (!value && (limits.yMax > 0) && (limits.yMin < 0)) zlabel = true;
			var text = this.formatDataValue(value, this.dataType, this.dataSuffix);
			var info = ctx.measureText(text);
			if (info.width > widest) widest = info.width;
			var y = (bounds.y + bounds.height) - ((idx / this.vertTicks) * bounds.height);
			labels.push({ text, info, y, value });
		}
		
		if (!zlabel && (limits.yMax > 0) && (limits.yMin < 0)) {
			// y axis crosses the zero boundary -- add special label + dotted line
			// (only if one wasn't already created organically above)
			zlabel = true;
			var value = 0;
			var info = ctx.measureText(text);
			if (info.width > widest) widest = info.width;
			var pos = this.getDotPos({ x:0, y:value });
			var y = pos.y;
			labels.push({ text: "", info, y, value });
			labels.sort( function(a, b) { return a.value - b.value; } );
		}
		
		// if there are any duplicate labels, only show the extremes
		var lkeys = {};
		var has_dupes = false;
		for (var idx = 0, len = labels.length; idx < len; idx++) {
			var label = labels[idx];
			if (label.text in lkeys) has_dupes = true;
			lkeys[label.text] = 1;
		}
		
		// adjust bounds
		bounds.width -= (widest + (this.vertLabelPadding * 2));
		if (this.vertLabelSide == 'left') bounds.x += (widest + (this.vertLabelPadding * 2));
		
		// draw lines and labels
		for (var idx = 0, len = labels.length; idx < len; idx++) {
			var label = labels[idx];
			if (!label.value && zlabel) {
				ctx.lineWidth = 2;
				ctx.setLineDash([4, 4]);
				ctx.strokeStyle = this.fontColor;
			}
			else {
				ctx.lineWidth = 1;
				ctx.setLineDash([]);
				ctx.strokeStyle = this.borderColor;
			}
			
			ctx.beginPath();
			ctx.moveTo( bounds.x, label.y );
			ctx.lineTo( bounds.x + bounds.width, label.y );
			ctx.stroke();
			
			// prevent duplicate adjacent labels
			if ((idx == 0) || (idx == len - 1) || (!has_dupes)) {
				switch (this.vertLabelSide) {
					case 'left': ctx.fillText( label.text, (bounds.x - label.info.width) - this.vertLabelPadding, label.y ); break;
					case 'right': ctx.fillText( label.text, bounds.x + bounds.width + this.vertLabelPadding, label.y ); break;
				}
			}
		}
		
		ctx.restore();
	}
	
	renderHorizAxis() {
		// render time labels and tick lines
		var ctx = this.ctx;
		var limits = this.dataLimits;
		var bounds = this.bounds;
		
		ctx.save();
		ctx.scale( this.density, this.density );
		ctx.font = 'normal ' + this.fontSize + 'px ' + this.fontFamily;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = this.fontColor;
		ctx.strokeStyle = this.borderColor;
		ctx.lineWidth = 1;
		
		var labels = [];
		var date_fmt = this.dateRange;
		var idx_start = 0;
		var idx_end = this.horizTicks;
		
		if (this.vertLabelSide == 'right') {
			idx_start++;
			idx_end++;
		}
		
		for (var idx = idx_start; idx < idx_end; idx++) {
			var epoch = limits.xMin + (((limits.xMax - limits.xMin) / this.horizTicks) * idx);
			var text = this.formatDate(epoch, date_fmt);
			var x = bounds.x + ((idx / this.horizTicks) * bounds.width);
			labels.push({ text, x, line: true });
		}
		
		switch (this.vertLabelSide) {
			case 'left': labels[0].line = false; break;
			case 'right': labels[ labels.length - 1 ].line = false; break;
		}
		
		// draw lines and labels
		for (var idx = 0, len = labels.length; idx < len; idx++) {
			var label = labels[idx];
			if (label.line) {
				ctx.beginPath();
				ctx.moveTo( label.x, bounds.y );
				ctx.lineTo( label.x, bounds.y + bounds.height + 8 );
				ctx.stroke();
			}
			
			// prevent duplicate adjacent labels
			if (!idx || (label.text != labels[idx - 1].text)) {
				ctx.fillText( label.text, label.x, bounds.y + bounds.height + 12 );
			}
		}
		
		ctx.restore();
	}
	
	renderTitle() {
		// render title and eat up available bounds space
		var ctx = this.ctx;
		var bounds = this.bounds;
		
		var title = this.title;
		if (this.flatten && this.flatten.title) title = this.flatten.title;
		else if (this.flatten && this.flatten.prefixTitle) title = this.flatten.prefixTitle + ' ' + title;
		if (!title.length) return;
		
		ctx.save();
		ctx.scale( this.density, this.density );
		ctx.font = this.titleStyle + ' ' + this.titleSize + 'px ' + this.fontFamily;
		ctx.textAlign = 'center';
		ctx.fillStyle = this.fontColor;
		ctx.textBaseline = 'middle';
		
		if (this.showSubtitle) {
			ctx.fillText( title, bounds.x + (bounds.width / 2), bounds.y + this.titlePadding );
			
			ctx.font = 'normal ' + this.fontSize + 'px ' + this.fontFamily;
			ctx.fillText( this.getSubtitle(), bounds.x + (bounds.width / 2), bounds.y + (this.titleSize / 1) + this.titlePadding + 1 );
		}
		else {
			ctx.fillText( title, bounds.x + (bounds.width / 2), bounds.y + (this.titleSize / 2) + this.titlePadding );
		}
		
		ctx.restore();
		
		bounds.y += this.titleSize + (this.titlePadding * 2);
		bounds.height -= (this.titleSize + (this.titlePadding * 2));
	}
	
	getSubtitle() {
		// compose string for subtitle based on date range
		var limits = this.origDataLimits;
		var subtitle = '';
		if (this.subtitle) return this.subtitle;
		
		switch (this.dateRange) {
			case 'minute':
			case 'hour':
			case 'day':
				subtitle = this.formatDateRange( limits.xMin, limits.xMax, 'tooltip' );
			break;
			
			case 'month':
			case 'year':
				var opts = Object.assign({}, this.dateStyles.tooltip);
				delete opts.minute;
				delete opts.hour;
				delete opts.hour12;
				var left = this.formatDate( limits.xMin, opts );
				var right = this.formatDate( limits.xMax, opts );
				if (left == right) subtitle = left;
				else subtitle = left + ' - ' + right;
			break;
		} // switch dateRange
		
		return subtitle;
	}
	
	renderLegend() {
		// render legend at bottom of canvas
		var self = this;
		var lines = [];
		var ctx = this.ctx;
		var bounds = this.bounds;
		
		if (!this.legend) return;
		if (this.flatten) return;
		
		ctx.save();
		ctx.scale( this.density, this.density );
		ctx.font = 'normal ' + this.fontSize + 'px ' + this.fontFamily;
		ctx.textAlign = 'left';
		ctx.fillStyle = this.fontColor;
		ctx.textBaseline = 'middle';
		
		var line = null;
		
		this.layers.forEach( function(layer) {
			if (layer.hidden) return;
			var info = ctx.measureText( layer.title );
			
			// add space for icon + margins
			var width = info.width + 26;
			
			if (!line || (line.width + width > bounds.width)) {
				if (line) lines.push(line);
				line = { width:0, items:[] };
			}
			
			line.width += width;
			line.items.push({
				layer: layer,
				title: layer.title,
				width: width,
				info: info
			});
		} ); // foreach layer
		
		if (line) lines.push(line);
		if (!lines.length || (lines.length > this.legendMaxLines)) {
			ctx.restore();
			return;
		}
		
		var lineHeight = this.fontSize + 4;
		var halfLine = Math.floor( lineHeight / 2 );
		var legendHeight = (lines.length * lineHeight) + this.legendPadding;
		
		var x = 0;
		var y = (bounds.y + bounds.height) - legendHeight;
		
		lines.forEach( function(line) {
			x = Math.floor( (bounds.x + (bounds.width / 2)) - (line.width / 2) );
			
			line.items.forEach( function(item) {
				ctx.globalAlpha = ('opacity' in item.layer) ? item.layer.opacity : 1.0;
				ctx.fillStyle = item.layer.color;
				ctx.beginPath();
				ctx.arc( x + halfLine, y + halfLine, self.fontSize / 2, 0, 2 * Math.PI );
				ctx.fill();
				
				ctx.fillStyle = self.fontColor;
				ctx.fillText( item.title, x + 17, y + halfLine );
				
				x += item.width;
			} ); // foreach item
			
			y += lineHeight;
		} ); // foreach line
		
		ctx.restore();
		
		// adjust bounds
		bounds.height -= legendHeight;
	}
	
	renderData() {
		// render all data layers
		this.hoverPoints = {};
		this.dataLabels = [];
		this.isSmooth = true;
		
		if (this.flatten) {
			// special render pipeline for flatten mode
			var layer = this.flatten;
			if ((!layer.smoothing && !this.smoothing) || (layer.data.length > this.smoothingMaxSamples)) {
				this.isSmooth = false;
			}
			layer.dirty = true;
			this.renderOneLayer(layer);
			this.renderDataLabels();
			return;
		}
		
		// scan all layers for smoothness
		for (var idx = this.layers.length - 1; idx >= 0; idx--) {
			var layer = this.layers[idx];
			if ((!layer.smoothing && !this.smoothing) || (layer.data.length > this.smoothingMaxSamples)) {
				this.isSmooth = false;
			}
			layer.dirty = true;
		}
		
		if (!this.progressive) {
			while (this.renderOneLayer()) {;}
			this.renderDataLabels();
			return;
		}
		
		// progressively render
		if (!this.layerFrameRequested) this.renderNextLayer();
	}
	
	renderNextLayer() {
		// render one layer and schedule next one (progressive)
		this.layerFrameRequested = false;
		if (!this.layers) return; // sanity check
		
		var result = this.renderOneLayer();
		if (!result) {
			this.renderDataLabels();
			return;
		}
		
		this.layerFrameRequested = true;
		requestAnimationFrame( this.renderNextLayer.bind(this) );
	}
	
	renderOneLayer(layer) {
		// render first dirty layer
		var ctx = this.ctx;
		var bounds = this.bounds;
		
		if (!layer) layer = this.layers.filter( function(layer) { return layer.dirty && !layer.hidden; } ).shift();
		if (!layer) return false;
		
		ctx.save();
		ctx.scale( this.density, this.density );
		
		// optionally clip to bounds (for zoom)
		// don't enable this by default because it may cause a perf hit
		if (this.clip) {
			ctx.beginPath();
			ctx.rect( bounds.x - 1, bounds.y - 1, bounds.width + 2, bounds.height + 2 );
			ctx.clip();
		}
		
		if ('opacity' in layer) ctx.globalAlpha = layer.opacity;
		
		var func = 'renderLayer';
		if ((layer.smoothing || this.smoothing) && (layer.data.length <= this.smoothingMaxSamples)) func = 'renderSmoothLayer';
		this[func](layer);
		
		ctx.restore();
		
		delete layer.dirty;
		return true;
	}
	
	renderDataLabels() {
		// render data labels (i.e. timestamp annotations)
		var self = this;
		var ctx = this.ctx;
		var bounds = this.bounds;
		
		if (!this.dataLabels || !this.dataLabels.length) return;
		
		this.dataLabels.forEach( function(row) {
			var label = row.label;
			var pos = self.getDotPos(row);
			
			ctx.save();
			ctx.scale( self.density, self.density );
			ctx.font = 'normal ' + self.fontSize + 'px ' + self.fontFamily;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			ctx.lineWidth = label.lineWidth || 1;
			ctx.setLineDash( label.dashStyle || [2, 2] );
			ctx.strokeStyle = label.strokeStyle || 'rgba(128, 128, 128, 0.75)';
			
			ctx.beginPath();
			ctx.moveTo( pos.x, bounds.y );
			ctx.lineTo( pos.x, bounds.y + bounds.height );
			ctx.stroke();
			
			var info = ctx.measureText( label.text );
			var box = {
				width: self.fontSize + 6,
				height: info.width + 10
			};
			box.x = pos.x - box.width;
			box.y = bounds.y;
			
			ctx.setLineDash([]);
			ctx.fillStyle = label.color;
			ctx.fillRect( box.x, box.y, box.width, box.height );
			ctx.strokeRect( box.x, box.y, box.width, box.height );
			
			ctx.fillStyle = label.fontColor || 'white';
			ctx.translate( box.x + (box.width / 2), box.y + (box.height / 2) );
			ctx.rotate(270 * Math.PI / 180);
			ctx.fillText( label.text, 0, 0 );
			
			ctx.restore();
		} ); // foreach label
	}
	
	renderDataGaps() {
		// locate "gaps" in the data and render a pattern over those areas
		var self = this;
		var bounds = this.bounds;
		var ctx = this.ctx;
		var sm_offset = -1;
		var gaps = [];
		
		if (!this.showDataGaps) return;
		if (this.flatten) return;
		
		ctx.save();
		ctx.scale( self.density, self.density );
		
		// first, determine the smallest time offset between data samples
		// (i.e. the smallest allowed time 'gap' without alerting)
		this.layers.forEach( function(layer) {
			if (layer.hidden) return;
			var data = layer.data;
			var row = null;
			if (data.length < 2) return;
			
			for (var idx = 1, len = data.length; idx < len; idx++) {
				row = data[idx];
				if ((sm_offset == -1) || (row.x - data[idx - 1].x < sm_offset)) {
					sm_offset = row.x - data[idx - 1].x;
				}
			}
		}); // foreach layer
		
		// now find actual gaps in the data layers
		this.layers.forEach( function(layer) {
			if (layer.hidden) return;
			var data = layer.data;
			var row = null;
			if (data.length < 2) return;
			
			for (var idx = 1, len = data.length; idx < len; idx++) {
				row = data[idx];
				if (row.x - data[idx - 1].x > sm_offset) {
					// we have a gap
					var pstart = self.getDotPos( data[idx - 1] );
					var pend = self.getDotPos( row );
					gaps.push({ x: pstart.x, y: bounds.y, width: pend.x - pstart.x, height: bounds.height });
				}
			}
		}); // foreach layer
		
		// did we find any?
		if (!gaps.length) {
			ctx.restore();
			return;
		}
		
		// render gaps
		ctx.fillStyle = this.gapPattern;
		
		gaps.forEach( function(gap) {
			ctx.fillRect( gap.x, gap.y, gap.width, gap.height );
		} );
		
		ctx.restore();
	}
	
	getDotPos(dot) {
		// calculate canvas x/y position for data sample
		return {
			x: Math.floor( this.bounds.x + ( ((dot.x - this.dataLimits.xMin) / this.dataLimits.width) * this.bounds.width ) ),
			y: Math.floor( (this.bounds.y + this.bounds.height) - ( ((dot.y - this.dataLimits.yMin) / this.dataLimits.height) * this.bounds.height ) )
		};
	}
	
	renderLayer(layer, idx) {
		// render single layer using linear interpolation
		var ctx = this.ctx;
		var rows = layer.data;
		var color = layer.color;
		var bounds = this.bounds;
		
		// layer can specify custom line settings
		ctx.lineWidth = layer.lineWidth || this.lineWidth;
		ctx.lineJoin = layer.lineJoin || this.lineJoin;
		ctx.lineCap = layer.lineCap || this.lineCap;
		ctx.setLineDash( layer.lineDashes || this.lineDashes || [] );
		
		// first do a fill (if applicable)
		var fill = ('fill' in layer) ? layer.fill : this.fill;
		
		if (fill) {
			ctx.fillStyle = layer.fillStyle || ChartUtils.alphaColor( color, fill );
			ctx.beginPath();
			
			var pos = null;
			for (var idx = 0, len = rows.length; idx < len; idx++) {
				pos = this.getDotPos( rows[idx] );
				if (idx == 0) ctx.moveTo( pos.x, bounds.y + bounds.height );
				ctx.lineTo( pos.x, pos.y );
				if (idx == len - 1) ctx.lineTo( pos.x, bounds.y + bounds.height );
			}
			
			ctx.fill();
		} // fill
		
		// now stroke it
		var stroke = ('stroke' in layer) ? layer.stroke : this.stroke;
		if (stroke) {
			ctx.strokeStyle = color;
			ctx.beginPath();
		}
		
		var pos = null;
		var row = null;
		for (var idx = 0, len = rows.length; idx < len; idx++) {
			row = rows[idx];
			pos = this.getDotPos( row );
			if (stroke) {
				if (idx > 0) ctx.lineTo( pos.x, pos.y );
				else ctx.moveTo( pos.x, pos.y );
			}
			
			// bookkeeping
			this.hoverPoints[ pos.x ] = row.x;
			if (row.label) {
				if (!row.label.color) row.label.color = color;
				this.dataLabels.push(row);
			}
		}
		
		if (stroke) ctx.stroke();
	}
	
	renderSmoothLayer(layer, idx) {
		// render layer using monotone cubic interpolation
		var ctx = this.ctx;
		var rows = layer.data;
		var color = layer.color;
		var bounds = this.bounds;
		var density = this.density;
		
		// layer can specify custom line settings
		ctx.lineWidth = layer.lineWidth || this.lineWidth;
		ctx.lineJoin = layer.lineJoin || this.lineJoin;
		ctx.lineCap = layer.lineCap || this.lineCap;
		ctx.setLineDash( layer.lineDashes || this.lineDashes || [] );
		
		var xs = [], ys = [], pos = null, row = null;
		for (var idx = 0, len = rows.length; idx < len; idx++) {
			row = rows[idx];
			pos = this.getDotPos( row );
			xs.push( pos.x );
			ys.push( pos.y );
			
			// bookkeeping
			this.hoverPoints[ pos.x ] = row.x;
			if (row.label) {
				if (!row.label.color) row.label.color = color;
				this.dataLabels.push(row);
			}
		}
		
		var func = ChartUtils.createInterpolant(xs, ys);
		var xmin = xs[0];
		var xmax = xs[ xs.length - 1 ];
		var y = 0;
		
		// first do a fill (if applicable)
		var fill = ('fill' in layer) ? layer.fill : this.fill;
		if (fill) {
			ctx.fillStyle = layer.fillStyle || ChartUtils.alphaColor( color, fill );
			ctx.beginPath();
			ctx.moveTo( xmin, bounds.y + bounds.height );
			
			for (var x = xmin; x <= xmax; x += density) {
				y = func(x);
				ctx.lineTo( x, y );
			}
			
			ctx.lineTo( xmax, y );
			ctx.lineTo( xmax, bounds.y + bounds.height );
			ctx.fill();
		} // fill
		
		// now stroke it
		var stroke = ('stroke' in layer) ? layer.stroke : this.stroke;
		if (stroke) {
			ctx.strokeStyle = color;
			ctx.beginPath();
			
			for (var x = xmin; x <= xmax; x += 1) {
				y = func(x);
				if (x > xmin) ctx.lineTo( x, y );
				else ctx.moveTo( x, y );
			}
			
			ctx.stroke();
		} // stroke
	}
	
	update() {
		// mark chart as updated
		// (call this after changing data, for example)
		this.dirty = true;
		ChartManager.check();
	}
	
	setupHover() {
		// attach listeners for hover events
		var self = this;
		
		this.canvas.addEventListener('mouseenter', function(event) {
			// make sure no old overlays are left
			document.querySelectorAll('.pxc_tt_overlay').forEach( function(item) { item.remove(); } );
			
			var rect = self.canvas.getBoundingClientRect();
			var div = document.createElement('div');
			div.className = 'pxc_tt_overlay';
			div.style.left = '' + Math.floor(rect.left + window.scrollX) + 'px';
			div.style.top = '' + Math.floor(rect.top + window.scrollY) + 'px';
			div.style.width = '' + rect.width + 'px';
			div.style.height = '' + rect.height + 'px';
			div.style.cursor = self.cursor;
			document.body.appendChild(div);
			
			div.addEventListener('mousemove', function(event) {
				self.handleHover(event);
				self.emit('mousemove', event);
			}, false );
			
			div.addEventListener('mouseleave', function(event) {
				self.cancelHover();
				div.remove();
				self.emit('mouseout', event);
			}, false );
			
			div.addEventListener('mousedown', function(event) { self.emit('mousedown', event); }, false );
			div.addEventListener('mouseup', function(event) { self.emit('mouseup', event); }, false );
			div.addEventListener('click', function(event) { self.emit('click', event); }, false );
			
			self.emit('mouseover', event);
		}, false);
	}
	
	redrawTooltip() {
		// force a redraw of tooltip, if already visible
		if (!this.tooltip || !this.tooltip.lastHoverPt) return;
		
		this.tooltip.epoch = 0;
		this.handleHover( this.tooltip.lastHoverPt );
	}
	
	handleHover(event) {
		// position and draw hover tooltip
		var self = this;
		var bounds = this.bounds;
		var px = event.offsetX;
		var py = event.offsetY;
		
		if (!this.bounds) return; // sanity
		
		if ((px < bounds.x - 1) || (px >= bounds.x + bounds.width + 1) || (py < bounds.y) || (py >= bounds.y + bounds.height)) {
			// mouse is outside bounds, but still inside canvas -- treat this as outside
			return this.cancelHover();
		}
		
		// find nearest datapoint X
		var best_dist = bounds.width * 2; // just something very high
		var best_x = 0;
		var epoch = false;
		var dist = 0;
		
		for (var x in this.hoverPoints) {
			x = parseInt(x);
			dist = Math.abs(x - px);
			if (dist < best_dist) {
				best_dist = dist;
				best_x = x;
				epoch = this.hoverPoints[x];
			}
		}
		
		if (!epoch) return this.cancelHover();
		
		// if tooltip is already visible for the same datapoint, don't waste time rerendering it
		if (this.tooltip && (this.tooltip.epoch == epoch)) return;
		
		var family = [];
		var layers = this.flatten ? [this.flatten] : this.layers;
		
		layers.forEach( function(layer, idx) {
			if (layer.hidden) return;
			var data = layer.data;
			var row = null;
			
			for (var x = 0, len = data.length; x < len; x++) {
				row = data[x];
				if (row.x == epoch) {
					// include this layer in hover tooltip
					family.push({
						layer: layer,
						idx: idx,
						row: row,
						value: row.y
					});
					idx = len;
				}
			} // x loop
		}); // foreach layer
		
		var html = '';
		
		html += '<div class="pxc_tt_content" style="';
			html += 'font-family:' + this.fontFamily + ';';
			html += 'font-size:' + this.fontSize + 'px;';
			html += 'color:' + this.fontColor + ';';
			html += 'line-height:' + Math.floor(this.fontSize * (4/3)) + 'px;';
		html += '">';
		
		// date/time stamp
		var topts = Object.assign({}, this.dateStyles.tooltip);
		if (this.dateRange == 'minute') topts.second = '2-digit';
		
		html += '<div class="pxc_tt_timestamp">';
		html += this.formatDate( epoch, topts );
		html += '</div>';
		html += '<table class="pxc_tt_table">';
		
		// sort items by value, ascending or descending
		if (this.hoverSort) family.sort( function(a, b) {
			return (self.hoverSort == -1) ? (b.value - a.value) : (a.value - b.value);
		} );
		
		// add all lines (layers)
		family.forEach( function(fam) {
			var layer = fam.layer;
			var value = fam.value;
			var row = fam.row;
			var text = self.formatDataValueForTooltip(value, self.dataType, self.dataSuffix);
			var color = layer.color;
			var opacity = ('opacity' in layer) ? layer.opacity : 1.0;
			var sty = 'opacity:' + opacity + ';';
			if (row.label && row.label.color && row.label.tooltip) sty += 'color:' + row.label.color + ';';
			
			html += '<tr>';
			html += '<td><div class="pxc_tt_dot" style="background-color:' + color + '; ' + sty + '"></div></td>';
			html += '<td><div class="pxc_tt_title" style="' + sty + '">' + (layer.tooltipTitle || layer.title) + '</div></td>';
			html += '<td><div class="pxc_tt_value" style="' + sty + '">' + text + '</div></td>';
			html += '</tr>';
		} );
		
		html += '</table>';
		html += '</div>';
		
		// measure canvas position in page
		var rect = this.canvas.getBoundingClientRect();
		
		if (this.tooltip) {
			// tooltip is already visible, just update it
			this.tooltip.epoch = epoch;
		}
		else {
			// tooltip is not yet visible, so create it in DOM
			this.tooltip = {
				epoch: epoch,
				div: document.createElement('div'),
				line: document.createElement('div'),
				points: {}
			};
			
			this.tooltip.div.className = 'pxc_tooltip' + (this.isSmooth ? ' pxc_smooth' : '');
			this.tooltip.line.className = 'pxc_line' + (this.isSmooth ? ' pxc_smooth' : '');
			
			this.tooltip.div.style.cursor = this.cursor;
			this.tooltip.line.style.cursor = this.cursor;
			
			document.body.appendChild( this.tooltip.div );
			document.body.appendChild( this.tooltip.line );
		}
		
		// set content and position it
		this.tooltip.div.innerHTML = html;
		var width = this.tooltip.div.offsetWidth + 20;
		var left = Math.floor(rect.left + window.scrollX + (best_x / 1) - width);
		if (left < 0) left = Math.floor(rect.left + window.scrollX + (best_x / 1) + 20);
		
		this.tooltip.div.style.left = '' + left + 'px';
		this.tooltip.div.style.top = '' + Math.floor(rect.top + window.scrollY + (bounds.y + 10)) + 'px';
		
		this.tooltip.line.style.left = '' + Math.floor(rect.left + window.scrollX + best_x) + 'px';
		this.tooltip.line.style.top = '' + Math.floor(rect.top + window.scrollY + bounds.y) + 'px';
		this.tooltip.line.style.height = '' + Math.floor(bounds.height) + 'px';
		
		// render hover points
		family.forEach( function(fam) {
			var layer = fam.layer;
			var pos = self.getDotPos({ x: epoch, y: fam.value });
			var point = self.tooltip.points[ layer.idx ];
			if (!point) {
				self.tooltip.points[ layer.idx ] = point = document.createElement('div');
				point.className = 'pxc_tt_point' + (self.isSmooth ? ' pxc_smooth' : '');
				point.style.backgroundColor = layer.color;
				point.style.cursor = self.cursor;
				point.style.width = '' + Math.floor( 8 + self.lineWidth ) + 'px';
				point.style.height = '' + Math.floor( 8 + self.lineWidth ) + 'px';
				point.style.borderWidth = '' + Math.floor(self.lineWidth) + 'px';
				
				var half_size = Math.floor( ((8 + self.lineWidth) + (self.lineWidth * 2)) / 2 );
				point.style.borderRadius = '' + half_size + 'px';
				point.style.marginLeft = '' + Math.floor( 0 - half_size ) + 'px';
				point.style.marginTop = '' + Math.floor( 0 - half_size ) + 'px';
				
				document.body.appendChild( point );
			}
			point.style.left = '' + Math.floor(rect.left + window.scrollX + pos.x) + 'px';
			point.style.top = '' + Math.floor(rect.top + window.scrollY + pos.y) + 'px';
			point._pxc_epoch = epoch;
		});
		
		// remove unused points (irregular dataset)
		for (var idx in this.tooltip.points) {
			var point = this.tooltip.points[idx];
			if (point._pxc_epoch != epoch) {
				point.remove();
				delete this.tooltip.points[idx];
			}
		}
		
		this.tooltip.lastHoverPt = { offsetX: px, offsetY: py };
	}
	
	cancelHover() {
		// hide hover tooltip
		if (this.tooltip) {
			this.tooltip.div.remove();
			this.tooltip.line.remove();
			
			for (var idx in this.tooltip.points) {
				var point = this.tooltip.points[idx];
				point.remove();
			}
			
			delete this.tooltip;
		}
	}
	
	setupDataGaps() {
		// create diagonal stripe pattern for showing gaps in the data
		var self = this;
		
		var gap = new Image();
		gap.onload = function() {
			self.ready = true;
			self.gapPattern = self.ctx.createPattern( gap, 'repeat' );
		};
		gap.src = this.dataGapImage;
	}
	
	formatDataValue(value, type, suffix) {
		// format single data value for axis labels
		// abbreviate or reduce precision where possible
		var output = value;
		
		switch (type) {
			case 'bytes': 
				output = ChartUtils.getTextFromBytes( Math.floor(value), 10 ** (this.floatPrecision - 1) );
			break;
			
			case 'seconds':
				output = ChartUtils.getTextFromSeconds( value, true );
			break;
			
			case 'milliseconds':
				if (Math.abs(value) < 1000) output = '' + Math.floor(value) + ' ms';
				else output = ChartUtils.getTextFromSeconds( value / 1000, true );
			break;
			
			case 'integer': 
				if (Math.abs(value) >= 1000000000) output = '' + Math.floor(value / 1000000000) + 'B';
				else if (Math.abs(value) >= 1000000) output = '' + Math.floor(value / 1000000) + 'M';
				else if (Math.abs(value) >= 10000) output = '' + Math.floor(value / 1000) + 'K';
				else output = ChartUtils.numFmt.format( Math.floor(value) ); 
			break;
			
			case 'string': 
				output = value;
			break;
			
			default:
				output = '' + ChartUtils.shortFloat(output, this.floatPrecision);
			break;
		} // switch
		
		if (suffix) output += suffix;
		return output;
	}
	
	formatDataValueForTooltip(value, type, suffix) {
		// format single data value
		// higher precision where possible
		var output = value;
		
		switch (type) {
			case 'bytes': 
				output = ChartUtils.getTextFromBytes( Math.floor(value), 10 ** this.floatPrecision );
			break;
			
			case 'seconds':
				output = ChartUtils.getTextFromSeconds( value, false );
			break;
			
			case 'milliseconds':
				if (Math.abs(value) < 1000) output = '' + ChartUtils.shortFloat(output, this.floatPrecision) + ' ms';
				else output = ChartUtils.getTextFromSeconds( value / 1000, false );
			break;
			
			case 'integer': 
				output = ChartUtils.numFmt.format( Math.floor(value) ); 
			break;
			
			case 'string': 
				output = value;
			break;
			
			default:
				output = '' + ChartUtils.shortFloat(output, this.floatPrecision);
			break;
		} // switch
		
		if (suffix) output += suffix;
		return output;
	}
	
	formatDate(epoch, key) {
		// format date/time based on prefs
		var opts = (typeof(key) == 'object') ? key : this.dateStyles[key];
		opts.timeZone = this.timeZone;
		
		var date = new Date( epoch * 1000 );
		return date.toLocaleString( this.locale, opts );
	}
	
	formatDateRange(start, end, key) {
		// format date/time based on prefs
		var opts = (typeof(key) == 'object') ? key : this.dateStyles[key];
		opts.timeZone = this.timeZone;
		
		var formatter = new Intl.DateTimeFormat(this.locale, opts);
		return formatter.formatRange( new Date(start * 1000), new Date(end * 1000) );
	}
	
	isVisible() {
		// return true if chart canvas is currently visible
		if (this.hidden) return false;
		if (!this.canvas) return false;
		
		// Note: getBoundingClientRect is local to the viewport, not the page
		var rect = this.canvas.getBoundingClientRect();
		
		if (rect.width == 0) return false;
		if (rect.height == 0) return false;
		if (rect.right < 0) return false;
		if (rect.left >= window.innerWidth) return false;
		if (rect.bottom < 0) return false;
		if (rect.top >= window.innerHeight) return false;
		
		return true;
	}
	
	snapshot(opts, callback) {
		// create temp offscreen chart and snap it to a blob or url
		// { width?, height?, format, quality, type }
		var fmt = (opts.format || 'image/png').toLowerCase();
		if (fmt.match(/^\w+$/)) fmt = 'image/' + fmt;
		delete opts.format;
		
		var quality = opts.quality || 1.0;
		delete opts.quality;
		
		var type = opts.type || 'blob';
		delete opts.type;
		
		if (Object.keys(opts).length == 0) {
			// no customizations specified, so use current canvas for performance
			if (type == 'url') {
				// return data url, also fire callback if present
				var url = this.canvas.toDataURL( fmt, quality );
				if (callback) callback(url);
				return url;
			}
			
			// canvas to blob, callback only
			this.canvas.toBlob(function(blob) {
				callback(blob);
			}, fmt, quality);
			return;
		}
		
		// create clone canvas with user customizations applied
		opts.autoResize = false;
		opts.autoManage = false;
		opts.hover = false;
		opts.progressive = false;
		opts.canvas = document.createElement('canvas');
		
		if (!opts.width) opts.width = this.canvas.offsetWidth;
		if (!opts.height) opts.height = this.canvas.offsetHeight;
		
		var clone = this.clone(opts);
		clone.render();
		
		if (type == 'url') {
			// return data url, also fire callback if present
			var url = clone.canvas.toDataURL( fmt, quality );
			clone.destroy();
			if (callback) callback(url);
			return url;
		}
		
		// canvas to blob, callback only
		clone.canvas.toBlob(function(blob) {
			clone.destroy();
			callback(blob);
		}, fmt, quality);
	}
	
	download(opts = {}) {
		// convert chart to image and download it
		if (!opts.filename) {
			var title = this.title;
			if (this.flatten && this.flatten.title) title = this.flatten.title;
			
			var fmt = (opts.format || 'png').replace(/^image\//, '').toLowerCase();
			opts.filename = title.replace(/[^\w\-\.]+/g, '') + '.' + fmt;
		}
		var filename = opts.filename;
		delete opts.filename;
		opts.type = 'blob';
		
		this.snapshot(opts, function(blob) {
			var url = URL.createObjectURL(blob);
			
			var link = document.createElement('a');
			link.style.display = 'none';
			link.setAttribute('href', url);
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
		});
	}
	
	destroy() {
		// cleanup
		this.cancelHover();
		if (this.observer) this.observer.disconnect();
		delete this.observer;
		delete this.ctx;
		delete this.canvas;
		delete this.layers;
		delete this.dirty;
		delete this.layerFrameRequested;
		
		if (this.manager) {
			// remove from management
			this.manager.remove(this);
		}
		
		// make sure no old overlays are left
		document.querySelectorAll('.pxc_tt_overlay').forEach( function(item) { item.remove(); } );
	}
	
	// Simple EventEmitter mix-in:
	
	on(name, listener) {
		if (!(name in this.events)) {
			this.events[name] = [];
		}
		this.events[name].push(listener);
		return;
	}
	
	off(name, listener) {
		if (!(name in this.events)) return;
		const idx = this.events[name].indexOf(listener);
		if (idx > -1) {
			this.events[name].splice(idx, 1);
		}
		if (this.events[name].length === 0) {
			delete this.events[name];
		}
	}
	
	emit(name, ...args) {
		if (!(name in this.events)) return;
		this.events[name].forEach( function(listener) { listener(...args); } );
	}
	
}; // Chart

const ChartManager = {
	
	charts: [],
	inited: false,
	
	add(chart) {
		// add chart to management
		chart.idx = this.charts.length;
		chart.manager = this;
		this.charts.push(chart);
	},
	
	remove(chart) {
		// remove chart from management
		this.charts.splice(chart.idx, 1);
		
		// renumber remaining charts
		this.charts.forEach( function(chart, idx) {
			chart.idx = idx;
		} );
	},
	
	init() {
		// redraw charts as needed
		if (this.inited) return;
		window.addEventListener('scroll', ChartUtils.debounce( this.check.bind(this), 100 ), false);
		window.addEventListener('resize', ChartUtils.debounce( this.check.bind(this), 100 ), false);
		setInterval( this.check.bind(this), 250 );
		this.inited = true;
	},
	
	check() {
		// check all charts for redraw need, but only process one at a time
		var chart = this.charts.filter( function(chart) { return chart.dirty && chart.isVisible(); } ).shift();
		if (!chart) return;
		
		chart.render();
		
		// since we rendered one, there may be more dirty+visible, so recheck quickly while this is still true
		requestAnimationFrame( this.check.bind(this) );
	}
	
}; // ChartManager

const ChartUtils = {
	
	numFmt: new Intl.NumberFormat(),
	
	getTextFromSeconds(sec, abbrev) {
		// convert raw seconds to human-readable relative time
		var neg = '';
		if (sec < 0) { sec =- sec; neg = '-'; }
		
		var text = abbrev ? "sec" : "second";
		var amt = sec;
		
		if (sec > 59) {
			var min = sec / 60;
			text = abbrev ? "min" : "minute"; 
			amt = min;
			
			if (min > 59) {
				var hour = min / 60;
				text = abbrev ? "hr" : "hour"; 
				amt = hour;
				
				if (hour > 23) {
					var day = hour / 24;
					text = "day"; 
					amt = day;
				} // hour>23
			} // min>59
		} // sec>59
		
		if (amt < 10) amt = Math.floor(amt * 10) / 10;
		else amt = Math.floor(amt);
		
		var text = "" + amt + " " + text;
		if ((amt != 1) && !abbrev) text += "s";
		
		return(neg + text);
	},
	
	getTextFromBytes(bytes, precision) {
		// convert raw bytes to english-readable format
		// set precision to 1 for ints, 10 for 1 decimal point (default), 100 for 2, etc.
		bytes = Math.floor(bytes);
		if (!precision) precision = 10;
		
		var neg = '';
		if (bytes < 0) { bytes =- bytes; neg = '-'; }
		
		if (bytes >= 1024) {
			bytes = Math.floor( (bytes / 1024) * precision ) / precision;
			if (bytes >= 1024) {
				bytes = Math.floor( (bytes / 1024) * precision ) / precision;
				if (bytes >= 1024) {
					bytes = Math.floor( (bytes / 1024) * precision ) / precision;
					if (bytes >= 1024) {
						bytes = Math.floor( (bytes / 1024) * precision ) / precision;
						return neg + bytes + ' TB';
					} 
					else return neg + bytes + ' GB';
				} 
				else return neg + bytes + ' MB';
			}
			else return neg + bytes + ' K';
		}
		else return neg + bytes + ' B';
	},
	
	shortFloat(value, places) {
		// Shorten floating-point decimal to N places max
		// return as a string (so we can support '0.0')
		if (!places) places = 2;
		var mult = Math.pow(10, places);
		var value = Math.round(parseFloat(value || 0) * mult) / mult;
		if (value == Math.round(value)) value = '' + value + '.0';
		return ''+value;
	},
	
	alphaColor(color, alpha) {
		// convert color to rgba(), reassign alpha
		var matches = color.match(/(\w{2})(\w{2})(\w{2})/);
		if (matches) {
			// hex #rrggbb
			var red = parseInt( matches[1], 16 );
			var green = parseInt( matches[2], 16 );
			var blue = parseInt( matches[3], 16 );
			return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
		}
		else {
			// rgb(), rgba(), hsl() or hsla()
			matches = color.match(/^(\w+)\D+(\d+)\D+(\d+)\D+(\d+)/);
			if (!matches) return 'rgb(0,0,0)';
			return matches[1] + '(' + matches[2] + ', ' + matches[3] + ', ' + matches[4] + ', ' + alpha + ')';
		}
	},
	
	// Debounce Function Generator
	// Fires once immediately, then never again until freq ms
	debounce(func, freq) {
		var timeout = null;
		var requestFire = false;
		
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (requestFire) {
					func.apply(context, args);
					requestFire = false;
				}
			};
			if (!timeout) {
				func.apply(context, args);
				timeout = setTimeout(later, freq);
				requestFire = false;
			}
			else {
				requestFire = true;
			}
		};
	},
	
	// Adapted from: https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
	// Note: xs array MUST be pre-sorted!
	createInterpolant(xs, ys) {
		var i, length = xs.length;
		
		// Deal with length issues
		if (length != ys.length) { throw 'Need an equal count of xs and ys.'; }
		if (length === 0) { return function(x) { return 0; }; }
		if (length === 1) {
			// Impl: Precomputing the result prevents problems if ys is mutated later and allows garbage collection of ys
			// Impl: Unary plus properly converts values to numbers
			var result = +ys[0];
			return function(x) { return result; };
		}
		
		// Rearrange xs and ys so that xs is sorted
		// var indexes = [];
		// for (i = 0; i < length; i++) { indexes.push(i); }
		// indexes.sort(function(a, b) { return xs[a] < xs[b] ? -1 : 1; });
		// var oldXs = xs, oldYs = ys;
		// // Impl: Creating new arrays also prevents problems if the input arrays are mutated later
		// xs = []; ys = [];
		// // Impl: Unary plus properly converts values to numbers
		// for (i = 0; i < length; i++) { xs.push(+oldXs[indexes[i]]); ys.push(+oldYs[indexes[i]]); }
		
		// Get consecutive differences and slopes
		var dys = [], dxs = [], ms = [];
		for (i = 0; i < length - 1; i++) {
			var dx = xs[i + 1] - xs[i], dy = ys[i + 1] - ys[i];
			dxs.push(dx); dys.push(dy); ms.push(dy/dx);
		}
		
		// Get degree-1 coefficients
		var c1s = [ms[0]];
		for (i = 0; i < dxs.length - 1; i++) {
			var m = ms[i], mNext = ms[i + 1];
			if (m*mNext <= 0) {
				c1s.push(0);
			} else {
				var dx_ = dxs[i], dxNext = dxs[i + 1], common = dx_ + dxNext;
				c1s.push(3*common/((common + dxNext)/m + (common + dx_)/mNext));
			}
		}
		c1s.push(ms[ms.length - 1]);
		
		// Get degree-2 and degree-3 coefficients
		var c2s = [], c3s = [];
		for (i = 0; i < c1s.length - 1; i++) {
			var c1 = c1s[i], m_ = ms[i], invDx = 1/dxs[i], common_ = c1 + c1s[i + 1] - m_ - m_;
			c2s.push((m_ - c1 - common_)*invDx); c3s.push(common_*invDx*invDx);
		}
		
		// Return interpolant function
		return function(x) {
			// The rightmost point in the dataset should give an exact result
			var i = xs.length - 1;
			if (x == xs[i]) { return ys[i]; }
			
			// Search for the interval x is in, returning the corresponding y if x is one of the original xs
			var low = 0, mid, high = c3s.length - 1;
			while (low <= high) {
				mid = Math.floor(0.5*(low + high));
				var xHere = xs[mid];
				if (xHere < x) { low = mid + 1; }
				else if (xHere > x) { high = mid - 1; }
				else { return ys[mid]; }
			}
			i = Math.max(0, high);
			
			// Interpolate
			var diff = x - xs[i], diffSq = diff*diff;
			return ys[i] + c1s[i]*diff + c2s[i]*diffSq + c3s[i]*diff*diffSq;
		};
	}
	
}; // ChartUtils
