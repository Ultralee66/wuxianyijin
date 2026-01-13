'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UploadPage() {
  const [citiesFile, setCitiesFile] = useState<File | null>(null);
  const [salariesFile, setSalariesFile] = useState<File | null>(null);
  const [year, setYear] = useState('2024');
  const [monthRange, setMonthRange] = useState('');
  const [city, setCity] = useState('佛山');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpload = async (type: 'cities' | 'salaries') => {
    const file = type === 'cities' ? citiesFile : salariesFile;
    if (!file) {
      showMessage('error', `Please select ${type}.xlsx file first`);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', result.message);
        // Clear the uploaded file
        if (type === 'cities') setCitiesFile(null);
        else setSalariesFile(null);
      } else {
        showMessage('error', result.message);
      }
    } catch (error: any) {
      showMessage('error', `Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          monthRange: monthRange || undefined,
          city,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', result.message);
      } else {
        showMessage('error', result.message);
      }
    } catch (error: any) {
      showMessage('error', `Calculation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
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
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">数据上传</h1>
          <p className="text-lg text-gray-600">上传数据并执行计算</p>
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

        {/* Upload Section */}
        <div className="space-y-6">
          {/* Cities Upload */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">城市社保标准</h2>
            <p className="text-gray-600 mb-6">上传 cities.xlsx 文件</p>
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                    citiesFile
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {citiesFile ? (
                    <span className="text-blue-600 font-medium">{citiesFile.name}</span>
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-gray-600">点击选择文件或拖拽到此处</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={(e) => setCitiesFile(e.target.files?.[0] || null)}
                  />
                </div>
              </label>
              <button
                onClick={() => handleUpload('cities')}
                disabled={!citiesFile || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                上传
              </button>
            </div>
          </div>

          {/* Salaries Upload */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">员工工资数据</h2>
            <p className="text-gray-600 mb-6">上传 salaries.xlsx 文件</p>
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                    salariesFile
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {salariesFile ? (
                    <span className="text-blue-600 font-medium">{salariesFile.name}</span>
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-gray-600">点击选择文件或拖拽到此处</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={(e) => setSalariesFile(e.target.files?.[0] || null)}
                  />
                </div>
              </label>
              <button
                onClick={() => handleUpload('salaries')}
                disabled={!salariesFile || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                上传
              </button>
            </div>
          </div>

          {/* Calculation Settings */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">计算设置</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年份 *
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月份范围（可选）
                </label>
                <input
                  type="text"
                  value={monthRange}
                  onChange={(e) => setMonthRange(e.target.value)}
                  placeholder="01-06"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  城市 *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="佛山"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {loading ? '处理中...' : '执行计算并存储结果'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
