import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import bootstrapAdmin from "./config/bootstrapAdmin.js";

export async function startServer() {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is required in backend/.env");
  await connectDatabase();
  await bootstrapAdmin();
  const port = process.env.PORT || 4000;
  return app.listen(port, () =>
    console.log(`MedQuora API listening on http://localhost:${port}`),
  );
}
