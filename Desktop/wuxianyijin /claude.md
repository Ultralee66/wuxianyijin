# 五险一金计算器 - 项目上下文管理中枢

> 本文件是整个项目的"上下文管理中枢"，包含项目目标、技术栈、数据结构、核心逻辑和开发任务清单。
> **任何开发工作前都应参考此文件，确保不偏离方向。**

---

## 📋 项目概述

### 项目目标
构建一个迷你的"五险一金"计算器 Web 应用，根据预设的员工工资数据和城市社保标准，计算公司为每位员工应缴纳的社保公积金费用。

### 设计风格
参考苹果官网风格：简洁、现代、大量留白、卡片式设计、柔和阴影

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js (App Router) |
| UI/样式 | Tailwind CSS |
| 数据库/后端 | Supabase (PostgreSQL) |
| Excel 处理 | xlsx 库 |
| 部署 | Vercel (推荐) |

---

## 🗄 数据库设计 (Supabase)

### 表结构

#### 1. cities (城市社保标准表)
```sql
CREATE TABLE cities (
  id INTEGER PRIMARY KEY,
  city_name TEXT NOT NULL,           -- 城市名（如：佛山）
  year TEXT NOT NULL,                 -- 年份（如：2024）
  base_min INTEGER NOT NULL,          -- 社保基数下限
  base_max INTEGER NOT NULL,          -- 社保基数上限
  rate FLOAT NOT NULL                 -- 综合缴纳比例（如：0.14）
);
```

#### 2. salaries (员工工资表)
```sql
CREATE TABLE salaries (
  id INTEGER PRIMARY KEY,
  employee_id TEXT NOT NULL,          -- 员工工号
  employee_name TEXT NOT NULL,        -- 员工姓名
  month TEXT NOT NULL,                -- 年份月份 (YYYYMM)
  salary_amount INTEGER NOT NULL      -- 该月工资金额
);
```

#### 3. results (计算结果表)
```sql
CREATE TABLE results (
  id INTEGER PRIMARY KEY,
  employee_name TEXT NOT NULL,        -- 员工姓名
  avg_salary FLOAT NOT NULL,          -- 所选月份的平均工资
  contribution_base FLOAT NOT NULL,   -- 最终缴费基数
  company_fee FLOAT NOT NULL,         -- 公司缴纳金额
  calculation_year TEXT,              -- 计算年份（筛选条件记录）
  calculation_month TEXT,             -- 计算月份范围（筛选条件记录）
  city_name TEXT,                     -- 计算城市
  created_at TIMESTAMP DEFAULT NOW()  -- 计算时间
);
```

---

## 🔄 核心业务逻辑

### 计算函数执行流程

```
┌─────────────────────────────────────────────────────────────┐
│                    社保公积金计算流程                          │
└─────────────────────────────────────────────────────────────┘

输入参数：year（年份）, monthRange（月份范围，可选）, city（城市）

步骤 1: 数据筛选
   └─ 从 salaries 表筛选符合条件的数据
       - year = "2024" 时，筛选 month LIKE "2024%"
       - monthRange = "01-06" 时，筛选 month BETWEEN "202401" AND "202406"

步骤 2: 分组计算平均工资
   └─ 按 employee_name 分组，计算每位员工的平均工资
       avg_salary = SUM(salary_amount) / COUNT(month)

步骤 3: 获取城市标准
   └─ 从 cities 表获取指定城市的 year、base_min、base_max、rate
       例如：佛山 2024 → base_min=4546, base_max=26421, rate=0.14

步骤 4: 确定缴费基数
   └─ 对每位员工比较 avg_salary 与基数上下限：
       IF avg_salary < base_min THEN contribution_base = base_min
       ELSE IF avg_salary > base_max THEN contribution_base = base_max
       ELSE contribution_base = avg_salary

步骤 5: 计算公司缴纳额
   └─ company_fee = contribution_base * rate

步骤 6: 存储结果
   └─ 将计算结果存入 results 表（包含筛选条件记录）
```

### 数据追加/覆盖逻辑

| 场景 | 操作 |
|------|------|
| 上传新年份数据（如 2025） | 追加到现有数据 |
| 重新上传已有年份数据（如 2024） | 覆盖该年份的旧数据（先 DELETE 再 INSERT） |
| 判断依据 | year 字段（从 month 字段提取前4位） |

---

## 🎨 前端页面设计

### 页面结构

```
/ (主页)
├── 布局：居中容器，苹果风格
├── 两个功能卡片：
│   ├── 卡片1：数据上传 → /upload
│   └── 卡片2：结果查询 → /results
└── 样式：圆角、柔和阴影、hover 放大效果

/upload (数据上传页)
├── 文件上传区域（支持拖拽）
│   ├── cities.xlsx 上传
│   └── salaries.xlsx 上传
├── 筛选设置
│   ├── 年份选择（下拉）
│   ├── 月份范围选择（可选）
│   └── 城市选择（下拉）
├── 操作按钮
│   ├── 上传数据按钮
│   └── 执行计算按钮
└── 状态提示（成功/失败）

/results (结果展示页)
├── 筛选器（可选）
│   └── 按计算时间/年份/城市筛选
├── 数据表格
│   ├── 员工姓名
│   ├── 平均工资
│   ├── 缴费基数
│   ├── 公司缴纳金额
│   └── 操作（删除）
└── 样式：简洁表格，斑马纹，hover 高亮
```

### 设计风格参考（苹果风格）

```css
/* 设计关键词 */
- 大量留白
- 卡片圆角: rounded-2xl 或 rounded-3xl
- 柔和阴影: shadow-lg, shadow-xl
- 中性色调: gray-50 ~ gray-900
- 交互反馈: hover:scale-105, transition-all
- 排版: SF Pro Display 风格
```

---

## ✅ 开发任务清单 (TodoList)

### Phase 1: 环境搭建与项目初始化
- [ ] 1.1 创建 Next.js 项目 (`npx create-next-app@latest`)
- [ ] 1.2 安装依赖：Tailwind CSS、Supabase Client、xlsx
- [ ] 1.3 配置 Tailwind CSS（启用苹果风格设计系统）
- [ ] 1.4 创建 Supabase 项目，获取 API URL 和 Key
- [ ] 1.5 配置环境变量（.env.local）
- [ ] 1.6 在 Supabase 中创建三张数据表（cities、salaries、results）

### Phase 2: 基础架构搭建
- [ ] 2.1 创建 Supabase 客户端实例 (`lib/supabase.ts`)
- [ ] 2.2 创建类型定义文件 (`types/database.ts`)
- [ ] 2.3 设置 App Router 目录结构
- [ ] 2.4 创建全局布局和导航组件（可选）

### Phase 3: 主页开发 (/)
- [ ] 3.1 创建首页组件 (`app/page.tsx`)
- [ ] 3.2 实现功能卡片组件
- [ ] 3.3 应用苹果风格样式（圆角、阴影、hover 效果）
- [ ] 3.4 添加响应式布局（移动端适配）

### Phase 4: 数据上传页开发 (/upload)
- [ ] 4.1 创建上传页组件 (`app/upload/page.tsx`)
- [ ] 4.2 实现文件上传组件（支持拖拽）
- [ ] 4.3 创建年份/月份/城市筛选器
- [ ] 4.4 实现 Excel 解析逻辑（处理 city_namte 拼写错误）
- [ ] 4.5 实现 cities 表数据上传 API
- [ ] 4.6 实现 salaries 表数据上传 API
- [ ] 4.7 实现数据追加/覆盖逻辑
- [ ] 4.8 添加上传进度和状态提示

### Phase 5: 核心计算功能
- [ ] 5.1 创建计算函数 (`lib/calculate.ts`)
- [ ] 5.2 实现数据筛选逻辑（按年份/月份）
- [ ] 5.3 实现员工分组和平均工资计算
- [ ] 5.4 实现缴费基数确定逻辑
- [ ] 5.5 实现公司缴纳额计算
- [ ] 5.6 实现结果存储到 results 表
- [ ] 5.7 创建计算 API 路由 (`app/api/calculate/route.ts`)
- [ ] 5.8 在上传页集成计算按钮

### Phase 6: 结果展示页开发 (/results)
- [ ] 6.1 创建结果页组件 (`app/results/page.tsx`)
- [ ] 6.2 实现数据获取逻辑（从 results 表）
- [ ] 6.3 创建结果表格组件
- [ ] 6.4 应用 Tailwind 表格样式
- [ ] 6.5 添加删除单条记录功能
- [ ] 6.6 实现筛选功能（可选）
- [ ] 6.7 添加空状态提示

### Phase 7: 测试与优化
- [ ] 7.1 使用现有测试数据（cities.xlsx、salaries.xlsx）测试完整流程
- [ ] 7.2 测试数据追加/覆盖逻辑
- [ ] 7.3 测试筛选功能（年份、月份范围）
- [ ] 7.4 测试边界情况（空数据、异常值）
- [ ] 7.5 优化错误处理和用户提示
- [ ] 7.6 性能优化（数据加载、计算速度）

### Phase 8: 部署
- [ ] 8.1 配置 Vercel 部署
- [ ] 8.2 设置生产环境变量
- [ ] 8.3 部署到生产环境
- [ ] 8.4 最终测试

---

## 📝 重要注意事项

### Excel 数据处理
```javascript
// cities.xlsx 列名映射（处理拼写错误）
const columnMapping = {
  'city_namte ': 'city_name',  // 注意末尾空格
  'year': 'year',
  'rate': 'rate',
  'base_min': 'base_min',
  'base_max': 'base_max'
};
```

### 计算逻辑关键点
1. **年份筛选**: 从 month 字段提取前 4 位
2. **月份范围**: 支持 01-06 格式，转换为 BETWEEN 查询
3. **基数判断**: 三段式逻辑（低于下限、高于上限、中间值）
4. **结果存储**: 包含计算时的筛选条件记录

### 设计实现建议
```javascript
// 苹果风格卡片样式示例
const cardStyle = `
  bg-white rounded-3xl shadow-xl p-8
  hover:scale-105 transition-all duration-300
  cursor-pointer border border-gray-100
`;
```

---

## 📊 数据示例

### cities 表当前数据
| id | city_name | year | rate | base_min | base_max |
|----|-----------|------|------|----------|----------|
| 1  | 佛山      | 2024 | 0.14 | 4546     | 26421    |

### salaries 表当前数据
- 员工：张三、李四、王五
- 月份：202401 - 202412（完整12个月）
- 每人12条工资记录

### 计算示例（张三）
- 平均工资：假设 30000
- 缴费基数：26421（超过上限，用上限）
- 公司缴纳：26421 × 0.14 = 3698.94

---

## 🔐 环境变量模板

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📚 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [xlsx 库文档](https://www.npmjs.com/package/xlsx)
- [苹果官网设计参考](https://www.apple.com)

---

**最后更新**: 2026-01-12
**项目状态**: 待开发
