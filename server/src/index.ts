import Fastify from "fastify"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import fastifyStatic from "@fastify/static"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { join } from "node:path"
import QRCode from "qrcode"
import { readFileSync } from 'node:fs'
import syncRoutes from "@/routes/sync.js"

// Version info
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))
const version = packageJson.version
const channel = process.env.BUILD_CHANNEL ?? 'dev'
const buildNumber = process.env.BUILD_NUMBER
const gitSha = process.env.GIT_SHA?.slice(0, 7)
export const __APP_VERSION__ = buildNumber && gitSha
  ? `${version}-${channel}.${buildNumber}+g${gitSha}`
  : `${version}-${channel}+g${gitSha ?? 'local'}`

const app = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

await app.register(swagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Tacalboard API",
      description: "API for Tacalboard",
      version: version
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