import app from "./app";
import config from "./config/index";
import logger from "./util/logger";

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
