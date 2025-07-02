'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsCards() {
  const {
    subscriptions,
    getTotalMonthlyExpense,
    getUpcomingRenewals,
  } = useSubscriptionStore();

  const totalSubscriptions = subscriptions.filter(sub => sub.isActive).length;
  const totalMonthlyExpense = getTotalMonthlyExpense();
  const upcomingRenewals = getUpcomingRenewals(7);
  const yearlyExpense = totalMonthlyExpense * 12;

  const stats = [
    {
      title: 'إجمالي الاشتراكات',
      value: totalSubscriptions.toString(),
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'المصروف الشهري',
      value: `${totalMonthlyExpense.toFixed(2)} ريال`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+8%',
    },
    {
      title: 'المصروف السنوي',
      value: `${yearlyExpense.toFixed(2)} ريال`,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
    },
    {
      title: 'التجديدات القادمة',
      value: upcomingRenewals.length.toString(),
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      change: `${upcomingRenewals.length} خلال 7 أيام`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
              
              {/* Background decoration */}
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-r opacity-10 ${stat.color}" />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}