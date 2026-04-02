"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setData(data || []);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase Test</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}