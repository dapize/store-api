import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { app } from './app';

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('📦 Base de datos conectada exitosamente.');

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
    process.exit(1);
  }
};

startServer();
