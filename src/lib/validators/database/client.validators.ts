import { z } from "zod";
import { Client } from "../../../database/schemas";
import { StatusValidator } from "../constants.validators";

export const ClientIdValidator = z.number().int().positive();
export const ClientLabelValidator = z.string();
export const ClientDescriptionValidator = z.string();
export const ClientCreatorValidator = z.string();
export const ClientCreatedValidator = z.string();
export const ClientLastmodifiedValidator = z.string();
export const ClientStatusValidator = StatusValidator;

export const ClientValidator = z.object({
    id: ClientIdValidator,
    label: ClientLabelValidator,
    description: ClientDescriptionValidator,
    creator: ClientCreatorValidator,
    created: ClientCreatedValidator,
    lastmodified: ClientLastmodifiedValidator,
    status: ClientStatusValidator,
});

// export const GetAllClientBodyValidator = 