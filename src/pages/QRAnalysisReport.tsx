import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const QRAnalysisReport: React.FC = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData;

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">No analysis data available. Please try again.</p>
      </div>
    );
  }

  const {
    qr_id,
    user_id,
    url,
    image,
    first_submission_date,
    last_analysis_date,
    reputation,
    total_malicious_votes,
    total_harmless_votes,
    malicious,
    suspicious,
    harmless,
    security_score,
    risk_level,
    created_on,
    updated_on,
  } = analysisData;

  const pieData = {
    labels: ['Malicious', 'Suspicious', 'Harmless'],
    datasets: [
      {
        data: [malicious, suspicious, harmless],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
      },
    ],
  };

  const barData = {
    labels: ['Reputation', 'Security Score'],
    datasets: [
      {
        label: 'Scores',
        data: [reputation, security_score],
        backgroundColor: ['#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <>
      <Navbar isLoggedIn />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>QR Deep Analysis Report</CardTitle>
              <CardDescription>
                Detailed analysis of the scanned QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">QR Code Image</h3>
                <div className="border rounded-md overflow-hidden max-w-xs">
                  <img src={image} alt="QR Code" className="w-full" />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Analysis Details</h3>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li><strong>QR ID:</strong> {qr_id}</li>
                  <li><strong>User ID:</strong> {user_id}</li>
                  <li><strong>URL:</strong> <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{url}</a></li>
                  <li><strong>First Submission Date:</strong> {new Date(first_submission_date).toLocaleString()}</li>
                  <li><strong>Last Analysis Date:</strong> {new Date(last_analysis_date).toLocaleString()}</li>
                  <li><strong>Reputation:</strong> {reputation}</li>
                  <li><strong>Total Malicious Votes:</strong> {total_malicious_votes}</li>
                  <li><strong>Total Harmless Votes:</strong> {total_harmless_votes}</li>
                  <li><strong>Malicious:</strong> {malicious}%</li>
                  <li><strong>Suspicious:</strong> {suspicious}%</li>
                  <li><strong>Harmless:</strong> {harmless}%</li>
                  <li><strong>Security Score:</strong> {security_score}</li>
                  <li><strong>Risk Level:</strong> {risk_level}</li>
                  <li><strong>Created On:</strong> {new Date(created_on).toLocaleString()}</li>
                  <li><strong>Updated On:</strong> {new Date(updated_on).toLocaleString()}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Charts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium mb-2">Malicious vs Suspicious vs Harmless</h4>
                    <Pie data={pieData} />
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-2">Reputation and Security Score</h4>
                    <Bar data={barData} />
                  </div>
                </div>
              </div>

              <Button variant="secondary" onClick={() => window.history.back()} className="w-full">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default QRAnalysisReport;