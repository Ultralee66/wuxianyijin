# 五险一金计算器

根据员工工资数据和城市社保标准，计算公司为每位员工应缴纳的社保公积金费用。

![技术栈](https://img.shields.io/badge/Next.js-15-black)
![技术栈](https://img.shields.io/badge/React-19-blue)
![技术栈](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![技术栈](https://img.shields.io/badge/Supabase-3ecf8e)
![许可证](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

- 📊 **Excel 数据上传** - 支持上传城市社保标准（cities.xlsx）和员工工资数据（salaries.xlsx）
- 🧮 **自动计算** - 根据平均工资和城市标准自动计算缴费基数和公司缴纳金额
- 📋 **结果展示** - 清晰展示计算结果，支持删除单条记录
- 🎨 **苹果风格设计** - 简洁现代的 UI，大量留白，柔和阴影
- 🔄 **数据覆盖逻辑** - 同年份数据自动覆盖，新年份数据自动追加

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | Next.js 15 (App Router) |
| **UI 库** | React 19 |
| **样式** | Tailwind CSS |
| **数据库** | Supabase (PostgreSQL) |
| **Excel 处理** | xlsx |
| **语言** | TypeScript |

## 📁 数据库设计

### cities（城市社保标准表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| city_name | TEXT | 城市名（如：佛山） |
| year | TEXT | 年份（如：2024） |
| base_min | INTEGER | 社保基数下限 |
| base_max | INTEGER | 社保基数上限 |
| rate | FLOAT | 综合缴纳比例（如：0.14） |

### salaries（员工工资表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| employee_id | TEXT | 员工工号 |
| employee_name | TEXT | 员工姓名 |
| month | TEXT | 年份月份 (YYYYMM) |
| salary_amount | INTEGER | 该月工资金额 |

### results（计算结果表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| employee_name | TEXT | 员工姓名 |
| avg_salary | FLOAT | 平均工资 |
| contribution_base | FLOAT | 缴费基数 |
| company_fee | FLOAT | 公司缴纳金额 |
| calculation_year | TEXT | 计算年份 |
| calculation_month | TEXT | 计算月份范围 |
| city_name | TEXT | 计算城市 |
| created_at | TIMESTAMP | 计算时间 |

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Ultralee66/wuxianyijin.git
cd wuxianyijin
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入您的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 创建数据库表

在 Supabase SQL Editor 中执行：

```sql
-- cities 表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);

-- salaries 表
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);

-- results 表
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  calculation_year TEXT,
  calculation_month TEXT,
  city_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📖 使用说明

### 主页

- **数据上传** - 点击进入数据上传页
- **结果查询** - 查看所有计算结果

### 上传页

1. 上传 `cities.xlsx` 文件（城市社保标准）
2. 上传 `salaries.xlsx` 文件（员工工资数据）
3. 设置计算参数（年份、月份范围、城市）
4. 点击"执行计算并存储结果"

### 计算逻辑

```
输入参数：year, monthRange, city

1. 筛选 salaries 数据（按年份/月份）
2. 按员工分组计算平均工资
3. 获取城市标准（base_min, base_max, rate）
4. 确定缴费基数：
   - 低于下限 → 使用下限
   - 高于上限 → 使用上限
   - 在中间 → 使用平均值
5. 计算公司缴纳额 = 缴费基数 × rate
6. 存入 results 表
```

## 📂 项目结构

```
wuxianyijin/
├── app/
│   ├── api/              # API 路由
│   │   ├── calculate/    # 计算功能
│   │   ├── results/      # 结果查询
│   │   └── upload/       # 数据上传
│   ├── layout.tsx        # 全局布局
│   ├── page.tsx          # 主页
│   ├── results/page.tsx  # 结果页
│   └── upload/page.tsx   # 上传页
├── lib/
│   ├── calculate.ts      # 核心计算逻辑
│   └── supabase.ts       # Supabase 客户端
├── types/
│   └── database.ts       # TypeScript 类型定义
└── public/               # 静态资源
```

## 🎨 设计风格

项目采用苹果官网风格设计：

- 🎨 简洁现代，大量留白
- 🔲 卡片式布局，圆角设计
- 💨 柔和阴影效果
- ✨ Hover 动效
- 📱 响应式布局，支持移动端

## 🌐 部署

### Vercel 部署

1. 将项目推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择 GitHub 仓库
5. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. 点击 "Deploy"

## 📝 待办事项

- [ ] 支持多城市同时计算
- [ ] 添加数据导出功能
- [ ] 支持批量计算历史管理
- [ ] 添加数据可视化图表
- [ ] 用户认证功能

## 📄 许可证

MIT License

## 👤 作者

[Ultralee66](https://github.com/Ultralee66)

---

**享受使用！如有问题，欢迎提 Issue。** 🎉
