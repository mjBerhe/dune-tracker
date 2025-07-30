const { dts } = require("rollup-plugin-dts");

const config = [
  {
    input: "src/index.ts",
    output: {
      file: "../frontend/src/typegen/hono-api.d.ts", // where you want to place the type in frontend
      format: "es",
    },
    plugins: [dts()],
  },
];
export default config;
