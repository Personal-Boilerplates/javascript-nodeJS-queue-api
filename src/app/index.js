import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import Queue from "../lib/Queue";

import routes from "./routes";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
    Queue.process();
  }

  middlewares() {
    this.server.use(helmet());
    this.server.use(
      cors({
        origin: process.env.API_URL,
      })
    );
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use((err, req, res, _next) => {
        console.log(err);

        const errorStatus = 500;
        const errorObject = {
          status: 'error',
          message: 'Internal server error',
          userFriendly: false,
        }
        try {
          if (err instanceof AppError) {
            return res.status(err.statusCod || errorStatus).json({
              ...errorObject,
              status: 'error',
              message: err.message,
              userFriendly: err?.userFriendly,
            });
          } else {
            return res.status(errorStatus).json(errorObject);
          }
        } catch {
          return res.status(errorStatus).json(errorObject);
        }
      }
    );
  }
}

export default new App().server;
