'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Palette,
  Save,
  Trash2,
  Copy,
  Power,
  Edit,
} from 'lucide-react';
import { useSubscriptionStore, Subscription } from '@/store/subscriptions';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface SubscriptionDetailPageProps {
  params: {
    id: string;
  };
}

export default function SubscriptionDetailPage({ params }: SubscriptionDetailPageProps) {
  const router = useRouter();
  const { subscriptions, updateSubscription, deleteSubscription, toggleSubscriptionStatus } = useSubscriptionStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
  });

  useEffect(() => {
    const foundSubscription = subscriptions.find(sub => sub.id === params.id);
    if (foundSubscription) {
      setSubscription(foundSubscription);
      // Set form default values
      form.reset({
        name: foundSubscription.name,
        price: foundSubscription.price,
        renewalDate: foundSubscription.renewalDate,
        paymentMethod: foundSubscription.paymentMethod,
        category: foundSubscription.category,
        notes: foundSubscription.notes || '',
        color: foundSubscription.color,
        currency: foundSubscription.currency,
        billingCycle: foundSubscription.billingCycle,
      });
    } else {
      // Subscription not found, redirect to dashboard
      router.push('/dashboard');
    }
  }, [params.id, subscriptions, form, router]);

  if (!subscription) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">الاشتراك غير موجود</h1>
            <p className="text-muted-foreground mt-2">
              لم يتم العثور على الاشتراك المطلوب
            </p>
            <Button asChild className="mt-4">
              <button onClick={() => router.push('/dashboard')}>
                العودة إلى لوحة التحكم
              </button>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const getDaysUntilRenewal = () => {
    const today = new Date();
    const renewalDate = new Date(subscription.renewalDate);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCopyDetails = () => {
    const details = `
الخدمة: ${subscription.name}
المبلغ: ${subscription.price} ${subscription.currency}
تاريخ التجديد: ${format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: ar })}
طريقة الدفع: ${subscription.paymentMethod}
الفئة: ${subscription.category}
${subscription.notes ? `ملاحظات: ${subscription.notes}` : ''}
    `.trim();

    navigator.clipboard.writeText(details);
    toast.success('تم نسخ التفاصيل', {
      description: 'تم نسخ تفاصيل الاشتراك إلى الحافظة',
    });
  };

  const onSubmit = (data: SubscriptionFormValues) => {
    try {
      updateSubscription(subscription.id, data);
      setIsEditing(false);
      toast.success('تم تحديث الاشتراك بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الاشتراك');
    }
  };

  const handleDelete = () => {
    deleteSubscription(subscription.id);
    toast.success('تم حذف الاشتراك');
    router.push('/dashboard');
  };

  const handleToggleStatus = () => {
    toggleSubscriptionStatus(subscription.id);
    toast.success(
      subscription.isActive ? 'تم إيقاف الاشتراك' : 'تم تفعيل الاشتراك'
    );
  };

  const daysUntilRenewal = getDaysUntilRenewal();
  const isExpiringSoon = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
  const isOverdue = daysUntilRenewal < 0;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: subscription.color }}
              >
                {subscription.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{subscription.name}</h1>
                <div className="flex items-center space-x-2 space-x-reverse mt-2">
                  <Badge variant="secondary">{subscription.category}</Badge>
                  {!subscription.isActive && (
                    <Badge variant="outline">غير نشط</Badge>
                  )}
                  {isExpiringSoon && (
                    <Badge variant="destructive">ينتهي قريباً</Badge>
                  )}
                  {isOverdue && (
                    <Badge variant="destructive">متأخر</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="ml-2 h-4 w-4" />
                {isEditing ? 'إلغاء التعديل' : 'تعديل'}
              </Button>
              <Button variant="outline" onClick={handleCopyDetails}>
                <Copy className="ml-2 h-4 w-4" />
                نسخ
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Details */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Edit className="ml-2 h-5 w-5" />
                      تعديل الاشتراك
                    </CardTitle>
                    <CardDescription>
                      قم بتحديث معلومات اشتراكك
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
                                  <Input {...field} />
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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                              <FormLabel>تاريخ التجديد القادم</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
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
                                      onClick={() => field.onChange(color)}
                                    />
                                  ))}
                                </div>
                              </FormControl>
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
                              <FormLabel>ملاحظات</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6">
                          <Button type="submit" className="flex-1">
                            <Save className="ml-2 h-4 w-4" />
                            حفظ التغييرات
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            إلغاء
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="ml-2 h-5 w-5" />
                      تفاصيل الاشتراك
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">السعر</h3>
                        <p className="text-2xl font-bold">
                          {subscription.price} {subscription.currency}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {subscription.billingCycle === 'monthly' ? 'شهري' : 'سنوي'}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                          تاريخ التجديد القادم
                        </h3>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-lg font-semibold">
                            {format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: ar })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isOverdue
                            ? `متأخر ${Math.abs(daysUntilRenewal)} يوم`
                            : daysUntilRenewal === 0
                            ? 'ينتهي اليوم'
                            : `${daysUntilRenewal} يوم متبقي`}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">طريقة الدفع</h3>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <p className="text-lg">{subscription.paymentMethod}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">الفئة</h3>
                        <Badge>{subscription.category}</Badge>
                      </div>
                    </div>

                    {subscription.notes && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground mb-2">ملاحظات</h3>
                          <p className="text-muted-foreground">{subscription.notes}</p>
                        </div>
                      </>
                    )}

                    <Separator />
                    
                    <div className="text-sm text-muted-foreground">
                      <p>تم الإنشاء: {format(new Date(subscription.createdAt), 'dd MMMM yyyy', { locale: ar })}</p>
                      <p>آخر تحديث: {format(new Date(subscription.updatedAt), 'dd MMMM yyyy', { locale: ar })}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الإجراءات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleToggleStatus}
                  >
                    <Power className="ml-2 h-4 w-4" />
                    {subscription.isActive ? 'إيقاف الاشتراك' : 'تفعيل الاشتراك'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleCopyDetails}
                  >
                    <Copy className="ml-2 h-4 w-4" />
                    نسخ التفاصيل
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full justify-start">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف الاشتراك
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من حذف اشتراك "{subscription.name}"؟
                          هذا الإجراء لا يمكن التراجع عنه.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.back()}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">التكلفة السنوية:</span>
                    <span className="font-semibold">
                      {subscription.billingCycle === 'yearly' 
                        ? subscription.price 
                        : subscription.price * 12
                      } {subscription.currency}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">أيام التشغيل:</span>
                    <span className="font-semibold">
                      {Math.floor((new Date().getTime() - new Date(subscription.createdAt).getTime()) / (1000 * 60 * 60 * 24))} يوم
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">الحالة:</span>
                    <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
                      {subscription.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}