'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  Bell,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/page-transition';

const features = [
  {
    icon: CreditCard,
    title: 'إدارة شاملة',
    description: 'تتبع جميع اشتراكاتك في مكان واحد مع واجهة بسيطة وسهلة الاستخدام',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'تحليل المصروفات',
    description: 'رسوم بيانية تفاعلية لفهم أنماط إنفاقك وتوفير المال بذكاء',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Bell,
    title: 'تنبيهات ذكية',
    description: 'احصل على تنبيهات قبل موعد تجديد اشتراكاتك لتجنب الدفع غير المرغوب',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'أمان البيانات',
    description: 'بياناتك محفوظة محلياً على جهازك مع أعلى معايير الأمان والخصوصية',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Smartphone,
    title: 'متجاوب كلياً',
    description: 'يعمل بسلاسة على جميع الأجهزة - الهاتف، التابلت، والكمبيوتر',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Users,
    title: 'سهل الاستخدام',
    description: 'تصميم عربي أنيق مع تجربة مستخدم متميزة ولا تحتاج خبرة تقنية',
    color: 'from-cyan-500 to-cyan-600',
  },
];

const stats = [
  { value: '10K+', label: 'مستخدم نشط' },
  { value: '50K+', label: 'اشتراك مُدار' },
  { value: '2M+', label: 'ريال تم توفيره' },
  { value: '99%', label: 'رضا المستخدمين' },
];

export default function Home() {
  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-8 pt-14 pb-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),transparent)] opacity-20" />
          
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    سُبسكرايب
                  </span>
                  <br />
                  إدارة الاشتراكات الذكية
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  منصة متقدمة وسهلة لإدارة وتتبع جميع اشتراكاتك الشهرية. وفّر المال واحصل على 
                  رؤى ذكية حول مصروفاتك مع تنبيهات مخصصة لكل اشتراك.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-10 flex items-center justify-center gap-x-6"
              >
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/dashboard">
                    ابدأ الآن مجاناً
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  شاهد العرض التوضيحي
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-slate-800/50">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                لماذا سُبسكرايب؟
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                مميزات متقدمة مصممة خصيصاً لتسهيل إدارة اشتراكاتك وتوفير المال
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-8">
                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-8">
  <div className="mx-auto max-w-4xl text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        ابدأ في إدارة اشتراكاتك اليوم
      </h2>
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        انضم إلى آلاف المستخدمين الذين يوفرون المال ويديرون اشتراكاتهم بذكاء
      </p>
      <div className="mt-10">
        <Button asChild size="lg" className="text-lg px-10 py-6">
          <Link href="/dashboard">
            جرب سُبسكرايب مجاناً
            <ArrowLeft className="mr-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </motion.div>

    {/* حقوق الملكية */}
    <div className="mt-16 border-t pt-6 border-gray-300 dark:border-gray-700 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © 2024 Subscribe. جميع الحقوق محفوظة.
        <span className="mx-1 text-pink-500">❤️</span>
        <span className="text-gray-700 dark:text-white font-semibold">Magdy Zahran</span>
      </p>
    </div>
  </div>
</section>

      </div>
    </PageTransition>
  );
}