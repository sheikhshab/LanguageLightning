import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <PaymentProvider>
      <App />
    </PaymentProvider>
  </AuthProvider>
);
