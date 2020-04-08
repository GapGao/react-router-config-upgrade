import liveServer from "rollup-plugin-live-server";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import { DEFAULT_EXTENSIONS } from "@babel/core";

export default [
  {
    input: "test/src/index.tsx",
    output: {
      file: `test/dist/index.js`,
      sourcemap: true,
      sourcemapPathTransform: (relativePath) =>
        relativePath.replace(/^.*?\/node_modules/, "../../node_modules"),
      format: "umd",
    },
    watch: {
      include: "test/src/**",
    },
    plugins: [
      typescript(),
      nodeResolve({ exclude: /node_modules/ }),
      babel({
        exclude: /node_modules/,
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
        sourceMaps: true,
        rootMode: "upward",
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
      commonjs({
        namedExports: {
          "node_modules/react/index.js": ["Component"],
          "node_modules/react-is/index.js": ["isValidElementType"],
        },
      }),
      liveServer({
        open: true,
        host: "localhost",
        port: 10010,
        root: "test/dist",
      }),
    ],
  },
];
