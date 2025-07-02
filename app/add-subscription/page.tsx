'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Palette,
  Save,
  Sparkles,
} from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscriptions';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'اسم الخدمة مطلوب'),
  price: z.number().min(0, 'السعر يجب أن يكون أكبر من 0'),
  renewalDate: z.string().min(1, 'تاريخ التجديد مطلوب'),
  paymentMethod: z.string().min(1, 'طريقة الدفع مطلوبة'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  notes: z.string().optional(),
  color: z.string().min(1, 'اللون مطلوب'),
  currency: z.string().min(1, 'العملة مطلوبة'),
  billingCycle: z.enum(['monthly', 'yearly']),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

const predefinedColors = [
  '#E50914', // Netflix Red
  '#1DB954', // Spotify Green  
  '#4285F4', // Google Blue
  '#FF6900', // Adobe Orange
  '#7B68EE', // Medium Slate Blue
  '#20B2AA', // Light Sea Green
  '#FF1493', // Deep Pink
  '#32CD32', // Lime Green
  '#FF4500', // Orange Red
  '#9370DB', // Medium Purple
];

const categories = [
  'ترفيه',
  'موسيقى',
  'إنتاجية',
  'تعليم',
  'رياضة',
  'أخبار',
  'طعام',
  'مواصلات',
  'أخرى',
];

const paymentMethods = [
  'فيزا',
  'ماستركارد',
  'مدى',
  'آبل باي',
  'STC Pay',
  'أخرى',
];

export default function AddSubscription() {
  const router = useRouter();
  const { addSubscription } = useSubscriptionStore();
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      price: 0,
      renewalDate: '',
      paymentMethod: '',
      category: '',
      notes: '',
      color: predefinedColors[0],
      currency: 'ريال',
      billingCycle: 'monthly',
    },
  });

  const onSubmit = (data: SubscriptionFormValues) => {
    try {
      addSubscription({
        ...data,
        isActive: true,
        icon: 'CreditCard',
      });
      
      toast.success('تم إضافة الاشتراك بنجاح!', {
        description: `تم إضافة اشتراك ${data.name} إلى قائمتك`,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الاشتراك');
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">إضافة اشتراك جديد</h1>
          <p className="text-muted-foreground mt-2">
            أضف تفاصيل اشتراكك الجديد لتبدأ في تتبعه
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="ml-2 h-5 w-5" />
                معلومات الاشتراك
              </CardTitle>
              <CardDescription>
                املأ جميع البيانات المطلوبة لإضافة اشتراكك الجديد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الخدمة</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: Netflix" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="49.99"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Currency and Billing Cycle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العملة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ريال">ريال سعودي</SelectItem>
                              <SelectItem value="دولار">دولار</SelectItem>
                              <SelectItem value="يورو">يورو</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingCycle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>دورة الفوترة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">شهري</SelectItem>
                              <SelectItem value="yearly">سنوي</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Renewal Date */}
                  <FormField
                    control={form.control}
                    name="renewalDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Calendar className="ml-2 h-4 w-4" />
                          تاريخ التجديد القادم
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          التاريخ الذي سيتم فيه تجديد الاشتراك وخصم المبلغ
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category and Payment Method */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الفئة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الفئة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>طريقة الدفع</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر طريقة الدفع" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Color Selection */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Palette className="ml-2 h-4 w-4" />
                          لون الاشتراك
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {predefinedColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  field.value === color
                                    ? 'border-primary scale-110'
                                    : 'border-muted hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  field.onChange(color);
                                  setSelectedColor(color);
                                }}
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>
                          اختر لوناً مميزاً للاشتراك لسهولة التعرف عليه
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات (اختيارية)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أي معلومات إضافية عن الاشتراك..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          يمكنك إضافة أي ملاحظات أو تفاصيل إضافية
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.back()}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={form.formState.isSubmitting}
                    >
                      <Save className="ml-2 h-4 w-4" />
                      حفظ الاشتراك
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}