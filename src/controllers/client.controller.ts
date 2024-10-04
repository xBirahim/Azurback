import { Request, Response, NextFunction } from "express";
import { createSuccessResponse } from "../lib/helpers/response.helper";
import { db } from "../database/db";
import { gt, asc, ilike, or, eq, desc, SQL } from "drizzle-orm";
import { Client, Contract, User } from "../database/schemas";
import { createError } from "../lib/errors/app.error";
import Status from "../lib/constants/Status";

interface QueryParams {
    limit?: string;
    page?: string;
    query?: string;
    sort?: string;
    order?: string;
}

class ClientController {
    private static validateId(id: string): number {
        const clientId = parseInt(id);
        if (isNaN(clientId)) {
            throw createError({ message: "Invalid client ID", code: 400 });
        }
        return clientId;
    }

    private static async checkClientExists(clientId: number): Promise<void> {
        const exist = await db.select().from(Client).where(eq(Client.id, clientId)).limit(1).execute();
        if (!exist.length) {
            throw createError({ message: "Client not found", code: 404 });
        }
    }

    private static async changeClientStatus(
        req: Request,
        res: Response,
        next: NextFunction,
        status: string,
        message: string
    ): Promise<void> {
        try {
            const clientId = ClientController.validateId(req.params.id);

            await ClientController.checkClientExists(clientId);

            const client = await db
                .update(Client)
                .set({ status: status as unknown as SQL<unknown> })
                .where(eq(Client.id, clientId))
                .execute();

            createSuccessResponse(res, {
                status: 200,
                message: message,
                data: client,
            });
        } catch (error) {
            next(error);
        }
    }

    static async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { label, description, creator } = req.body;

        try {
            if (!label) {
                throw createError({ message: "Missing property 'label'", code: 400 });
            }

            const newClient = await db.insert(Client).values({ label, description, creator: creator.id }).execute();

            createSuccessResponse(res, {
                status: 201,
                message: "Client created successfully",
                data: newClient,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientId = ClientController.validateId(req.params.id);

            const [client] = await db
                .select()
                .from(Client)
                .innerJoin(User, eq(Client.creator, User.id))
                .where(eq(Client.id, clientId))
                .limit(1)
                .execute();

            if (!client) {
                throw createError({ message: "Client not found", code: 404 });
            }

            createSuccessResponse(res, {
                status: 200,
                message: "Client retrieved successfully",
                data: client,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllClients(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { limit: rawLimit, page: rawPage } = req.query as QueryParams;

        const limit = Number(rawLimit) || 10;
        const page = Math.max(0, Number(rawPage) - 1);

        try {
            const result = await db
                .select()
                .from(Client)
                .where(page ? gt(Client.id, page) : undefined)
                .limit(limit)
                .orderBy(asc(Client.id));

            createSuccessResponse(res, {
                status: 200,
                message: "Clients retrieved successfully",
                data: result,
                metadata: { count: result.length, limit, page: page + 1 },
            });
        } catch (error) {
            next(error);
        }
    }

    static async searchClients(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { query, page: rawPage, limit: rawLimit, sort: rawSort, order: rawOrder } = req.query as QueryParams;

        const searchQuery = query || "";
        const page = Number(rawPage) || 1;
        const limit = Number(rawLimit) || 10;
        const sort = rawSort || "id";
        const order = rawOrder === "desc" ? "desc" : "asc";

        let sortedColumn;

        try {
            const conditions = or(
                ilike(Client.label, `%${searchQuery}%`),
                ilike(Client.description, `%${searchQuery}%`)
            );
            if (sort && sort in Client) {
                sortedColumn = Client[sort as keyof typeof Client.$inferSelect];
            } else {
                sortedColumn = Client.id;
            }
            const dbQuery = db
                .select()
                .from(Client)
                .where(conditions)
                .innerJoin(User, eq(Client.creator, User.id))
                .orderBy(order === "desc" ? desc(sortedColumn) : asc(sortedColumn));

            if (limit !== -1) {
                dbQuery.limit(limit);
            }

            const result = await dbQuery.execute();

            const totalCount = result.length;
            const effectiveLimit = limit === -1 ? totalCount : limit;
            const totalPages = Math.ceil(totalCount / effectiveLimit);

            createSuccessResponse(res, {
                status: 200,
                message: "Clients retrieved successfully",
                data: result,
                metadata: {
                    first: 1,
                    prev: page > 1 ? page - 1 : null,
                    next: page < totalPages ? page + 1 : null,
                    last: totalPages,
                    pages: totalPages,
                    count: totalCount,
                    limit: effectiveLimit,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { label, description } = req.body;

        try {
            const clientId = ClientController.validateId(req.params.id);

            if (!label) {
                throw createError({ message: "Missing property 'label'", code: 400 });
            }

            await ClientController.checkClientExists(clientId);

            const client = await db.update(Client).set({ label, description }).where(eq(Client.id, clientId)).execute();
            
            createSuccessResponse(res, {
                status: 200,
                message: "Client updated successfully",
                data: client,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        return ClientController.changeClientStatus(
            req,
            res,
            next,
            Status.del,
            "Client marked as deleted successfully."
        );
    }

    static async recoverClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        return ClientController.changeClientStatus(req, res, next, Status.val, "Client recovered successfully.");
    }

    static async archiveClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        return ClientController.changeClientStatus(req, res, next, Status.arc, "Client archived successfully.");
    }

    static async unarchiveClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        return ClientController.changeClientStatus(req, res, next, Status.val, "Client unarchived successfully.");
    }

    static async destroyClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientId = ClientController.validateId(req.params.id);

            await ClientController.checkClientExists(clientId);

            const client = await db.delete(Client).where(eq(Client.id, clientId)).execute();

            createSuccessResponse(res, {
                status: 200,
                message: "Client destroyed successfully",
                data: client,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllClientContracts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientId = ClientController.validateId(req.params.id);

            const contracts = await db
                .select()
                .from(Contract)
                .innerJoin(User, eq(Contract.creator, User.id))
                .where(eq(Contract.clientId, clientId))
                .execute();

            if (!contracts.length) {
                throw createError({ message: "Contracts not found", code: 404 });
            }

            createSuccessResponse(res, {
                status: 200,
                message: "Contracts retrieved successfully",
                data: contracts,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ClientController;
