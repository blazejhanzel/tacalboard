import type { FastifyPluginAsync } from "fastify";

import { db } from "@/database/database.js";

const notesRoutes: FastifyPluginAsync = async (app) => {

    app.get("/", async () => {
        const notes = db
        .prepare("SELECT id, date, text FROM notes")
        .all();

        return notes;
    });

    app.post("/", async (request, reply) => {
        // POST /api/notes
    });

    app.get("/:id", async (request) => {
        // GET /api/notes/:id
    });

    app.patch("/:id", async (request) => {
        // PATCH /api/notes/:id
    });

    app.delete("/:id", async (request, reply) => {
        // DELETE /api/notes/:id
    });

};

export default notesRoutes;