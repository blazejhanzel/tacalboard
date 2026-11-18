import { FastifyPluginAsync } from "fastify";
import { getDatabaseVersion } from "@/database/index.js";

const statusRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return {
      status: "ok",
      database: {
        version: getDatabaseVersion(),
      },
    };
  });
};

export default statusRoutes;
