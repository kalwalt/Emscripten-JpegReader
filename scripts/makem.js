/*
 * Simple script for running emcc
 */


var
	exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs'),
	os = require('os'),
	child;

var EMSCRIPTEN_ROOT = process.env.EMSCRIPTEN;

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

MAIN_SOURCES = MAIN_SOURCES.map(function(src) {
  return path.resolve(SOURCE_PATH, src);
}).join(' ');

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

var compile_wasm_es6 = format(EMCC + ' ' + INCLUDES + ' ' + MAIN_SOURCES
	 + FLAGS + WASM_FLAGS + DEFINES + ES6_FLAGS + ' -o {OUTPUT_PATH}{BUILD_FILE} ',
	 OUTPUT_PATH, BUILD_WASM_ES6_FILE);

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
addJob(compile_wasm_es6)

runJob();
