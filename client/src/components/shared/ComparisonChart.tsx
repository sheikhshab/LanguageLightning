import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, CircleDot } from "lucide-react";

interface ComparisonFeature {
  name: string;
  circular: boolean;
  posMachines: boolean;
  mobileApps: boolean;
}

const features: ComparisonFeature[] = [
  { name: "No POS hardware required", circular: true, posMachines: false, mobileApps: true },
  { name: "Works offline", circular: true, posMachines: false, mobileApps: false },
  { name: "Low transaction fees", circular: true, posMachines: false, mobileApps: false },
  { name: "Phone-to-phone payments", circular: true, posMachines: false, mobileApps: true },
  { name: "Minimal setup time", circular: true, posMachines: false, mobileApps: true },
  { name: "No monthly subscription", circular: true, posMachines: false, mobileApps: true },
];

export const ComparisonChart: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Circular vs. Competitors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-medium px-2 py-1">Feature</th>
                <th className="text-center font-medium px-2 py-1 bg-green-50 text-green-700">
                  Circular
                </th>
                <th className="text-center font-medium px-2 py-1 bg-neutral-50">
                  POS Machines
                </th>
                <th className="text-center font-medium px-2 py-1 bg-neutral-50">
                  Other Apps
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-neutral-50/50" : ""}>
                  <td className="px-2 py-2">{feature.name}</td>
                  <td className="text-center px-2 py-2 bg-green-50/50">
                    {feature.circular ? (
                      <CheckCircle className="h-5 w-5 text-green-600 inline" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 inline" />
                    )}
                  </td>
                  <td className="text-center px-2 py-2">
                    {feature.posMachines ? (
                      <CheckCircle className="h-5 w-5 text-green-600 inline" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 inline" />
                    )}
                  </td>
                  <td className="text-center px-2 py-2">
                    {feature.mobileApps ? (
                      <CheckCircle className="h-5 w-5 text-green-600 inline" />
                    ) : (
                      <CircleDot className="h-5 w-5 text-amber-400 inline" />
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50">
                <td className="px-2 py-2 font-medium">Transaction Fee</td>
                <td className="text-center px-2 py-2 font-medium text-green-700">0.5%</td>
                <td className="text-center px-2 py-2 text-red-700">2.5-3.5%</td>
                <td className="text-center px-2 py-2 text-amber-700">1.5-2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonChart;
