import { z } from "zod";

const NODE_ENV = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string().transform((val) => parseInt(val, 10)),
});

const FrontendEnvSchema = z.object({
    FRONTEND_BASE_URL: z.string(),
    FRONTEND_EMAIL_CONFIRMATION_URL: z.string(),
});

const MailEnvSchema = z.object({
    MAIL_HOST: z.string(),
    MAIL_TLS_PORT: z.string().transform((val) => parseInt(val, 10)),
    MAIL_SSL_PORT: z.string().transform((val) => parseInt(val, 10)),
    MAIL_USERNAME: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_FROM: z.string(),
    MAIL_SECURE: z
        .string()
        .optional()
        .refine((val) => val === "true" || val === "false", {
            message: "MAIL_SECURE must be 'true' or 'false' or left blank",
        })
        .transform((val) => val === "true"),
});

const SecretEnvSchema = z.object({
    SECRET_KEY: z.string().min(1, { message: "SECRET_KEY must be defined !" }),
});

const SupabaseEnvSchema = z.object({
    SUPABASE_URL: z.string(),
    SUPABASE_SECRET_KEY: z.string(),
    SUPABASE_ANON_KEY: z.string(),
    SUPABASE_JWT_SECRET: z.string(),
});

const DBEnvSchema = z.object({
    DB_DIALECT: z.enum(["mysql", "postgres", "sqlite", "mariadb", "mssql", "db2", "snowflake", "oracle"]),
    DB_NAME: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOSTNAME: z.string(),
    DB_PORT: z.string().transform((val) => parseInt(val, 10)),
    DB_SSL: z
        .string()
        .optional()
        .refine((val) => val === "true" || val === "false", {
            message: "DB_SSL must be 'true' or 'false' or left blank",
        })
        .transform((val) => val === "true"),
    DB_CONNECTION_STRING: z.string(),
});

const LogSchema = z.object({
    LOG_DIR: z.string(),
    LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]),
    LOG_MAX_FILES: z.string().regex(/^\d+d?$/, {
        message: "LOG_MAX_FILES must be a number or a number followed by 'd' for days",
    }),
});

const RedisEnvSchema = z.object({
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().transform((val) => parseInt(val, 10)),
    REDIS_PASSWORD: z.string(),
});

const EnvSchema = NODE_ENV.merge(SecretEnvSchema)
    .merge(FrontendEnvSchema)
    .merge(DBEnvSchema)
    .merge(SupabaseEnvSchema)
    .merge(MailEnvSchema)
    .merge(LogSchema)
    .merge(RedisEnvSchema);

type EnvironmentVariables = z.infer<typeof EnvSchema>;

const Env: EnvironmentVariables = EnvSchema.parse(process.env);

export default Env;
