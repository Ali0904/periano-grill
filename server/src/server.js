import "dotenv/config";
import { connectDB } from "./db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
});

export default app;
