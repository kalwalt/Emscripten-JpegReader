import pkg from './package.json';
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
	external: [
		...Object.keys(pkg.dependencies || {})
	],
	plugins: [
		json(),
		nodeResolve(),
		terser() // minifies generated bundles
	]
};