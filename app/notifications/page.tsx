'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Bell,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscriptions';
import { PageTransition } from '@/components/ui/page-transition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Notifications() {
  const { subscriptions, getUpcomingRenewals } = useSubscriptionStore();

  const upcomingRenewals = getUpcomingRenewals(30); // Next 30 days
  const urgentRenewals = getUpcomingRenewals(7); // Next 7 days
  const todayRenewals = getUpcomingRenewals(0); // Today

  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getNotificationIcon = (days: number) => {
    if (days < 0) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (days === 0) return <Bell className="h-4 w-4 text-orange-500" />;
    if (days <= 3) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Calendar className="h-4 w-4 text-blue-500" />;
  };

  const getNotificationColor = (days: number) => {
    if (days < 0) return 'destructive';
    if (days === 0) return 'destructive';
    if (days <= 3) return 'default';
    return 'secondary';
  };

  const getNotificationText = (days: number) => {
    if (days < 0) return `متأخر ${Math.abs(days)} يوم`;
    if (days === 0) return 'ينتهي اليوم';
    if (days === 1) return 'ينتهي غداً';
    return `${days} أيام متبقية`;
  };

  const notificationStats = [
    {
      title: 'التنبيهات العاجلة',
      value: urgentRenewals.length,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      description: 'خلال 7 أيام',
    },
    {
      title: 'التجديدات القادمة',
      value: upcomingRenewals.length,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      description: 'خلال 30 يوم',
    },
    {
      title: 'التجديدات اليوم',
      value: todayRenewals.length,
      icon: Bell,
      color: 'from-orange-500 to-orange-600',
      description: 'تحتاج انتباه',
    },
    {
      title: 'إجمالي الاشتراكات',
      value: subscriptions.filter(sub => sub.isActive).length,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      description: 'نشطة',
    },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">التنبيهات والإشعارات</h1>
          <p className="text-muted-foreground mt-2">
            تابع مواعيد تجديد اشتراكاتك ولا تفوت أي دفعة
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {notificationStats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
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
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Notifications Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل التنبيهات</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="urgent" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="urgent" className="relative">
                    عاجل
                    {urgentRenewals.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {urgentRenewals.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">قادمة</TabsTrigger>
                  <TabsTrigger value="all">الكل</TabsTrigger>
                </TabsList>

                <TabsContent value="urgent" className="mt-6">
                  <div className="space-y-4">
                    {urgentRenewals.length > 0 ? (
                      urgentRenewals.map((subscription, index) => {
                        const days = getDaysUntilRenewal(subscription.renewalDate);
                        
                        return (
                          <motion.div
                            key={subscription.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="border-l-4 border-l-red-500">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 space-x-reverse">
                                    <div
                                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                      style={{ backgroundColor: subscription.color }}
                                    >
                                      {subscription.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">{subscription.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {subscription.price} {subscription.currency} - {subscription.category}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    {getNotificationIcon(days)}
                                    <Badge variant={getNotificationColor(days)}>
                                      {getNotificationText(days)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="ml-2 h-4 w-4" />
                                    <span>
                                      {format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: ar })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <CreditCard className="ml-2 h-4 w-4" />
                                    <span>{subscription.paymentMethod}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">لا توجد تنبيهات عاجلة</h3>
                        <p className="text-muted-foreground">
                          جميع اشتراكاتك محدثة، لا توجد تجديدات عاجلة
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upcoming" className="mt-6">
                  <div className="space-y-4">
                    {upcomingRenewals.length > 0 ? (
                      upcomingRenewals.map((subscription, index) => {
                        const days = getDaysUntilRenewal(subscription.renewalDate);
                        
                        return (
                          <motion.div
                            key={subscription.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 space-x-reverse">
                                    <div
                                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                      style={{ backgroundColor: subscription.color }}
                                    >
                                      {subscription.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">{subscription.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {subscription.price} {subscription.currency} - {subscription.category}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    {getNotificationIcon(days)}
                                    <Badge variant={getNotificationColor(days)}>
                                      {getNotificationText(days)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="ml-2 h-4 w-4" />
                                    <span>
                                      {format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: ar })}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <CreditCard className="ml-2 h-4 w-4" />
                                    <span>{subscription.paymentMethod}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">لا توجد تجديدات قادمة</h3>
                        <p className="text-muted-foreground">
                          لا توجد اشتراكات للتجديد خلال الشهر القادم
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {subscriptions.filter(sub => sub.isActive).length > 0 ? (
                      subscriptions
                        .filter(sub => sub.isActive)
                        .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
                        .map((subscription, index) => {
                          const days = getDaysUntilRenewal(subscription.renewalDate);
                          
                          return (
                            <motion.div
                              key={subscription.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                      <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: subscription.color }}
                                      >
                                        {subscription.name.charAt(0)}
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">{subscription.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {subscription.price} {subscription.currency} - {subscription.category}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                      {getNotificationIcon(days)}
                                      <Badge variant={getNotificationColor(days)}>
                                        {getNotificationText(days)}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="ml-2 h-4 w-4" />
                                      <span>
                                        {format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: ar })}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <CreditCard className="ml-2 h-4 w-4" />
                                      <span>{subscription.paymentMethod}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">لا توجد اشتراكات نشطة</h3>
                        <p className="text-muted-foreground mb-4">
                          ابدأ بإضافة اشتراكاتك لتتبع مواعيد التجديد
                        </p>
                        <Button>إضافة اشتراك جديد</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}