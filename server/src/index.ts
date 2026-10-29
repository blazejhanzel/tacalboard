import Fastify from "fastify"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import fastifyStatic from "@fastify/static"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { join } from "node:path"
import QRCode from "qrcode"

import syncRoutes from "@/routes/sync.js"

const app = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

await app.register(swagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Tacalboard API",
      description: "API for Tacalboard",
      version: "0.1.1"
    }
  }
})

await app.register(swaggerUi, {
  routePrefix: "/docs"
})

await app.register(syncRoutes, {
  prefix: "/api/sync"
})

app.get('/api/status', async () => {
  return {
    status: 'ok'
  }
})

await app.register(fastifyStatic, {
  root: join(process.cwd(), "..", "web", "dist"),
  prefix: "/",
})

app.setNotFoundHandler((request, reply) => {
  const url = request.raw.url ?? "/"

  if (url === "/api" || url.startsWith("/api/") ||
      url === "/docs" || url.startsWith("/docs/")) {
    return reply.code(404).send({
      statusCode: 404,
      error: "Not Found",
      message: "Route not found"
    })
  }

  return reply.sendFile("index.html")
})

await app.listen({
  port: Number(process.env.PORT ?? 8080),
  host: "0.0.0.0"
})