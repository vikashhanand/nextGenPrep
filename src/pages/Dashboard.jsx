import React, { useState, useRef, useEffect, useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Target, Clock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { Navigate } from 'react-router-dom';

const defaultChartData = [
  { name: 'Initial', score: 0, accuracy: 0 },
];

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5001/api/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if(Array.isArray(data)) setTests(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Derived Statistics
  const totalTests = tests.length;
  const avgScore = totalTests ? (tests.reduce((acc, t) => acc + (t.score / t.total) * 100, 0) / totalTests).toFixed(1) : 0;
  const avgAccuracy = totalTests ? (tests.reduce((acc, t) => acc + t.accuracy, 0) / totalTests).toFixed(1) : 0;
  
  // Transform for recharts
  const chartData = tests.length > 0 
    ? [...tests].reverse().map((t, i) => ({
        name: `T${i+1}`,
        score: t.score,
        accuracy: t.accuracy
      }))
    : defaultChartData;

  return (
    <div className="container animate-slide-up flex flex-col pt-8">
      <h1 className="text-4xl mb-2 font-black">{user.name}'s Dashboard</h1>
      <p className="text-muted mb-8 text-lg">Track your test history, view report cards, and gain improvement insights.</p>

      {/* High-level stats */}
      <div className="grid grid-cols-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary"><Award size={24} /></div>
          <div><p className="text-muted text-sm">Avg Score</p><p className="text-2xl font-bold">{avgScore}%</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full" style={{ color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}><Target size={24} /></div>
          <div><p className="text-muted text-sm">Accuracy</p><p className="text-2xl font-bold">{avgAccuracy}%</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full" style={{ color: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)' }}><Clock size={24} /></div>
          <div><p className="text-muted text-sm">Tests Taken</p><p className="text-2xl font-bold">{totalTests}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full" style={{ color: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}><AlertCircle size={24} /></div>
          <div><p className="text-muted text-sm">Weakest Link</p><p className="text-lg font-bold truncate">Polity focus needed</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Progress Chart */}
        <div className="card" style={{ height: '400px' }}>
          <h2 className="card-title mb-4">Performance Timeline (Score vs Accuracy)</h2>
          {loading ? (
            <p className="text-muted text-center pt-24">Loading chart data...</p>
          ) : (
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                <Area type="monotone" dataKey="accuracy" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* History Table */}
        <div className="card" style={{ height: '400px', overflowY: 'auto' }}>
          <h2 className="card-title mb-4">Recent Tests & Reports</h2>
          <div className="flex flex-col gap-4">
            {loading ? (
              <p className="text-muted">Loading history...</p>
            ) : tests.length === 0 ? (
              <p className="text-muted text-center py-12">No test history yet. Take a mock test!</p>
            ) : (
              tests.map(test => (
                <div key={test.id} className="p-4 border rounded-lg flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h4 className="font-bold">{test.subject}</h4>
                    <p className="text-sm text-muted">{test.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{test.score}/{test.total}</p>
                    <p className="text-sm text-muted">Accuracy: {test.accuracy}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
