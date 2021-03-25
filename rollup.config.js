//import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
export default {
	input: 'src/JpegReader.js', // our source file
	output: [
		{
			//umd
			format: 'umd',
			name: 'JpegReader',
			file: 'dist/JpegReader.js',
			sourcemap: true,
			globals: {
				axios: 'axios'
			}
		}
	],
	external: ['axios'],
	plugins: [
		commonjs({
			browser: false,
		  }),
		builtins(),
		babel({exclude: 'node_modules/**',  runtimeHelpers: true}),
		json({
			compact: true
		}),
		nodeResolve({
			jsnext: true,
			browser: true,
			preferBuiltins: false
		  }),
		terser() // minifies generated bundles
	]
};