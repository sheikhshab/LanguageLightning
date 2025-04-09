// Vercel serverless entry point
import express from "express";
import { Server } from "http";
import { storage } from "../server/storage";
import { insertUserSchema, insertTransactionSchema } from "../shared/schema";
import { z } from "zod";

const app = express();
app.use(express.json());

// Login schema
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Update balance schema
const updateBalanceSchema = z.object({
  userId: z.number(),
  amount: z.string(),
});

// API routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    const existingPhone = await storage.getUserByPhone(userData.phoneNumber);
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
    
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
    
    const user = await storage.createUser(userData);
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: "Invalid input data", errors: error });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const user = await storage.getUserByUsername(credentials.username);
    
    if (!user || user.password !== credentials.password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: "Invalid input data", errors: error });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user" });
  }
});

app.post("/api/balance/update", async (req, res) => {
  try {
    const data = updateBalanceSchema.parse(req.body);
    const user = await storage.getUser(data.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const currentBalance = parseFloat(user.balance);
    const newAmount = parseFloat(data.amount);
    const updatedBalance = (currentBalance + newAmount).toFixed(2);
    
    const updatedUser = await storage.updateUser(data.userId, {
      balance: updatedBalance,
    });
    
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update balance" });
    }
    
    res.status(200).json({ balance: updatedUser.balance });
  } catch (error) {
    res.status(400).json({ message: "Invalid input data", errors: error });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const transactionData = insertTransactionSchema.parse(req.body);
    const user = await storage.getUser(transactionData.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const transactionAmount = parseFloat(transactionData.amount);
    const feeAmount = (transactionAmount * 0.005).toFixed(2);
    transactionData.fee = feeAmount;
    
    const transaction = await storage.createTransaction(transactionData);
    
    let balanceChange = 0;
    if (transactionData.type === "receive") {
      balanceChange = transactionAmount - parseFloat(feeAmount);
    } else if (transactionData.type === "send") {
      balanceChange = -(transactionAmount + parseFloat(feeAmount));
    }
    
    const currentBalance = parseFloat(user.balance);
    const newBalance = (currentBalance + balanceChange).toFixed(2);
    
    await storage.updateUser(transactionData.userId, {
      balance: newBalance,
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Invalid input data", errors: error });
  }
});

app.get("/api/transactions/user/:userId", async (req, res) => {
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

app.post("/api/ussd/generate", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ message: "User ID and amount are required" });
    }
    
    const user = await storage.getUser(parseInt(userId));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const ussdCode = `*123*${Math.floor(100000 + Math.random() * 900000)}#`;
    
    res.status(200).json({
      ussdCode,
      amount,
      expiresIn: "5 minutes",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error generating USSD code" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Export the Express app as a serverless function
export default app;