// server.js
import express from 'express';
import compression from 'compression';
import { createRequestHandler } from '@remix-run/express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url); // to use require with ESM

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BUILD_DIR = path.join(__dirname, 'build/server/index.js');

const app = express();

app.use(compression());
app.use(express.static("public"));
// Serve built assets from build/client
app.use(express.static("build/client"));

app.all(
    "*",
    async (req, res) => {
        const { createRequestHandler } = await import('@remix-run/express');
        const build = await import(BUILD_DIR);
        const handler = createRequestHandler({
            build,
            mode: process.env.NODE_ENV,
        });
        return handler(req, res);
    }
);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Remix app listening on http://0.0.0.0:${port}`);
});