/*
 * Simple script for running emcc
 */


var
	exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs'),
	os = require('os'),
	child;

const platform = os.platform();

var EMSCRIPTEN_ROOT = process.env.EMSCRIPTEN;
var WEBARKITLIB_ROOT = process.env.WEBARKITLIB_ROOT || path.resolve(__dirname, "../emscripten/WebARKitLib");


if (!EMSCRIPTEN_ROOT) {
  console.log("\nWarning: EMSCRIPTEN environment variable not found.")
  console.log("If you get a \"command not found\" error,\ndo `source <path to emsdk>/emsdk_env.sh` and try again.");
}

var EMCC = EMSCRIPTEN_ROOT ? path.resolve(EMSCRIPTEN_ROOT, 'emcc') : 'emcc';
var EMPP = EMSCRIPTEN_ROOT ? path.resolve(EMSCRIPTEN_ROOT, 'em++') : 'em++';
var OPTIMIZE_FLAGS = ' -Oz '; // -Oz for smallest size
var MEM = 64 * 1024 * 1024; // 64MB


var SOURCE_PATH = path.resolve(__dirname, '../emscripten/') + '/';
var OUTPUT_PATH = path.resolve(__dirname, '../build/') + '/';

var BUILD_WASM_ES6_FILE = 'JpegReader_ES6_wasm.js';

var MAIN_SOURCES = [
	'JpegReaderJS.cpp'
];

if (!fs.existsSync(path.resolve(WEBARKITLIB_ROOT, 'include/AR/config.h'))) {
	console.log("Renaming and moving config.h.in to config.h");
	fs.copyFileSync(
		path.resolve(WEBARKITLIB_ROOT, 'include/AR/config.h.in'),
		path.resolve(WEBARKITLIB_ROOT, 'include/AR/config.h')
	);
	console.log("Done!");
}

MAIN_SOURCES = MAIN_SOURCES.map(function(src) {
    return path.resolve(SOURCE_PATH, src);
  }).join(' ');
  
  let srcTest = path.resolve(__dirname, WEBARKITLIB_ROOT + '/lib/SRC/');
  
  let arSources, ar_sources;
  
  if (platform === 'win32') {
      var glob = require("glob");
  function match(pattern) {
      var r = glob.sync('emscripten/WebARKitLib/lib/SRC/' + pattern);
      return r;
  }
  function matchAll(patterns, prefix="") {
      let r = [];
      for(let pattern of patterns) {
          r.push(...(match(prefix + pattern)));
      }
      return r;
  }
  
    ar_sources = matchAll([
      'AR/arLabelingSub/*.c',
      'AR/*.c',
      'ARICP/*.c',
      'ARUtil/log.c',
      'ARUtil/file_utils.c',
  ]);
  } else {
      ar_sources = [
        'AR/arLabelingSub/*.c',
        'AR/*.c',
        'ARICP/*.c',
        'ARUtil/log.c',
        'ARUtil/file_utils.c',
      ].map(function(src) {
          return path.resolve(__dirname, WEBARKITLIB_ROOT + '/lib/SRC/', src);
      });
  }
  
  var ar2_sources = [
      'handle.c',
      'imageSet.c',
      'jpeg.c',
      'marker.c',
      'featureMap.c',
      'featureSet.c',
      'selectTemplate.c',
      'surface.c',
      'tracking.c',
      'tracking2d.c',
      'matching.c',
      'matching2.c',
      'template.c',
      'searchPoint.c',
      'coord.c',
      'util.c',
  ].map(function(src) {
      return path.resolve(__dirname, WEBARKITLIB_ROOT + '/lib/SRC/AR2/', src);
  });

  ar_sources = ar_sources
  .concat(ar2_sources)

var DEFINES = ' ';
var FLAGS = '' + OPTIMIZE_FLAGS;
FLAGS += ' -Wno-warn-absolute-paths ';
FLAGS += ' -s TOTAL_MEMORY=' + MEM + ' ';
FLAGS += ' -s USE_ZLIB=1';
FLAGS += ' -s USE_LIBJPEG';
FLAGS += ' --memory-init-file 0 '; // for memless file
FLAGS += ' -s "EXTRA_EXPORTED_RUNTIME_METHODS=[\'FS\']"';
FLAGS += ' -s ALLOW_MEMORY_GROWTH=1';

var WASM_FLAGS = ' -s SINGLE_FILE=1 '
var ES6_FLAGS = ' -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0 -s MODULARIZE=1 ';

FLAGS += ' --bind ';

var INCLUDES = [
    path.resolve(__dirname, WEBARKITLIB_ROOT + '/include'),
    OUTPUT_PATH,
    SOURCE_PATH,
].map(function(s) { return '-I' + s }).join(' ');

function format(str) {
    for (var f = 1; f < arguments.length; f++) {
        str = str.replace(/{\w*}/, arguments[f]);
    }
    return str;
}

function clean_builds() {
    try {
        var stats = fs.statSync(OUTPUT_PATH);
    } catch (e) {
        fs.mkdirSync(OUTPUT_PATH);
    }

    try {
        var files = fs.readdirSync(OUTPUT_PATH);
				var filesLength = files.length;
        if (filesLength > 0)
            for (var i = 0; i < filesLength; i++) {
                var filePath = OUTPUT_PATH + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
            }
    }
    catch(e) { return console.log(e); }
}

var compile_arlib = format(EMCC + ' ' + INCLUDES + ' '
    + ar_sources.join(' ')
    + FLAGS + ' ' + DEFINES + ' -r -o {OUTPUT_PATH}libar.bc ',
    OUTPUT_PATH);

var ALL_BC = " {OUTPUT_PATH}libar.bc ";

var compile_wasm_es6 = format(EMCC + ' ' + INCLUDES + ' '
		 + ALL_BC + MAIN_SOURCES
		 + FLAGS + WASM_FLAGS + DEFINES + ES6_FLAGS + ' -o {OUTPUT_PATH}{BUILD_FILE} ',
		 OUTPUT_PATH, OUTPUT_PATH, BUILD_WASM_ES6_FILE);

/*
 * Run commands
 */

function onExec(error, stdout, stderr) {
    if (stdout) console.log('stdout: ' + stdout);
    if (stderr) console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error.code);
        process.exit(error.code);
    } else {
        runJob();
    }
}

function runJob() {
    if (!jobs.length) {
        console.log('Jobs completed');
        return;
    }
    var cmd = jobs.shift();

    if (typeof cmd === 'function') {
        cmd();
        runJob();
        return;
    }

    console.log('\nRunning command: ' + cmd + '\n');
    exec(cmd, onExec);
}

var jobs = [];

function addJob(job) {
    jobs.push(job);
}

addJob(clean_builds);
addJob(compile_arlib);
addJob(compile_wasm_es6)

runJob();
