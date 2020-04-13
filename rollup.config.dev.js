import liveServer from "rollup-plugin-live-server";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import { DEFAULT_EXTENSIONS } from "@babel/core";

export default [
  {
    input: "test/index.tsx",
    output: {
      file: `test/dist/index.js`,
      sourcemap: true,
      sourcemapPathTransform: (relativePath) =>
        relativePath.replace(/^.*?\/node_modules/, "../../node_modules"),
      format: "umd",
    },
    watch: {
      include: "test/**.tsx",
    },
    plugins: [
      typescript(),
      babel({
        exclude: /node_modules/,
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        sourceMaps: true,
        rootMode: "upward",
      }),
      nodeResolve(),
      commonjs({
        namedExports: {
          "node_modules/react/index.js": ["Component"],
          "node_modules/react-is/index.js": ["isValidElementType"],
        },
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
      liveServer({
        open: true,
        host: "localhost",
        port: 10010,
        root: "test",
        ignore: "*.tsx",
      }),
    ],
  },
];
