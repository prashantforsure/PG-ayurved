'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: {
    id: string;
    user: { name: string; email: string };
    course: { title: string };
    enrolledAt: string;
  }[];
  popularCourses: {
    id: string;
    title: string;
    enrollments: number;
  }[];
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.isAdmin) {
      fetchDashboardData();
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get<DashboardData>('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  if (status === 'loading' || !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">Access Denied</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen mt-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button
          onClick={() => router.push('/admin/courses/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader className="bg-white border-b border-gray-300">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData.totalUsers}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader className="bg-white border-b border-gray-300">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData.totalCourses}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader className="bg-white border-b border-gray-300">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Total Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData.totalEnrollments}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader className="bg-white border-b border-gray-300">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <p className="text-3xl font-bold text-gray-900">
              ${dashboardData.totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader className="bg-white border-b border-gray-300">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Recent Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <ul className="space-y-4">
              {dashboardData.recentEnrollments.map((enrollment) => (
                <li
                  key={enrollment.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 shadow-md"
                >
                  <p className="font-semibold text-gray-900">
                    {enrollment.user.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    enrolled in {enrollment.course.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(enrollment.enrolledAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader className="bg-white border-b border-gray-300">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Popular Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.popularCourses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/admin/courses')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Manage Courses
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;