'use client';

import { useState, useEffect } from 'react';

interface PerformanceData {
  vehicleId: string;
  timestamp: string;
  totalEnergyConsumedAc: number;
  totalEnergyDeliveredDc: number;
  efficiencyRatio: number;
  averageBatteryTemp: number;
}

export default function Dashboard() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // In production (Docker), this URL should be configured via ENV.
      // For browser-side fetching, localhost:3000 works if ports are mapped.
      const res = await fetch('http://localhost:3000/v1/analytics/performance/vehicle-001');
      if (!res.ok) throw new Error('Failed to fetch data');
      const jsonData = await res.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      setError('Error connecting to backend');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error && !data) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Fleet Performance Monitor</h1>
          <p className="text-gray-600">Real-time telemetry for <span className="font-mono bg-gray-200 px-2 rounded">vehicle-001</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Efficiency Card */}
            <div className={`p-6 rounded-xl shadow-md border-l-4 ${
                (data?.efficiencyRatio || 0) < 0.85 ? 'bg-red-50 border-red-500' : 'bg-white border-green-500'
            }`}>
                <h3 className="text-sm font-medium text-gray-500 uppercase">Efficiency Ratio</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                    {data?.efficiencyRatio.toFixed(4)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Target: &gt; 0.90</p>
            </div>

            {/* AC Consumed Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase">AC Consumed (Grid)</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                    {data?.totalEnergyConsumedAc} <span className="text-lg font-normal text-gray-500">kWh</span>
                </p>
            </div>

            {/* DC Delivered Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase">DC Delivered (EV)</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                    {data?.totalEnergyDeliveredDc} <span className="text-lg font-normal text-gray-500">kWh</span>
                </p>
            </div>

            {/* Battery Temp Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Avg Battery Temp</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                    {data?.averageBatteryTemp} <span className="text-lg font-normal text-gray-500">°C</span>
                </p>
            </div>
        </div>

        <div className="mt-8 text-right text-xs text-gray-400">
            Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
