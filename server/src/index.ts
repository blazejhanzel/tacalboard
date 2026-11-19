import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { join } from "node:path";
import syncRoutes from "./routes/sync.js";
import statusRoutes from "./routes/status.js";

const app = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(syncRoutes, {
  prefix: "/api/sync",
});

await app.register(statusRoutes, {
  prefix: "/api/status",
});

await app.register(fastifyStatic, {
  root: join(process.cwd(), "..", "web", "dist"),
  prefix: "/",
});

app.setNotFoundHandler((request, reply) => {
  const url = request.raw.url ?? "/";

  if (url === "/api" || url.startsWith("/api/")) {
    return reply.code(404).send({
      statusCode: 404,
      error: "Not Found",
      message: "Route not found",
    });
  }

  return reply.sendFile("index.html");
});

await app.listen({
  port: Number(process.env.PORT ?? 8080),
  host: "0.0.0.0",
});
