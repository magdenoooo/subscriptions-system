'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSubscriptionStore } from '@/store/subscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export function ExpenseChart() {
  const { getCategorySummary, subscriptions } = useSubscriptionStore();
  const categorySummary = getCategorySummary();

  // Mock monthly data for the area chart
  const monthlyData = [
    { month: 'يناير', expense: 280 },
    { month: 'فبراير', expense: 320 },
    { month: 'مارس', expense: 290 },
    { month: 'أبريل', expense: 340 },
    { month: 'مايو', expense: 380 },
    { month: 'يونيو', expense: 420 },
  ];

  // Prepare pie chart data
  const pieData = Object.entries(categorySummary).map(([category, data]) => ({
    name: category,
    value: data.total,
    count: data.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>تحليل المصروفات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trend" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trend">الاتجاه الشهري</TabsTrigger>
              <TabsTrigger value="categories">التوزيع حسب الفئة</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trend" className="mt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      className="text-sm"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-sm"
                      tickFormatter={(value) => `${value} ريال`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`${value} ريال`, 'المصروف']}
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#6366F1"
                      strokeWidth={2}
                      fill="url(#colorExpense)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value.toFixed(2)} ريال`, 'المبلغ']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">التوزيع حسب الفئات</h3>
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({item.count} اشتراك)
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        {item.value.toFixed(2)} ريال
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}