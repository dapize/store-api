import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

async function runBuild() {
  try {
    await build({
      entryPoints: ['src/server.ts'],
      outdir: 'dist',
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node20',
      minify: false,
      alias: {
        '@modules': './src/modules',
        '@config': './src/config',
        '@app': './src/app',
        '@server': './src/server',
        '@utils': './src/utils'
      },
      plugins: [nodeExternalsPlugin()]
    });
    console.log('✅ Build completado exitosamente');
  } catch (err) {
    console.error('❌ Error en build:', err);
    process.exit(1);
  }
}

runBuild();
