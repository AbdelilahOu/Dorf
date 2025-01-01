import pino from "pino";
import PinoPretty from "pino-pretty";

export const logger = pino(
  process.env.NODE_ENV === "production" ? undefined : PinoPretty(),
);
