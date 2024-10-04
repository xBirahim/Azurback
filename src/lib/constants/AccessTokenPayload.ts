import { AccesTokenPayloadValidator } from "../validators/token.validators";

export type AccessTokenPayload = typeof AccesTokenPayloadValidator._type;