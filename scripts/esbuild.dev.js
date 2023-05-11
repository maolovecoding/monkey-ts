import { build } from 'esbuild'
import { fileURLToPath } from 'url'
build({
  entryPoints: [fileURLToPath(new URL("../src/index.ts", import.meta.url))],
  bundle: true,
  outfile: fileURLToPath(new URL("../dist/bundle.js", import.meta.url)),
  sourcemap: true,
  resolveExtensions: [".ts"],
  platform: "node",
}).then(res => {
  console.log("watching....")
}).catch(err => {
  console.log('构建失败！！！', err)
})