import Fastify from "fastify";

const app = Fastify({
    logger: true
});

app.get("/api/health", async () => {
    return {
        status: "ok"
    };
});

app.listen({
    port: 8080,
    host: "0.0.0.0"
});