<details><summary>Table of Contents</summary>

<!-- toc -->
- [Overview](#overview)
	* [Features](#features)
	* [Demos](#demos)
- [Usage](#usage)
	* [Adding Layers](#adding-layers)
		+ [Layer Properties](#layer-properties)
	* [Chart Management](#chart-management)
		+ [Auto Resizing](#auto-resizing)
	* [Line Smoothing](#line-smoothing)
	* [Legend Display](#legend-display)
	* [Dates and Times](#dates-and-times)
	* [Dark Mode](#dark-mode)
	* [Snapshots](#snapshots)
		+ [Downloads](#downloads)
	* [Headroom](#headroom)
	* [Data Labels](#data-labels)
	* [Zooming](#zooming)
	* [Hover Overlay](#hover-overlay)
	* [Flatten Layers](#flatten-layers)
	* [Configuration](#configuration)
		+ [autoHeadroom](#autoheadroom)
		+ [autoManage](#automanage)
		+ [autoResize](#autoresize)
		+ [background](#background)
		+ [borderColor](#bordercolor)
		+ [canvas](#canvas)
		+ [clip](#clip)
		+ [colors](#colors)
		+ [cursor](#cursor)
		+ [dataGapImage](#datagapimage)
		+ [dataSuffix](#datasuffix)
		+ [dataType](#datatype)
			- [integer](#integer)
			- [float](#float)
			- [bytes](#bytes)
			- [seconds](#seconds)
			- [milliseconds](#milliseconds)
		+ [dateStyles](#datestyles)
		+ [delta](#delta)
		+ [deltaMinValue](#deltaminvalue)
		+ [divideByDelta](#dividebydelta)
		+ [density](#density)
		+ [emptyMessage](#emptymessage)
		+ [fill](#fill)
		+ [flatten](#flatten)
		+ [floatPrecision](#floatprecision)
		+ [fontColor](#fontcolor)
		+ [fontFamily](#fontfamily)
		+ [fontSize](#fontsize)
		+ [height](#height)
		+ [horizLabelPadding](#horizlabelpadding)
		+ [horizTicks](#horizticks)
		+ [hover](#hover)
		+ [hoverSort](#hoversort)
		+ [layers](#layers)
		+ [legend](#legend)
		+ [legendMaxLines](#legendmaxlines)
		+ [legendPadding](#legendpadding)
		+ [lineCap](#linecap)
		+ [lineDashes](#linedashes)
		+ [lineJoin](#linejoin)
		+ [lineWidth](#linewidth)
		+ [live](#live)
		+ [locale](#locale)
		+ [minHorizScale](#minhorizscale)
		+ [minVertScale](#minvertscale)
		+ [padding](#padding)
		+ [progressive](#progressive)
		+ [reducedMotion](#reducedmotion)
		+ [showDataGaps](#showdatagaps)
		+ [showSubtitle](#showsubtitle)
		+ [smoothing](#smoothing)
		+ [smoothingMaxSamples](#smoothingmaxsamples)
		+ [smoothingMaxTotalSamples](#smoothingmaxtotalsamples)
		+ [stroke](#stroke)
		+ [subtitle](#subtitle)
		+ [timeZone](#timezone)
		+ [title](#title)
		+ [titlePadding](#titlepadding)
		+ [titleSize](#titlesize)
		+ [titleStyle](#titlestyle)
		+ [vertLabelPadding](#vertlabelpadding)
		+ [vertLabelSide](#vertlabelside)
		+ [vertTicks](#vertticks)
		+ [width](#width)
		+ [zeroFloor](#zerofloor)
		+ [zoom](#zoom)
	* [API](#api)
		+ [addLayer](#addlayer)
		+ [addLayers](#addlayers)
		+ [addLayerSample](#addlayersample)
		+ [render](#render)
		+ [update](#update)
		+ [snapshot](#snapshot)
		+ [download](#download)
		+ [on](#on)
		+ [off](#off)
		+ [destroy](#destroy)
	* [Properties](#properties)
		+ [dataLimits](#datalimits)
		+ [bounds](#bounds)
	* [Events](#events)
		+ [render](#render-1)
		+ [mouseover](#mouseover)
		+ [mousemove](#mousemove)
		+ [mouseout](#mouseout)
		+ [mousedown](#mousedown)
		+ [mouseup](#mouseup)
		+ [click](#click)
- [Development](#development)
- [License](#license)

</details>

# Overview

![Screenshot](https://pixlcore.com/software/pixl-chart/screenshot.png)

This library renders **time series charts** in the browser, using the [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element.  It is designed to be lightweight and performant, while still providing a decent list of features and customizations.

pixl-chart does not come anywhere near the features offered by libraries such as [Chart.js](https://www.chartjs.org/) or [ApexCharts](https://apexcharts.com/).  Those are heavyweight hitters, but they provide virtually every possible chart type, feature and customization option imaginable.  pixl-chart, on the other hand, is purpose-built for one thing only: a super performant time series chart, and nothing else.

## Features

- Zero dependencies.
- Lightweight (32K minified, 10K gzipped).
- Highly performant (tested up to 100,000 samples across 100 layers).
- Full retina (HiDPI) support.
- Supports custom timezones and locales.
- Customize styles, colors and fonts.
- Filled area or line charts (or both).
- Smooth or sharp line interpolation.
- Automatic colors for layers (customizable of course).
- Support for light and dark modes.
- Legend shows all layer titles and colors.
- Download chart as WebP/PNG/JPEG, or snapshot to image blob for upload.
	- Optional overrides (e.g. width, height, title) for images.
	- Generated images work on light or dark backgrounds.
- Hover tooltip shows all layers under mouse cursor.
- Time-based data label overlays (flags).
- Optionally highlight "time gaps" in the data.
- Automatically label X axis based on date range (minute, hourly, daily, monthly, yearly).
- Automatically label Y axis based on data type (integer, float, or bytes).
- Automatic resizing for fluid / responsive designs.
- Automatic "headroom" for more pleasing charts (optional).
- Handles a large amount of charts on the same page.
- Does not render offscreen charts until they scroll into view.
- Optionally render charts progressively, as to not hang the browser.

## Demos

- [Single Layer](https://pixlcore.com/software/pixl-chart/demos/single-layer.html)
- [Multi-Layer](https://pixlcore.com/software/pixl-chart/demos/multi-layer.html)
- [Many Layers](https://pixlcore.com/software/pixl-chart/demos/many-layers.html)
- [Large Dataset](https://pixlcore.com/software/pixl-chart/demos/large-dataset.html)
- [Irregular Dataset](https://pixlcore.com/software/pixl-chart/demos/irregular-dataset.html)
- [Negative Numbers](https://pixlcore.com/software/pixl-chart/demos/negative.html)
- [Daily Range](https://pixlcore.com/software/pixl-chart/demos/daily-range.html)
- [Monthly Range](https://pixlcore.com/software/pixl-chart/demos/monthly-range.html)
- [Yearly Range](https://pixlcore.com/software/pixl-chart/demos/yearly-range.html)
- [Real-Time Data](https://pixlcore.com/software/pixl-chart/demos/real-time.html)
- [Dynamic Layers](https://pixlcore.com/software/pixl-chart/demos/dynamic-layers.html)
- [Flatten Layers](https://pixlcore.com/software/pixl-chart/demos/flatten-layers.html)
- [Click to Zoom](https://pixlcore.com/software/pixl-chart/demos/click-to-zoom.html)
- [Label Sides](https://pixlcore.com/software/pixl-chart/demos/label-sides.html)
- [Line Styles](https://pixlcore.com/software/pixl-chart/demos/line-styles.html)
- [Linear Interpolation](https://pixlcore.com/software/pixl-chart/demos/linear-interpolation.html)
- [Data Gaps](https://pixlcore.com/software/pixl-chart/demos/data-gaps.html)
- [Data Labels](https://pixlcore.com/software/pixl-chart/demos/data-labels.html)
- [Custom Download](https://pixlcore.com/software/pixl-chart/demos/custom-download.html)
- [Custom Fill Gradient](https://pixlcore.com/software/pixl-chart/demos/custom-fill-gradient.html)
- [Custom Fill Styles](https://pixlcore.com/software/pixl-chart/demos/custom-fill-styles.html)
- [Custom Fonts](https://pixlcore.com/software/pixl-chart/demos/custom-fonts.html)
- [Ugly Colors](https://pixlcore.com/software/pixl-chart/demos/ugly-colors.html)
- [Insanity](https://pixlcore.com/software/pixl-chart/demos/insanity.html)

# Usage

Use [npm](https://www.npmjs.com/) to install the module:

```
npm install pixl-chart
```

Unless you are interested in the source code, the only file you need is `chart.min.js`.  This is an all-in-one distribution, ready for the browser.  Host it on your web server and load it via a `<script>` tag.  It exposes a global class named `Chart`.  Here is a simple usage example:

```html
<canvas class="chart" id="c1" style="width:800px; height:400px;"></canvas>
<script src="chart.min.js"></script>
<script>
	let chart = new Chart({
		"canvas": '#c1',
		"title": "App Requests per sec",
		"dataType": "integer",
		"dataSuffix": "/sec",
		"layers": [
			{
				"title": "app01.prod",
				"data": [
					{ "x": 1634270340, "y": 40 },
					{ "x": 1634270400, "y": 41 },
					{ "x": 1634270460, "y": 111 },
					{ "x": 1634270520, "y": 81 },
					{ "x": 1634270580, "y": 35 },
					{ "x": 1634270640, "y": 64 },
					{ "x": 1634270700, "y": 60 },
					{ "x": 1634270760, "y": 33 },
					{ "x": 1634270820, "y": 28 },
					{ "x": 1634270880, "y": 26 }
				]
			}
		]
	});
	chart.render();
</script>
```

The above example generates a very basic smooth area chart, with 10 data samples and all the default settings.  In this case the graph is fixed size, and does not automatically respond to resize events (see [Auto Resizing](#auto-resizing)).  See below for configuration options.

## Adding Layers

Whether you specify your [layers](#layers) as part of the constructor options, or you call [addLayer()](#addlayer) or [addLayers()](#addlayers), the layer format is always the same.  At a bare minimum, each layer should have a `title` and a `data` array.  Here is an example:

```js
chart.addLayer({
	"title": "app01.prod",
	"data": [
		{ "x": 1634270340, "y": 40 },
		{ "x": 1634270400, "y": 41 },
		{ "x": 1634270460, "y": 111 },
		{ "x": 1634270520, "y": 81 },
		{ "x": 1634270580, "y": 35 },
		{ "x": 1634270640, "y": 64 },
		{ "x": 1634270700, "y": 60 },
		{ "x": 1634270760, "y": 33 },
		{ "x": 1634270820, "y": 28 },
		{ "x": 1634270880, "y": 26 }
	]
});
```

In the above example the layer is named `app01.prod` and has 10 data points.  Each data point has an `x` and `y` property.  The `x` is the timestamp, and should be in [Epoch Seconds](https://en.wikipedia.org/wiki/Unix_time) or [Epoch Milliseconds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now).  It can also be a full date/time string, as long as it can be parsed by [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse), but note that this incurs a performance penalty.  The `y` is the data value itself, and should be numerical.  It should also match your data type set by [dataType](#datatype).

Note that the `x` values **must** always be pre-sorted (in ascending order).

An alternate data format is also accepted, which is an array of X/Y values.  Example of this:

```js
chart.addLayer({
	"title": "app01.prod",
	"data": [
		[ 1634270340, 40 ],
		[ 1634270400, 41 ],
		[ 1634270460, 111 ],
		[ 1634270520, 81 ],
		[ 1634270580, 35 ],
		[ 1634270640, 64 ],
		[ 1634270700, 60 ],
		[ 1634270760, 33 ],
		[ 1634270820, 28 ],
		[ 1634270880, 26 ]
	]
});
```

However, note you must use the X/Y data format (e.g. `{"x":1634270880, "y":26}`) in order to use [Data Labels](#data-labels).

### Layer Properties

Here is the full list of available properties you can specify in each layer:

| Property | Type | Description |
|----------|------|-------------|
| `title` | String | **(Required)** The title (display label) for the layer. |
| `data` | Array | **(Required)** An array of data points for the layer. |
| `color` | String | Optionally specify a color for the layer.  By default one is plucked from the global [colors](#colors) list. |
| `opacity` | Number | Specify the layer opacity (alpha transparency), which defaults to `1.0`. |
| `hidden` | Boolean | Set this to `true` to completely hide the layer from the graph (includes legend and tooltip). |
| `smoothing` | Boolean | If global [smoothing](#smoothing) is disabled, you can re-enable it here, on a layer-by-layer basis. |
| `fill` | Mixed | Optionally override the global [fill](#fill) on a layer-by-layer basis. |
| `fillStyle` | Mixed | Optionally set a custom fill style with your own color or gradient.  See [fillStyle at MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle). |
| `stroke` | Boolean | Optionally override the global [stroke](#stroke) on a layer-by-layer basis. |
| `lineWidth` | Number | Optionally override the global [lineWidth](#linewidth) on a layer-by-layer basis. |
| `lineJoin` | String | Optionally override the global [lineJoin](#linejoin) on a layer-by-layer basis. |
| `lineCap` | String | Optionally override the global [lineCap](#linecap) on a layer-by-layer basis. |
| `lineDashes` | Array | Optionally override the global [lineDashes](#linedashes) on a layer-by-layer basis. |

## Chart Management

In addition to the global `Chart` class, pixl-chart also provides a global `ChartManager` singleton object, which manages all charts on the page.  This system is responsible for handling live resize, scroll-into-view, and smooth redraws that do not hang the browser, even with a large amount of charts on the same page.

When your chart's [autoManage](#automanage) property is set to `true` (which is the default), your chart is automatically added to `ChartManager` and managed for you.

Typically, you will not need to call the `ChartManager` object directly, unless you have multiple charts on the page and wish to update them all.  Instead of calling [render()](#render) or [update()](#update) on each of your charts, consider simply calling `ChartManager.check()` once:

```js
ChartManager.check();
```

The `check()` method in the `ChartManager` object will iterate over all the charts and figure out which ones were updated and require a redraw.  It will then automatically rerender them all, using sequential animation frames, as to not hang the browser.  It will also delay rerenders of any offscreen charts until they scroll back into view.  This is a **much** better way of redrawing a suite of charts than redrawing each one yourself.

The `ChartManager` object also provides an API to access all of the charts on the page, so you don't have to keep track of them all yourself.  You can get to them by accessing the `charts` property, which is an array:

```js
let charts = ChartManager.charts;

charts.forEach( function(chart) {
	// do something with each chart
} );
```

### Auto Resizing

As part of the chart management system, pixl-chart also handles live resizes of your charts.  That is, it will automatically rerender your charts when the `<canvas>` DOM elements change size.  To support this system with your charts, you must first make sure the [autoManage](#automanage) and [autoResize](#autoresize) properties are enabled (this is the default).  Then, make sure that your `<canvas>` elements do not have a fixed size, but rather follow their parent element like this:

```css
canvas {
	width: 100%;
	height: 100%;
}
```

Then, your chart will take up all available space in its parent element, and resize as needed to fit.

## Line Smoothing

By default, all your graph lines are smoothed using [monotone cubic interpolation](https://en.wikipedia.org/wiki/Monotone_cubic_interpolation).  This means, they are interpolated in a way that produces nice, smooth curves between each data point.  If you set the [smoothing](#smoothing) property to `false`, the lines will instead be rendered using linear interpolation (i.e. straight lines with no curves).

This setting also affects the animation smoothness in the hover tooltip (i.e. how smoothly the hover tooltip and highlighted lines / dots follow the mouse cursor).  When [smoothing](#smoothing) is disabled, the smooth hover animation is also disabled, and the hover elements snap into place instantly.

See the [Linear Interpolation](https://pixlcore.com/software/pixl-chart/demos/linear-interpolation.html) demo for an example of both types.  There are buttons below the chart which toggle smoothing on/off.

## Legend Display

By default, pixl-chart will display a "legend" directly below the chart data and X axis labels.  A legend is basically just a list of your layers, each with its title and a dot representing its color.  Here is an example legend:

![Legend](https://pixlcore.com/software/pixl-chart/legend.png)

To enable the legend, simply set the [legend](#legend) property to `true` (this is the default).  Everything else is automatic.

If your chart has too many layers, and/or the layer titles are too long, the legend will automatically disappear.  This is to prevent it from eating up too much of your chart's vertical real estate.  This limit is controlled by the [legendMaxLines](#legendmaxlines) property.  By default, if the legend will eat up more than 2 lines, then it will automatically hide itself.

## Dates and Times

By default, pixl-chart will display dates and times based on your browser's locale and time zone settings.  The locale governs things like how to format months, days, hours, and so on, whereas the time zone controls how the raw [Epoch](https://en.wikipedia.org/wiki/Unix_time) seconds from your dataset are converted to human-readable dates/times (i.e. offset from GMT, +/- daylight savings time, etc.).

Both of these properties are configurable.  If you want to override the default auto-detect behavior, you can set the [locale](#locale) property to any value from [this list of language codes](https://en.wikipedia.org/wiki/Language_localisation#Language_tags_and_codes), e.g. `en-US`.  You can also override the default auto-detected time zone, and set the [timeZone](#timezone) property to any value from [this list of time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), e.g. `America/Los_Angeles`.

For even more control, you can specify your own custom [dateStyles](#datestyles) object.

## Dark Mode

Both light mode and dark mode are supported in pixl-chart.  This is done by rendering the chart with an alpha transparent background, and using neutral colors and grays, so they show up and look nice on both light and dark backgrounds.  This is true for the chart itself, as well as all PNG images generated from it (see [Snapshots](#snapshots)).

For supporting the hover tooltip with a dark theme, please add a `dark` class to the HTML `<body>` element when dark mode is active, and remove it if the theme is changed back to light.  This acts as a hint for pixl-chart to switch around its internal CSS for the hover elements, which are rendered as HTML.

For example, if your page auto-detects and switches into dark mode based on user preference, you can use this code snippet at startup:

```js
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.body.classList.add('dark');
}
```

You can also add an event listener to switch modes dynamically:

```js
window.matchMedia('(prefers-color-scheme: dark)').addListener('change', function(event) {
	if (event.matches) document.body.classList.add('dark');
	else document.body.classList.remove('dark');
});
```

## Snapshots

Since pixl-chart renders everything into an [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element, it is easy to take a "snapshot" of a chart and produce an image file.  You can actually do this yourself by accessing the underlying `<canvas>` element, but pixl-chart provides an API wrapper with some added niceties.  Here is an example:

```js
chart.snapshot({ type: 'blob', format: 'png', quality: 1.0 }, function(blob) {
	// do something with blob
});
```

In the above example we're asking for a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob), which is useful for uploading to a server using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).  You can alternatively ask for a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) by setting the `type` to `url`.

Here are the options you can specify to `snapshot()`:

| Property | Default Value | Description |
|----------|---------------|-------------|
| `type` | `blob` | Specify the type of image output you want, either `blob` or `url`. |
| `format` | `png` | Specify the desired image file format, e.g. `webp`, `png` or `jpeg`. |
| `quality` | `1.0` | Specify the desired image quality from `0.0` (worst) to `1.0` (best). |

You can also include any [chart configuration properties](#configuration) in the options object, to override them in the snapshot.  For example, you can specify a fixed pixel [width](#width), [height](#height) and [density](#density) for your snapshot image:

```js
let opts = {
	type: 'url', 
	format: 'webp', 
	quality: 1.0, 
	width: 1024, 
	height: 512, 
	density: 1
};
chart.snapshot(opts, function(url) {
	// do something with data url
});
```

One reason you might want to override these additional properties is to ensure that the image resolution is fixed, regardless of the chart's canvas size in the page, and the user's screen density (retina, etc.).

Please note that when generating JPEG images, the default transparent background in the chart becomes black.  To work around this, provide a fixed opaque [background](#background) color in the options object that you pass to `snapshot()`.

### Downloads

As a convenience, pixl-chart provides an easy API to download a snapshot image.  This initiates the native browser file download behavior, and it will download the snapped image to the user's local machine.  You can optionally provide a filename to use, or omit it to have pixl-chart generate one for you based on the chart title and image format.  Example use:

```js
chart.download();
```

This would produce a snapshot using all the default options (PNG, 100% quality) and download it using a generated filename from the chart title.  Here is another example which specifies some options:

```js
chart.download({
	filename: 'my-high-res-chart.png',
	format: 'png', 
	quality: 1.0, 
	width: 1024, 
	height: 512, 
	density: 1
});
```

The `download()` method accepts all the same options as [snapshot()](#snapshots), along with `filename`, and any [chart configuration properties](#configuration) like [width](#width), [height](#height) and [density](#density).

## Headroom

When [autoHeadroom](#autoheadroom) is set to `true` (which is the default), pixl-chart will attempt to add some vertical "headroom" above your chart's highest Y value.  The reason for this is to make the chart generally more pleasing to look at.  The library tries to do this by landing the topmost Y value on a round number, and scaling the visual data to fit.

For example, if your chart's highest Y value is `395`, then the headroom system will round up the value to `400` for the top of the chart.  The same logic applies to all powers of 10, including floating point values below `1.0`, and byte values up to a TB (terabyte).  Note that it will never add more than 25% headroom.

For a nice demo of this feature, check out the [Large Dataset](https://pixlcore.com/software/pixl-chart/demos/large-dataset.html) demo.  Here, the data's highest Y value is `5,497`, but since [autoHeadroom](#autoheadroom) is enabled (by default), the library rounds this up to `6,000`.  As a result, the topmost value and all the vertical labels are all nice round numbers.  This also naturally adds a small amount of "padding" above the data, so the highest peak doesn't run right into the top of the chart.

If you don't like this behavior, simply set [autoHeadroom](#autoheadroom) to `false` in your chart, and your data's highest Y value will be honored, matching it up exactly with the top of the chart.

## Data Labels

If you need to highlight or flag a particular sample in your data, you can do so by adding a "data label".  This is displayed in the graph as a colored flag at the top of the chart, with a dashed line indicating the exact sample (timestamp) it refers to.  To use this feature in your chart, add a `label` property in your X/Y data like this:

```js
[
	{ "x": 1634275440, "y": 1.99 },
	{ "x": 1634275500, "y": 2.16 },
	{
		"x": 1634275560,
		"y": 2.40,
		"label": {
			"text": "Alert",
			"color": "red"
		}
	}
]
```

This example shows two standard data rows with only `x` and `y` properties, followed by a third row that also has a `label`.  This indicates which data sample should be flagged.  The `label` should point to an object with the following properties:

| Label Property | Default Value | Description |
|----------------|---------------|-------------|
| `text` | `""` | **(Required)** The display text for the label, e.g. `"Alert"`. |
| `color` | (Auto) | The background color of the label box (defaults to the layer color). |
| `fontColor` | `white` | The font color of the label text (any CSS color string accepted). |
| `lineWidth` | `1` | The width of the line to draw for the label data point (in pixels). |
| `dashStyle` | `[2,2]` | The dash pattern of the line (see [setLineDash at MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)). |
| `strokeStyle` | `rgba(128, 128, 128, 0.75)` | The color of the line stroke (any CSS color string accepted). |
| `tooltip` | `false` | Set this to `true` to also highlight the layer in the hover tooltip, using the label color. |

This is an effective way to direct the user's attention to a particular data sample.  You can include as many labels as you want in your chart.  Each one will render a separate colored flag onto the canvas.  The flags are all rendered on top of all layers.

To see this feature in action, check out the [Data Labels](https://pixlcore.com/software/pixl-chart/demos/data-labels.html) demo.  This demo also showcases the `tooltip` label property, which, in a multi-layer chart, highlights *which layer* has the flagged data sample, by colorizing the text in the hover tooltip to match the label color.

## Zooming

By default, your entire dataset is scaled to fit into the chart, more or less.  That is, your oldest timestamp will be aligned to the left side, your newest timestamp on the right side, your lowest Y value at the bottom (well, more likely [zero](#zerofloor)), and your highest Y value at the top (well, minus some [headroom](#autoheadroom)).  The point being, your entire dataset will be visible in the chart.  You can, however, artificially "zoom" in on a portion of your data.  To do this, provide a [zoom](#zoom) configuration object, and populate it with these four properties:

| Zoom Property | Description |
|---------------|-------------|
| `xMin` | A custom minimum X value (timestamp) to align to the left side of the chart. |
| `xMax` | A custom maximum X value (timestamp) to align to the right side of the chart. |
| `yMin` | A custom minimum Y value, to align with the bottom or the chart ([zeroFloor](#zerofloor) overrides this). |
| `yMax` | A custom maximum Y value, to align with the top of the chart ([headroom](#autoheadroom) will adjust this). |

To determine the current `xMin`, `xMax`, `yMin` and `yMax` values before zooming, consult the [dataLimits](#datalimits) object, which is automatically computed every render cycle based on your dataset.

Please specify [Epoch Seconds](https://en.wikipedia.org/wiki/Unix_time) for the `xMin` and `xMax` properties, even if your dataset uses [Epoch Milliseconds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now).

Once you provide your custom `zoom` object, you can instruct the chart to rerender by calling [update()](#update).

Note that if you use the zoom feature, it is *highly* recommended that you also enable the [clip](#clip) feature, to prevent data from drawing outside the bounds.  Also, if you zoom in vertically (i.e. constricting `yMin` and/or `yMax`), you will probably want to disable both [zeroFloor](#zerofloor) and [autoHeadroom](#autoheadroom), so your limits aren't automatically adjusted.

## Hover Overlay

Using the [event system](#events) provided in pixl-chart, you can register event listeners to be notified when the mouse enters and exits your chart.  Example:

```js
chart.on('mouseover', function(event) {
	// mouse is hovering over the chart
});
chart.on('mouseout', function(event) {
	// mouse has left the chart
});
```

Additionally, when the mouse hovers over a chart, a special overlay `<div>` is automatically created and floated on top of everything, to track the mouse position and prevent interference with the hover tooltip and its elements.  The `<div>` will always have a class name of `pxc_tt_overlay` (short for "pixl-chart tooltip overlay").  The element is always empty, but is sized and positioned precisely atop the chart.  You can use this to render your own hover HTML elements which appear and disappear based on the mouse hover state.  Example:

```js
chart.on('mouseover', function(event) {
	// show our own hover components
	document.querySelector('.pxc_tt_overlay').innerHTML = '<div class="my_custom_component">Button 1, Button 2, etc.</div>';
});
chart.on('mouseout', function(event) {
	// mouse has left the chart
	// no action required
});
```

Note that you don't have to do anything on `mouseout`, because the `.pxc_tt_overlay` element is automatically destroyed.

One possible use here is to render your own "toolbar" with clickable buttons (e.g. snapshot, download, etc.), which appear when the mouse hovers over your chart, and disappear when the mouse leaves.

## Flatten Layers

If your chart has multiple layers, but you want to offer your users a way to temporarily "flatten" all the layers in to a single combo display layer (for e.g. to show the average, min, max or total), set a new `flatten` object property on your chart.  It accepts the following properties:

| Property Name | Default Value | Description |
|---------------|---------------|-------------|
| `type` | `average` | This specifies how to merge the data values.  Supported algorithms are `average`, `minimum`, `maximum` and `total`. |
| `title` | n/a | Optionally override the entire chart [title](#title) while flatten mode is active. |
| `tooltipTitle` | n/a | Optionally override the layer title inside hover tooltips.  This defaults to the chart title. |
| `prefixTitle` | n/a | Optionally prepend a prefix onto the chart title when flatten mode is active. |
| `color` | (Color 0) | Customize the color of the combined flattened layer.  This defaults to the first color in the [default colors](#colors) list. |
| `fill` | `0.5` | Optionally customize the [fill](#fill) of the combo flattened layer.  This defaults to `0.5` (half opacity). |

So the idea is, after some user interaction (i.e. they select a flatten mode in a drop-down menu) populate the `flatten` object on your chart, and then call `update()` to schedule a rerender.  Here is an example:

```js
chart.flatten = {
	type: 'average',
	tooltipTitle: 'Average',
	prefixTitle: 'Average'
};
chart.update();
```

This would enable flatten mode, which will collapse all your layers into one (non-destructively), and merge the data together by averaging all the layer values together.  It will also set a custom `tooltipTitle` set to "Average", as well as a `prefixTitle` set to the same string.

To revert back to the standard multi-layer view, simply remove the `flatten` object (or set it to `null`) and call `update()` again:

```js
chart.flatten = null;
chart.update();
```

See the [Flatten Layers Demo](https://pixlcore.com/software/pixl-chart/demos/flatten-layers.html) for an example use case.

## Configuration

You pass in configuration options by specifying them as properties of the object you pass to the `Chart` class constructor.  Also, in many cases you can just set them directly on your `Chart` instance.

Here are all the configuration properties you can set, in alphabetical order:

### autoHeadroom

| Type | Default |
|------|---------|
| Boolean | `true` |

This causes the chart to automatically add "headroom" above the highest Y value, typically ending it on a round number.  This makes the charts more pleasing to the eye in most cases.  See [Headroom](#headroom) for more details.

### autoManage

| Type | Default |
|------|---------|
| Boolean | `true` |

This causes the chart to automatically be managed by the global chart manager.  This automatically monitors offscreen charts and renders them as they scroll into view.  It is also the basis behind the auto-resize system.  See [Chart Management](#chart-management) for more details.

### autoResize

| Type | Default |
|------|---------|
| Boolean | `true` |

This feature allows the chart to automatically redraw itself when the underlying `<canvas>` element changes size.  Note that in order for this to work, [autoManage](#automanage) also needs to be enabled.  See [Auto Resizing](#auto-resizing) for more details.

### background

| Type | Default |
|------|---------|
| String | `""` |

By default, pixl-chart uses a transparent background.  This is important so that charts look nice on both light and dark themes.  However, you can override this if you want, and set the `background` property to any CSS color string.

### borderColor

| Type | Default |
|------|---------|
| String | `rgba(128, 128, 128, 0.25)` |

This sets the horizontal and vertical tick line color.  It can be any CSS color string, and alpha transparency is supported.  The default is gray at 25% opacity, which works well in both light and dark themes.

### canvas

| Type | Default |
|------|---------|
| Mixed | `null` |

**(Required)** Attach an HTML5 `<canvas>` element to the chart, for rendering everything into.  The canvas element should already be in the DOM at construction time.  You can pass in a direct reference to the DOM object itself, or a CSS query selector string.

### clip

| Type | Default |
|------|---------|
| Boolean | `false` |

Optionally clip the data drawing to the viewable area.  This is disabled by default for performance reasons, but also because datasets almost always fit into the bounds with no clipping necessary.  This property only comes into play when you artificially zoom in (see [Zooming](#zooming)), in which case clipping becomes necessary.

### colors

| Type | Default |
|------|---------|
| Array | `["#008FFB", ...]` |

This is a list of default colors to assign to new layers, if they do not include their own.  pixl-chart ships with a set of 50 colors, which repeats if more than 50 layers are added.  Feel free to override this with your own color palette.  Each color should be a string in hexadecimal (`#RRGGBB`), RGB (`rgb(R,G,B)`), RGBA(`rgba(R,G,B,A)`), HSL (`hsl(H,S,L)`), or HSLA(`hsla(H,S,L,A)`) format.

### cursor

| Type | Default |
|------|---------|
| String | `crosshair` |

This sets the visible cursor when the mouse hovers over the graph.  It defaults to the `crosshair` cursor.  See the [MDN cursor docs](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) for all possible values here.

### dataGapImage

| Type | Default |
|------|---------|
| String | `data:image/png;base64,...` |

When [showDataGaps](#showdatagaps) is enabled, this sets the image pattern to draw the missing regions on the graph.  It defaults to a gray striped bar pattern.  The image should be a repeating pattern that seamlessly loops in all directions.  Feel free to replace this with your own image, which can be a local embedded `data:` URL, or a remote `http:` or `https:` URL.

### dataSuffix

| Type | Default |
|------|---------|
| String | `""` |

Optionally display a suffix after all your data values in the chart.  This affects both the Y-axis sidebar on the left, and inside the hover tooltip.  Typical suffixes include `/sec` for when your data is sampled per second, and `ms` for measuring milliseconds.

### dataType

| Type | Default |
|------|---------|
| String | `integer` |

**(Required)** Define the type of data you are displaying in the chart.  This controls how the numbers are displayed to the user.  The default value is `integer`.  Possible values include:

#### integer

Setting `dataType` to `integer` means that your graph should display whole numbers.  The numbers will also be localized to the user viewing the chart, e.g. `1,000,000` for US.

Additionally, integers will be abbreviated in the Y-axis sidebar, to conserve horizontal space.  Specifically, values over 10,000 will be displayed as "10K", "20K", "500K", etc.  Values over 1,000,000 will be displayed as "1M", "20M", "500M", etc.  Values over 1,000,000,000 will be displayed as "1B", "20B", "500B", etc.

#### float

Setting `dataType` to `float` means that your graph should display floating point decimals.  The precision of these numbers is reduced for brevity, according to the [floatPrecision](#floatprecision) setting, of which the default is `2` numbers after the decimal point.

#### bytes

Setting `dataType` to `bytes` means that your graph should display byte values.  These values are reduced for brevity, using a 1024-byte kilobyte, according to this table:

| Range | Display Examples |
|-------|------------------|
| `< 1024` | "1 B", "20 B", "500 B" |
| `>= 1024` | "1 K", "20 K", "500 K" |
| `>= 1048576` | "1 MB", "20 MB", "500 MB" |
| `>= 1073741824` | "1 GB", "20 GB", "500 GB" |
| `>= 1099511627776` | "1 TB", "20 TB", "500 TB" |

Furthermore, these values may include floating point decimals according to your [floatPrecision](#floatprecision) setting, if the value doesn't divide evenly.

If you are displaying a graph that prefers non-binary divisions, e.g. 1K = 1000, then please set your [dataType](#datatype) to [integer](#integer).

#### seconds

Setting `dataType` to `seconds` means that your graph should display time-based data values (i.e. elapsed time in seconds) for the Y axis.  The labels will be quantized based on their range, e.g. seconds, minutes, hours and/or days, with varying degrees of accuracy for display purposes.

#### milliseconds

Setting `dataType` to `milliseconds` means that your graph should display time-based data values (i.e. elapsed time in milliseconds) for the Y axis.  The labels will be quantized based on their range, e.g. milliseconds (if under one second), then seconds, minutes, hours and/or days, with varying degrees of accuracy for display purposes.

### dateStyles

For fine-grained control over dates/times displayed in the axis labels and tooltips, you can specify your own custom `dateStyles` object.  The default configuration is shown below:

```js
chart.dateStyles = {
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
		day: 'numeric'
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
```

This controls how to compose dates/times in each of the different "zoom levels" of the chart (based on the horizontal date range).  For example, if the total range of the chart is a minute or less, then the `minute` configuration is used.  If less than an hour, the `hour` one is used, and so on.  The `tooltip` object is used for dates/times inside of tooltips.

The properties in each of these objects are passed directly to the [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

### delta

| Type | Default |
|------|---------|
| Boolean | `false` |

This controls the interpretation of the vertical graph layer data.  When this is set to `true`, each `y` (vertical) value will be rendered as an offset from the previous value, rather than an absolute.  This is useful for datasets which contain counters (accumulating values over time), and you want to show the deltas between them.

### deltaMinValue

| Type | Default |
|------|---------|
| Mixed | `false` |

When [delta](#delta) mode is enabled, setting `deltaMinValue` to a number (e.g. `0`) will clamp all computed delta values to the provided mininum.  This is useful for graphing the delta of absolute "counters" that should always count upwards.  For example, measuring the absolute value of network or disk read/write counters usually gives you an absolute counter of the bytes since last reboot.

### divideByDelta

| Type | Default |
|------|---------|
| Boolean | `false` |

When [delta](#delta) mode is enabled, setting `divideByDelta` to `true` will divide every `y` (vertical) value by the delta between the current `x` (time) and previous `x` (time) entry in the dataset.  This is for graphs that need to display "per second" values (often with a [dataSuffix](#datasuffix) set to "/sec"), which will be accurate regardless of zoom level.

### density

| Type | Default |
|------|---------|
| Number | (Auto-detect) |

This is the pixel density to use when rendering the chart canvas.  A value of `1` is for standard screens, and `2` is for most "retina" a.k.a. "HiDPI" screens (e.g. iPhones, iPads, MacBook Pros).  The default value is auto-detected, which is pulled from [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).

This does not affect the physical size of the canvas on the page -- it only affects how tightly the pixels are packed together.  It will, however, affect the resolution and size of downloaded images (see [Snapshots](#snapshots)).

If you set this to a fixed value and it *doesn't* match the user's screen density, the canvas will be scaled to fit.

### emptyMessage

| Type | Default |
|------|---------|
| String | `""` |

When there is no data to show (empty datasets or no visible layers) you can use this property to display a custom text message, centered in the middle of the chart.  An example could be "Waiting for data...", or "No data to show.".

### fill

| Type | Default |
|------|---------|
| Number | `0.5` |

This controls the fill opacity for your dataset rendering.  The default is `0.5` which is half-transparent.  If your chart has multiple layers, it is generally a good idea to set this to `0` (or `false`) to disable the fill entirely, and only render lines (see [stroke](#stroke)).

You can override `fill` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### flatten

| Type | Default |
|------|---------|
| Object | `null` |

This is used for flattening all layers into a single combined display layer, using a variety of algorithms (avg, min, max, total).  See [Flatten Layers](#flatten-layers) for details.

### floatPrecision

| Type | Default |
|------|---------|
| Number | `2` |

For displaying floating point numbers in your data values, this sets the maximum number of digits to allow after the decimal point.  This only affects specific chart [dataType](#dataType)s, namely [float](#float) and [bytes](#bytes).

### fontColor

| Type | Default |
|------|---------|
| String | `rgb(128, 128, 128)` |

This controls the font color for virtually all the text rendered in the chart, from the title, to the axis labels, to the hover tooltip.  The only thing this *doesn't* control is data label text color (see [Data Labels](#data-labels)).

The default font color is neutral gray, so it looks nice on both light and dark themes.

### fontFamily

| Type | Default |
|------|---------|
| String | `Helvetica, sans-serif` |

This controls the font family for all text rendered in the graph.  Set it to any [CSS font family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family), with optional comma-separated fallbacks.  If you intend to use custom web fonts, make sure they are *fully loaded* before rendering your charts.  You can use a library such as [onFontReady](https://github.com/dwighthouse/onfontready) for this.

### fontSize

| Type | Default |
|------|---------|
| Number | `12` |

This sets the font size (in pixels) for all text displayed in the chart (except for the title, which is set by [titleSize](#titlesize)).

### height

| Type | Default |
|------|---------|
| Number | (Auto) |

Optionally set a fixed height for the chart, in pixels.  The default behavior is to use whatever DOM size is computed for the `<canvas>` element.

Note that if you specify a fixed height, you must also include a [width](#width).

### horizLabelPadding

| Type | Default |
|------|---------|
| Number | `25` |

This is the number of pixels set aside for padding below the horizontal axis labels (i.e. timestamp labels), and above the legend.

### horizTicks

| Type | Default |
|------|---------|
| Number | `6` |

This is the number of horizontal "ticks" (grid lines and labels) for the X axis and timestamps.  Beware of increasing this too far, as the labels may run into each other.

### hover

| Type | Default |
|------|---------|
| Boolean | `true` |

This enables the mouse hover and tooltip system.  When the mouse hovers over the data area, a vertical dotted bar is rendered, highlighting the closest data point.  Additionally, colored dots are positioned on each of the layer data points.  Finally, a hovering tooltip is floated nearby, with the exact values of each of the data points.

### hoverSort

| Type | Default |
|------|---------|
| Number | `0` |

Inside the hover tooltip box, each layer is displayed along with its data value for the closest timestamp.  By default, the layers are presented in their natural order from top to bottom (the order in which they were added), but you can also sort by the data values themselves, ascending or descending.  Here are the three accepted `hoverSort` settings:

| hoverSort | Description |
|-----------|-------------|
| `0` | Do not sort (the layers will be in their natural order). |
| `1` | Sort the layers by the data values in *ascending* order. |
| `-1` | Sort the layers by the data values in *descending* order. |

### layers

| Type | Default |
|------|---------|
| Array | `[]` |

You can optionally specify your layer data when you first construct the chart, by including a `layers` array.  See [Adding Layers](#adding-layers) for details.

### legend

| Type | Default |
|------|---------|
| Boolean | `true` |

This controls whether the chart legend is displayed or not.  The default is `true`.  Note that the decision to show or hide the legend is also affected by [legendMaxLines](#legendmaxlines).

### legendMaxLines

| Type | Default |
|------|---------|
| Number | `2` |

This is the maximum number of lines to allow in the legend, before it is automatically hidden.  The idea here is that if your graph has too many layers, or if the layer titles are too long, the legend won't eat up too much of the canvas space.

### legendPadding

| Type | Default |
|------|---------|
| Number | `5` |

This is the amount of padding to allocate underneath the legend, in pixels.  This only takes effect if the legend is actually displayed.

### lineCap

| Type | Default |
|------|---------|
| String | `butt` |

This determines the shape used to draw the end points of lines, assuming [stroke](#stroke) is enabled.  See [lineCap at MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap) for more details.

You can override `lineCap` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### lineDashes

| Type | Default |
|------|---------|
| Mixed | `false` |

By default, all lines in the chart are solid.  To render dashed lines, provide a custom dash pattern in the `lineDashes` property using an array.  Specify pixel widths of each segment in your repeating pattern, which alternate between the solid segment and the gap.  Example use:

```js
{
	"lineDashes": [4, 2]
}
```

This would produce a pattern of a 4-pixel-wide solid segment, followed by a 2-pixel-wide gap, and then repeat.  See [setLineDash at MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash) for more details.

You can override `lineDashes` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### lineJoin

| Type | Default |
|------|---------|
| String | `round` |

This determines the shape used to join two line segments where they meet.  The default is `round`.  See [lineJoin at MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin) for more details.

You can override `lineJoin` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### lineWidth

| Type | Default |
|------|---------|
| Number | `2` |

This controls the width of the lines rendered in your chart, in pixels.  If you have a large dataset with complex patterns, you might want to set this to `1`.

You can override `lineWidth` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### live

| Type | Default |
|------|---------|
| Boolean | `false` |

If your chart is going to be receiving streaming live data, setting this property to `true` allows the library to prepare for certain optimizations that may help the user experience.  Currently this mode affects [flattened](#flatten-layers) datasets, hiding the first and/or last sample if they are "partial".

### locale

| Type | Default |
|------|---------|
| String | (Auto-detect) |

This is the locale used for formatting dates and times, e.g. `en-US`.  The locale determine how dates are formatted in terms of month names, abbreviations, suffixes, and symbols used.  See the [list of language codes on Wikipedia](https://en.wikipedia.org/wiki/Language_localisation#Language_tags_and_codes) for a full list of these.

### minHorizScale

| Type | Default |
|------|---------|
| Number | (Unset) |

Use this to prevent the horizontal "scale" (the distance between the left and right visible data points) from rendering below a minimum value.  For example, set this to `60` to set the minimum time tange to 1 minute.  This only affects how the data is scaled and rendered into the canvas.  For more fine-grained control, see [zoom](#zoom).

### minVertScale

| Type | Default |
|------|---------|
| Number | (Unset) |

Use this to prevent the vertical "scale" (the distance between the highest and lowest visible data points) from rendering below a minimum value.  For example, if this is set to `100` and all the data samples are below that value, the topmost level in the chart will still be at the 100 mark.  This only affects how the data is scaled and rendered into the canvas.  For more fine-grained control, see [zoom](#zoom).

### padding

| Type | Default |
|------|---------|
| Object | `{ left:0, top:0, right:10, bottom:0 }` |

This object allows you to add extra padding on any side of the chart.  Note that the top, left and bottom sides are already pre-padded by the title, vertical labels and legend, respectively.  So by default this object only adds a bit of padding on the right side, to balance things out.

### progressive

| Type | Default |
|------|---------|
| Boolean | `false` |

By default, the entire chart is rendered all at once.  Meaning, everything is rendered in the same "frame".  This is usually fine for most charts.  However, in rare cases when you have a huge amount of complex layers with large datasets, you may want to render the chart "progressively".  That is, when this property is set to `true`, the chart will only render one layer at a time, and wait an animation frame between each one.  This allows you to render enormously complex charts without "hanging" the browser for too long.

Please use this feature with caution.  It does not play nice with [Auto Resizing](#auto-resizing), for example.  It should be used for fixed size charts only.

### reducedMotion

| Type | Default |
|------|---------|
| Boolean | `false` |

Set this property to `true` to reduce certain animations for accessibility purposes.  Currently this affects the motion of the tooltip window, focus line and data dots.

### showDataGaps

| Type | Default |
|------|---------|
| Boolean | `false` |

If your data has time gaps, pixl-chart can detect these and highlight them using a visual pattern.  A "gap" is defined as a space between two data samples that is larger than the smallest space between all your other samples.  This feature is designed for datasets that have regular spaces between timestamps (i.e. every minute, every hour, etc.).  It defaults to disabled.  Set the `showDataGaps` property to `true` to enable it.  See the [Data Gaps Demo](https://pixlcore.com/software/pixl-chart/demos/data-gaps.html) for an example of this feature.

If you want to customize the image pattern displayed for gaps, see [dataGapImage](#datagapimage).

### showSubtitle

| Type | Default |
|------|---------|
| Boolean | `true` |

This controls whether the subtitle is displayed or not.  By default, the subtitle will contain the date/time range of your dataset, but you can override this and supply your own subtitle by setting the [subtitle](#subtitle) property.  Set `showSubtitle` to `false` to hide the subtitle entirely.

### smoothing

| Type | Default |
|------|---------|
| Boolean | `true` |

By default, your graph data lines are smoothed using [monotone cubic interpolation](https://en.wikipedia.org/wiki/Monotone_cubic_interpolation).  If you set `smoothing` to `false`, the lines will instead be rendered using straight linear interpolation.  Also see [smoothingMaxSamples](#smoothingmaxsamples), which can disable smoothing.

You can override `smoothing` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### smoothingMaxSamples

| Type | Default |
|------|---------|
| Number | `200` |

If [smoothing](#smoothing) is set to `true`, but your dataset has more than this number of samples per layer (default `200`), smoothing is disabled.  This rule is evaluated on a layer-by-layer basis.

The idea here is that at at certain point, smoothing can't really be seen because there are so many data samples in the chart.  Also, smoothing can cause performance issues with larger datasets, so it is a good idea to disable it in those cases.

### smoothingMaxTotalSamples

| Type | Default |
|------|---------|
| Number | `1000` |

If [smoothing](#smoothing) is set to `true`, but your dataset has more than this number of total samples across all layers, smoothing is disabled.  This rule is evaluated globally, not per layer.  This is another performance tuning mechanism, designed to reduce lag on datasets with a large number of layers.

### stroke

| Type | Default |
|------|---------|
| Boolean | `true` |

The `stroke` property controls whether lines are rendered for your data or not.  This defaults to `true`.  One style option is to set this to `false`, then set [fill](#fill) to some non-zero opacity, to get a pure area fill without an outline.  See the [Custom Fill Styles Demo](https://pixlcore.com/software/pixl-chart/demos/custom-fill-styles.html) for an example of this.

You can override `stroke` on a layer-by-layer basis.  See [Layer Properties](#layer-properties) for details.

### subtitle

| Type | Default |
|------|---------|
| String | (Automatic) |

When [showSubtitle](#showsubtitle) is set to `true`, the default behavior is to display the date/time range as the subtitle (automatically constructed based on your data).  However, you can customize this if you want, by setting the `subtitle` property to any string value.

Please note that the subtitle is only displayed if [title](#title) is also set.  They come as a pair.

### timeZone

| Type | Default |
|------|---------|
| String | (Auto-detect) |

When displaying dates and times, pixl-chart will use your current time zone (auto-detected).  You can override this, however, by setting the `timeZone` property to any standard time zone name, e.g. `America/Los_Angeles`.  For the full list of available time zones, see the [list of time zones on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

Also see the [locale](#locale) property, which affects date/time formatting.

### title

| Type | Default |
|------|---------|
| String | `""` |

If you would like your graph to have a title, specify it using the `title` property.  This will be displayed prominently at the top of the chart, center aligned.  See also [titleSize](#titlesize), [titleStyle](#titlestyle) and [titlePadding](#titlepadding).

### titlePadding

| Type | Default |
|------|---------|
| Number | `15` |

This is the number of pixels to pad around the title (above and below), if one is specified.  By default this is `15` pixels.

### titleSize

| Type | Default |
|------|---------|
| Number | `16` |

If a title is specified, it will be rendered at this pixel size.  By default this is `16` pixels.

### titleStyle

| Type | Default |
|------|---------|
| String | `bold` |

If a title is specified, it will be displayed using this font style.  By default this is `bold`.

### vertLabelPadding

| Type | Default |
|------|---------|
| Number | `10` |

This is the number of pixels to pad around the vertical labels (on both the left and right sides).  The default is `10` pixels.  The vertical labels are those that run along the left side of the chart, which appear for each [vertical tick](#vertticks).

### vertLabelSide

| Type | Default |
|------|---------|
| String | `left` |

This specifies which side to render the vertical (Y axis) labels on.  Specify via `left` or `right`.  The default is `left`.

Note that if you change this to the `right` side, you should also adjust the [padding](#padding).  It is recommended that you swap the values of `padding.left` and `padding.right`, to compensate for the labels switching sides.  For example, the default padding is `0` pixels on the left (because the labels are there) and `10` pixels on the right (because nothing is there).  So if you want right-side labels, then you should set `padding.left` to `10` and `padding.right` to `0`.  See the [Label Sides Demo](https://pixlcore.com/software/pixl-chart/demos/label-sides.html) for an example.

### vertTicks

| Type | Default |
|------|---------|
| Number | `6` |

This is the number of vertical "ticks" (grid lines and labels) for the Y axis.  They run along the left side of the chart.  Beware of increasing this too far, as the labels may run into each other.

### width

| Type | Default |
|------|---------|
| Number | `0` |

Optionally set a fixed width for the chart, in pixels.  The default behavior is to use whatever DOM size is computed for the `<canvas>` element.

Note that if you specify a fixed width, you must also include a [height](#height).

### zeroFloor

| Type | Default |
|------|---------|
| Boolean | `true` |

By default, pixl-chart will "zero" the chart at the bottom edge.  Meaning, the bottom of the chart is always considered Y value `0`, regardless of your data's range.  If you set `zeroFloor` to `false`, then your data will dictate the lowest Y value, and the chart will adjust itself.

### zoom

| Type | Default |
|------|---------|
| Object | `null` |

Use the optional `zoom` property to artificially "zoom in" your dataset.  If specified, `zoom` should be an object with `xMin`, `xMax`, `yMin` and `yMax` properties.  See [Zooming](#zooming) for details on how to use this.

## API

Here are the available methods you can call on your `Chart` instance.

### addLayer

```
VOID addLayer( OBJECT )
```

The `addLayer()` method adds a layer to the chart.  This can be called at any time, even after a chart is rendered (this will trigger a follow-up render).  See [Adding Layers](#adding-layers) for details on how to format your layer object.

### addLayers

```
VOID addLayers( ARRAY )
```

The `addLayers()` method adds multiple layers to the chart at once.  This can be called at any time, even after a chart is rendered (this will trigger a follow-up render).  See [Adding Layers](#adding-layers) for details on how to format your layer data.

### addLayerSample

```
VOID addLayerSample( INDEX, OBJECT, MAX )
```

The `addLayerSample()` method appends a single data sample to the layer specified by its index number.  While you can manually manipulate the `layer.data` array, this method properly massages the new values in the same way as `addLayer()`.  For e.g. this converts the date if needed, prepares samples for [delta](#delta) mode, applies offsets, and so on.  It will also mark the chart as "dirty" so it redraws on the next frame.  Example:

```js
chart.addLayerSample( 0, { x:1739679710, y:45 }, 60 );
```

This would append the sample to the first layer (`0`), and apply a max of `60` samples.  So if this is the 61st sample in the set, it will automatically drop the first one to shift forward in time.

### render

```
VOID render()
```

The `render()` method renders the chart into the attached `<canvas>` element.  If you have multiple charts on a single page, it is recommended that you use [Chart Management](#chart-management) instead.

### update

```
VOID update()
```

The `update()` method tells pixl-chart that the current chart has new or updated data (or changed configuration options), and needs to be re-rendered.  This is the "nice" way of updating a chart, versus calling [render()](#render) directly.  See [Chart Management](#chart-management) for details.

### snapshot

```
VOID snapshot( OPTIONS, CALLBACK )
```

The `snapshot()` method takes a snapshot of the chart, and produces a flat image (WebP, PNG or JPEG format).  You can request a data URL, or a blob, and override other settings as well.  See [Snapshots](#snapshots) for details.

### download

```
VOID download( OPTIONS )
```

The `download()` method takes a snapshot of the chart, and downloads the image to your local machine.  You can specify a number of settings here including format, quality, and override chart settings as well.  See [Downloads](#downloads) for details.

### on

```
VOID on( NAME, LISTENER )
```

The `on()` method adds an event listener for a specific event.  You need to specify an event name, and a listener function.  See [Events](#events) for details.

### off

```
VOID off( NAME, LISTENER )
```

The `off()` method removes an event listener from a specific event.  You need to specify an event name, and the listener function you previously specified with [on()](#on).  See [Events](#events) for details.

### destroy

```
VOID destroy()
```

The `destroy()` method completely disposes of the current chart object.  It removes the chart from management, removes all DOM listeners, and removes all the references to DOM objects and contexts.  It does not erase the chart, or otherwise touch the `<canvas>` object; it merely disassociates itself, and frees up all memory it was using.

After calling this the chart object can no longer be used.

## Properties

Here are some properties you can access on your `Chart` instance, once it is initialized:

### dataLimits

The `dataLimits` object is computed based on your dataset on every render cycle, and contains the following properties:

| Property | Description |
|----------|-------------|
| `xMin` | The lowest X value (timestamp) across your entire dataset. |
| `xMax` | The highest X value (timestamp) across your entire dataset. |
| `yMin` | The lowest Y value across your entire dataset (or simply `0` if [zeroFloor](#zerofloor) is enabled). |
| `yMax` | The highest Y value across your entire dataset (possibly adjusted by [autoHeadroom](#autoheadroom)). |
| `width` | The width of your dataset (`xMax - xMin`). |
| `height` | The height of your dataset (`yMax - yMin`). |

### bounds

The `bounds` object is computed once every render cycle, and contains the physical boundaries of the data render area (inset by all padding, titles, axis labels, legend, etc.).  The coordinates are in adjusted canvas space, relative to the top-left corner of the canvas, and they are not affected by the screen [density](#density).  Here are the available properties:

| Property | Description |
|----------|-------------|
| `x` | The horizontal coordinate of the left side of the bounds rect, in pixels. |
| `y` | The vertical coordinate of the top side of the bounds rect, in pixels. |
| `width` | The width of the bounds rect, in pixels. |
| `height` | The height of the bounds rect, in pixels. |

## Events

Here are all the events you can add listeners for using [on()](#on):

### render

The `render` event is emitted after rendering is complete.  This may be emitted many times, especially if the chart is resized.  You could use this event to draw your own elements onto the chart `<canvas>`.  Example:

```js
chart.on('render', function() {
	// draw our own element on the canvas
	chart.ctx.fillStyle = 'red';
	chart.ctx.fillRect( 50, 50, 100, 100 );
});
```

### mouseover

The `mouseover` event is emitted when the user's mouse cursor enters the chart.  Your event listener will be passed the raw [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object from the browser.  See [Hover Overlay](#hover-overlay) for details on how to use this, and other events.

### mousemove

The `mousemove` event is emitted when the user moves the mouse cursor over the chart.  This event is called repeatedly while the mouse cursor moves.  Your event listener will be passed the raw [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object from the browser.

### mouseout

The `mouseout` event is emitted when the user's mouse cursor leaves the chart.  Your event listener will be passed the raw [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object from the browser.

### mousedown

The `mousedown` event is emitted when the user presses a mouse button down inside the chart.  Your event listener will be passed the raw [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object from the browser.

### mouseup

The `mouseup` event is emitted when the user releases a mouse button inside the chart.  Your event listener will be passed the raw [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object from the browser.

### click

The `click` event is emitted when the user presses and then releases a mouse button inside the chart.  Your event listener will be passed the raw [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object from the browser.

# Development

To build pixl-chart from source, use the included build script, which you can invoke from NPM like this:

```
npm run build
```

This reads the source files in `src/*` and produces the single output file `chart.min.js`.

# License

**The MIT License (MIT)**

*Copyright (c) 2021 Joseph Huckaby.*

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
