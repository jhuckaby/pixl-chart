// pixl-chart builder script
// This builds `chart.min.js` from the source files in src/*
// Usage: npm run build
// Copyright (c) 2021 Joseph Huckaby and PixlCore.com
// MIT License

const fs = require('fs');
const zlib = require('zlib');
const UglifyJS = require("uglify-js");
const UglifyCSS = require('uglifycss');
const package = require('./package.json');

process.chdir( __dirname );

var output_file = 'chart.min.js';

// first, load the source files
var code = fs.readFileSync('src/chart.js', 'utf8');
var css = fs.readFileSync('src/chart.css', 'utf8');

// minify + wrap the css and append it to the js
var mcss = UglifyCSS.processString( css, {} );
var mcss_payload = JSON.stringify( mcss );

code += `
(function() {
	var sty = document.createElement('style');
	sty.innerHTML = ${mcss_payload};
	document.head.appendChild(sty);
})();
`;

// finally, minify the js
var opts = {
	compress: true,
	mangle: true,
	output: {
		preamble: "// pixl-chart v" + package.version + " - (c) " + (new Date()).getFullYear() + " " + package.author + " - " + package.license + " License - " + package.homepage
	}
};
var result = UglifyJS.minify(code, opts);
if (result.error) throw result.error;
var output = result.code;

console.log( "\n" + output + "\n" );

// write to output file
fs.writeFileSync( output_file, output + "\n" );
console.log("Wrote file: " + output_file);

// emit some file stats
var min_size = fs.statSync(output_file).size;
var min_nice = Math.floor( min_size / 1024 ) + "K";
console.log( "Minified: " + min_nice + " (" + min_size + " bytes)" );

var gz_size = zlib.gzipSync( fs.readFileSync(output_file), { level: 9 } ).length;
var gz_nice = Math.floor( gz_size / 1024 ) + "K";
console.log( "Gzipped: " + gz_nice + " (" + gz_size + " bytes)" );
console.log( "" );
