"use client"
import { useState, useEffect } from "react";
import { storeData, removeData, getData } from "../../../utils/localstorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommentsOverview() {
  const [agreeCount, setAgreeCount] = useState(null);
  const [disagreeCount, setDisagreeCount] = useState(null);
  const [neutralCount, setNeutralCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAgree = getData("agree");
    const storedDisagree = getData("disagree");
    const storedNeutral = getData("netural");

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

  const totalComments = agreeCount + disagreeCount + neutralCount;

  const sentimentData = [
    { label: "Agree", count: agreeCount },
    { label: "Disagree", count: disagreeCount },
    { label: "Neutral", count: neutralCount },
  ];

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Total Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold text-center mb-6">{totalComments}</div>
        <div className="flex justify-around text-center">
          {sentimentData.map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-semibold">{item.count}</div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
