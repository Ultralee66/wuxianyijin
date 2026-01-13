'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Result } from '@/types/database';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/results');
      const result = await response.json();

      if (result.success) {
        setResults(result.data);
      } else {
        showMessage('error', result.message);
      }
    } catch (error: any) {
      showMessage('error', `Failed to fetch results: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    try {
      const response = await fetch(`/api/results/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', '删除成功');
        fetchResults(); // Refresh the list
      } else {
        showMessage('error', result.message);
      }
    } catch (error: any) {
      showMessage('error', `Delete failed: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">计算结果</h1>
          <p className="text-lg text-gray-600">查看所有社保公积金缴纳计算结果</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-600">加载中...</div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              暂无计算结果，请先前往上传页上传数据并执行计算
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      员工姓名
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      平均工资
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      缴费基数
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      公司缴纳金额
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      计算条件
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      计算时间
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr
                      key={result.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatCurrency(result.avg_salary)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatCurrency(result.contribution_base)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {formatCurrency(result.company_fee)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>
                          <div>{result.city_name}</div>
                          <div className="text-xs text-gray-500">
                            {result.calculation_year}
                            {result.calculation_month && ` (${result.calculation_month})`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(result.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
