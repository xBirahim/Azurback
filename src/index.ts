import app from "./app";
import Env from "./config/env.config";
import { Logger } from "./core/logger";

const port = Env.PORT || 8000;

app.listen(port, () => {
    Logger.Info("Server running at PORT: " + port);
}).on("error", (error) => {
    // gracefully handle error
    Logger.Error("An error occured", { error });
    throw new Error(error.message);
});
