import { authMiddleware } from "./../middleware/auth";
import { errorMidleware } from "./../middleware/errors";
import { PrismaClient } from "@prisma/client";
import express, { request } from "express";
import { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes/indexRoutes";

const app = express();
app.use(express.json());

app.use("/api", rootRouter);
app.use(authMiddleware);

export const prisma = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo},${addr.city}, ${addr.country} -${addr.pincode}`;
        },
      },
    },
  },
});

// app.use(errorMidleware);

app.listen(1000, () => {
  console.log("App working");
});
