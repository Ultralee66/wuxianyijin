export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold text-gray-900 mb-4">
            五险一金计算器
          </h1>
          <p className="text-xl text-gray-600">
            根据员工工资和城市社保标准，计算公司应缴纳的社保公积金费用
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Data Upload */}
          <a
            href="/upload"
            className="bg-white rounded-3xl shadow-xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100 block"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                数据上传
              </h2>
              <p className="text-gray-600 leading-relaxed">
                上传城市社保标准和员工工资数据，执行计算操作
              </p>
            </div>
          </a>

          {/* Card 2: Results */}
          <a
            href="/results"
            className="bg-white rounded-3xl shadow-xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100 block"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                结果查询
              </h2>
              <p className="text-gray-600 leading-relaxed">
                查看已计算完成的社保公积金缴纳结果
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
