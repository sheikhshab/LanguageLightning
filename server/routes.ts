import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const updateBalanceSchema = z.object({
  userId: z.number(),
  amount: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with same phone number or username exists
      const existingPhone = await storage.getUserByPhone(userData.phoneNumber);
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error during registration" });
      }
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(credentials.username);
      
      if (!user || user.password !== credentials.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error during login" });
      }
    }
  });

  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching user" });
    }
  });

  // Balance route
  app.post("/api/balance/update", async (req: Request, res: Response) => {
    try {
      const data = updateBalanceSchema.parse(req.body);
      
      const user = await storage.getUser(data.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user balance
      const currentBalance = parseFloat(user.balance);
      const newAmount = parseFloat(data.amount);
      const updatedBalance = (currentBalance + newAmount).toFixed(2);
      
      const updatedUser = await storage.updateUser(data.userId, { 
        balance: updatedBalance 
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update balance" });
      }
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json({ balance: updatedUser.balance });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error updating balance" });
      }
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      const user = await storage.getUser(transactionData.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Calculate fee (0.5% for this example)
      const transactionAmount = parseFloat(transactionData.amount);
      const feeAmount = (transactionAmount * 0.005).toFixed(2);
      transactionData.fee = feeAmount;
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Update user balance based on transaction type
      let balanceChange = 0;
      
      if (transactionData.type === "receive") {
        balanceChange = transactionAmount - parseFloat(feeAmount);
      } else if (transactionData.type === "send") {
        balanceChange = -(transactionAmount + parseFloat(feeAmount));
      }
      
      const currentBalance = parseFloat(user.balance);
      const newBalance = (currentBalance + balanceChange).toFixed(2);
      
      await storage.updateUser(transactionData.userId, {
        balance: newBalance
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error creating transaction" });
      }
    }
  });

  app.get("/api/transactions/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const transactions = await storage.getUserTransactions(userId);
      
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching transactions" });
    }
  });

  // USSD code generation (simulated)
  app.post("/api/ussd/generate", async (req: Request, res: Response) => {
    try {
      const { userId, amount } = req.body;
      
      if (!userId || !amount) {
        return res.status(400).json({ message: "User ID and amount are required" });
      }
      
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate a random USSD code
      const ussdCode = `*123*${Math.floor(100000 + Math.random() * 900000)}#`;
      
      res.status(200).json({ 
        ussdCode, 
        amount, 
        expiresIn: "5 minutes" 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error generating USSD code" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
