import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import QRCode from "qrcode";

import notesRoutes from "./routes/notes.js";

const app = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(swagger, {
    openapi: {
        openapi: "3.0.3",
        info: {
            title: "Tacalboard API",
            description: "API for Tacalboard",
            version: "0.1.0"
        }
    }
});

await app.register(swaggerUi, {
    routePrefix: "/docs"
});

await app.register(notesRoutes, {
    prefix: "/api/notes"
});

app.get('/api/status', async () => {
  return {
    status: 'ok'
  }
})

await app.listen({
  port: 8080,
  host: "0.0.0.0"
});