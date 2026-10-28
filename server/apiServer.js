import express from 'express'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import pacientesRoutes from './routes/pacientes.routes.js'

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const production = process.argv.includes('--production');
const port = Number(process.env.API_PORT || process.env.PORT || (production ? 4173 : 3001));
const host = production ? '0.0.0.0' : '127.0.0.1';
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '8mb' }));
app.use('/api/pacientes', pacientesRoutes);
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Ruta de API no encontrada.' });
});

if (production) {
  const directorioDist = resolve(projectRoot, 'dist');
  app.use(express.static(directorioDist));
  app.get('*splat', (req, res, next) => {
    const rutaSolicitada = resolve(directorioDist, `.${req.path}`);
    if (rutaSolicitada !== directorioDist && !rutaSolicitada.startsWith(`${directorioDist}${sep}`)) {
      res.status(403).send('Acceso denegado.');
      return;
    }
    res.sendFile(resolve(directorioDist, 'index.html'), error => {
      if (error) next(error);
    });
  });
} else {
  app.use((req, res) => {
    res.status(404).send('Usa el servidor de desarrollo de Vite para acceder a la aplicación.');
  });
}

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'El cuerpo de la solicitud no contiene JSON válido.' });
    return;
  }
  if (error.type === 'entity.too.large') {
    res.status(413).json({ message: 'El archivo es demasiado grande. El límite de carga es 8 MB.' });
    return;
  }

  console.error('Error al procesar una solicitud.', error);
  res.status(500).json({ message: 'Ocurrió un error al procesar la solicitud.' });
});

app.listen(port, host, () => {
  console.log(`API VetChiloé escuchando en ${host}:${port}`);
  if (production) console.log(`Aplicación disponible en el puerto ${port}`);
});
