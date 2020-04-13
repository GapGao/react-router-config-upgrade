import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import typescript from "rollup-plugin-typescript2";
import { DEFAULT_EXTENSIONS } from "@babel/core";
const pkg = require("./package.json");

const external = ["react", "react-router", "react-router-dom"];

export default [
  // dev
  {
    input: "modules/index.ts",
    output: {
      file: `dist/cjs/${pkg.name}.js`,
      sourcemap: true,
      format: "cjs",
      esModule: false,
    },
    external,
    plugins: [
      typescript(),
      babel({
        exclude: /node_modules/,
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        sourceMaps: true,
        rootMode: "upward",
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
    ],
  },
  {
    // prod
    input: "modules/index.ts",
    output: {
      file: `dist/cjs/${pkg.name}.min.js`,
      sourcemap: true,
      format: "cjs",
    },
    external,
    plugins: [
      typescript(),
      babel({
        exclude: /node_modules/,
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        sourceMaps: true,
        rootMode: "upward",
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      uglify(),
    ],
  },
];
