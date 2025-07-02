'use client';

import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useSubscriptionStore } from '@/store/subscriptions';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { SubscriptionFilters } from '@/components/dashboard/subscription-filters';
import { SubscriptionCard } from '@/components/dashboard/subscription-card';

export default function Dashboard() {
  const {
    getFilteredSubscriptions,
    toggleSubscriptionStatus,
    deleteSubscription,
  } = useSubscriptionStore();

  const filteredSubscriptions = getFilteredSubscriptions();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-2">
              إدارة وتتبع جميع اشتراكاتك في مكان واحد
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-2 space-x-reverse"
          >
            <Button asChild>
              <Link href="/add-subscription">
                <Plus className="ml-2 h-4 w-4" />
                إضافة اشتراك
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Expense Chart */}
        <div className="mb-8">
          <ExpenseChart />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <SubscriptionFilters />
        </div>

        {/* Subscriptions Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              اشتراكاتك ({filteredSubscriptions.length})
            </h2>
            {filteredSubscriptions.length === 0 && (
              <div className="flex items-center text-muted-foreground">
                <Users className="ml-2 h-4 w-4" />
                لا توجد اشتراكات
              </div>
            )}
          </div>

          {filteredSubscriptions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubscriptions.map((subscription, index) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onToggleStatus={toggleSubscriptionStatus}
                  onDelete={deleteSubscription}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-muted">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">لا توجد اشتراكات بعد</h3>
                <p className="text-muted-foreground max-w-sm">
                  ابدأ بإضافة اشتراكك الأول لتتبع مصروفاتك الشهرية
                </p>
                <Button asChild>
                  <Link href="/add-subscription">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة اشتراك جديد
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}