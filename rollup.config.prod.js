import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import typescript from "rollup-plugin-typescript2";
import { DEFAULT_EXTENSIONS } from "@babel/core";

const external = ["react", "react-router"];

export default [
  {
    input: "modules/index.ts",
    output: {
      file: `cjs/react-router-config.min.js`,
      sourcemap: true,
      format: "cjs",
      globals: { react: "React", "react-router": "ReactRouter" },
    },
    external,
    plugins: [
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      typescript(),
      babel({
        exclude: /node_modules/,
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        sourceMaps: true,
        rootMode: "upward",
      }),
      uglify(),
    ],
  },
];
