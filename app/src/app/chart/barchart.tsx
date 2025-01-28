"use client"

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { storeData , removeData, getData } from "../../../utils/localstorage";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChartComponent() {
  const [agreeCount, setAgreeCount] = useState(null);
  const [disagreeCount, setDisagreeCount] = useState(null);
  const [neutralCount, setNeutralCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAgree = getData("agree_percentages");
    const storedDisagree = getData("disagree_percentages");
    const storedNeutral = getData("netural_percentages");

    if (storedAgree !== null && storedDisagree !== null && storedNeutral !== null) {
      setAgreeCount(storedAgree);
      setDisagreeCount(storedDisagree);
      setNeutralCount(storedNeutral);
      setLoading(false); // Set loading to false once data is fetched
    }
  }, []);

  // If the data is still loading, show loading text
  if (loading) {
    return <p>Loading...</p>;
  }

  const rawData = [
    { month: "Agree", desktop: agreeCount },
    { month: "Disagree", desktop: disagreeCount },
    { month: "Neutral", desktop: neutralCount },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rawData.map((data) => (
            <div key={data.month} className="flex items-center space-x-2">
              {/* Label */}
              <div className="w-20 text-sm">{data.month}</div>
              {/* Bar Container */}
              <div className="relative flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                {/* Background bar (gray) */}
                <div
                  className="absolute inset-0 bg-gray-700"
                  style={{
                    width: "100%",
                  }}
                />
                {/* Foreground bar (black) */}
                <div
                  className="absolute inset-0 bg-white"
                  style={{
                    width: `${data.desktop}%`,
                  }}
                />
              </div>
              {/* Value */}
              <div className="w-12 text-sm text-right">{data.desktop}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
