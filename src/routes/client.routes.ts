import express from "express";
import { hasPermissions } from "../middlewares/hasPermission";
import Permission from "../lib/constants/Permission";
import { hasCookies } from "../middlewares/hasCookies";
import { AccessTokenKey, RefreshTokenKey } from "../lib/constants/TokenKeys";
import { decodeToken } from "../lib/helpers/token.helper";
import { hasQueryParam } from "../middlewares/hasQueryParam";
import { hasPathVariable } from "../middlewares/hasPathVariable";
import { hasBodyFields } from "../middlewares/hasBodyFields";
import { z } from "zod";
import ClientController from "../controllers/client.controller";

const clientRoutes = express.Router();

// Constants for validation
const isNumber = (value: string) => !isNaN(parseInt(value));
const isString = (value: any) => z.string().safeParse(value).success;
const clientIdValidator = {
    name: "id",
    customValidator: isNumber,
    message: "The client ID must be a valid number.",
};

// Middleware for token validation
const tokenValidation = hasCookies(
    { name: RefreshTokenKey, required: false },
    {
        name: AccessTokenKey,
        required: true,
        validator: (value) => !!decodeToken(value),
    }
);

// Middleware for query parameters validation
const paginationValidation = hasQueryParam(
    { name: "page", required: true, customValidator: isNumber },
    { name: "limit", required: true, customValidator: isNumber }
);

// Middleware for body fields validation
const clientBodyFieldsValidation = hasBodyFields(
    {
        name: "label",
        required: false,
        customValidator: isString,
    },
    {
        name: "description",
        required: false,
        customValidator: isString,
    }
);

clientRoutes.use(tokenValidation);

clientRoutes
    .route("/")
    .get(paginationValidation, hasPermissions([Permission.ReadClients]), ClientController.getAllClients);

clientRoutes
    .route("/search")
    .get(
        hasQueryParam(
            { name: "query", required: false },
            { name: "sort", required: false },
            { name: "order", required: false },
            ...paginationValidation
        ),
        ClientController.searchClients
    );

clientRoutes
    .route("/:id")
    .get(...hasPathVariable(clientIdValidator), hasPermissions([Permission.ReadClients]), ClientController.getClient)
    .put(
        ...hasPathVariable(clientIdValidator),
        clientBodyFieldsValidation,
        hasPermissions([Permission.ReadClients, Permission.ModifyClients]),
        ClientController.updateClient
    )
    .delete(
        ...hasPathVariable(clientIdValidator),
        hasPermissions([Permission.ReadClients, Permission.ModifyClients]),
        ClientController.deleteClient
    );

clientRoutes
    .route("/:id/archive")
    .patch(
        ...hasPathVariable(clientIdValidator),
        hasPermissions([Permission.ModifyClients]),
        ClientController.archiveClient
    );

clientRoutes
    .route("/:id/unarchive")
    .patch(
        ...hasPathVariable(clientIdValidator),
        hasPermissions([Permission.ModifyClients]),
        ClientController.unarchiveClient
    );

clientRoutes
    .route("/:id/destroy")
    .delete(
        ...hasPathVariable(clientIdValidator),
        hasPermissions([Permission.DeleteClients]),
        ClientController.destroyClient
    );

clientRoutes
    .route("/:id/recover")
    .patch(
        ...hasPathVariable(clientIdValidator),
        hasPermissions([Permission.ModifyClients]),
        ClientController.recoverClient
    );

clientRoutes
    .route("/:id/contract")
    .get(
        ...hasPathVariable(clientIdValidator),
        hasPermissions([Permission.ReadClients, Permission.ReadContracts]),
        ClientController.getAllClientContracts
    );

export default clientRoutes;
