// Vercel serverless entry point
import express from "express";
import { registerRoutes } from "../server/routes";

// Initialize Express app
const app = express();

// Setup middleware
app.use(express.json());

// Register API routes
registerRoutes(app).catch(console.error);

// Export the Express app as a serverless function
export default app;