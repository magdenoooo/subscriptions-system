'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  MoreVertical,
  Calendar,
  CreditCard,
  Power,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/store/subscriptions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function SubscriptionCard({
  subscription,
  onToggleStatus,
  onDelete,
  index,
}: SubscriptionCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const getDaysUntilRenewal = () => {
    const today = new Date();
    const renewalDate = new Date(subscription.renewalDate);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilRenewal = getDaysUntilRenewal();
  const isExpiringSoon = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
  const isOverdue = daysUntilRenewal < 0;

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
    toast({
      title: 'تم نسخ التفاصيل',
      description: 'تم نسخ تفاصيل الاشتراك إلى الحافظة',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
          !subscription.isActive && 'opacity-60',
          isExpiringSoon && 'ring-2 ring-orange-500/50',
          isOverdue && 'ring-2 ring-red-500/50'
        )}
      >
        {/* Header with color stripe */}
        <div
          className="h-1 w-full"
          style={{ backgroundColor: subscription.color }}
        />

        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: `${subscription.color}20` }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: subscription.color }}
                >
                  {subscription.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{subscription.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {subscription.category}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              {!subscription.isActive && (
                <Badge variant="outline" className="text-xs">
                  غير نشط
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/subscription/${subscription.id}`)}
                  >
                    <Edit className="ml-2 h-4 w-4" />
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyDetails}>
                    <Copy className="ml-2 h-4 w-4" />
                    نسخ التفاصيل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(subscription.id)}
                  >
                    <Power className="ml-2 h-4 w-4" />
                    {subscription.isActive ? 'إيقاف' : 'تفعيل'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(subscription.id)}
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {subscription.price} {subscription.currency}
              </span>
              <Badge
                variant={subscription.billingCycle === 'monthly' ? 'default' : 'secondary'}
              >
                {subscription.billingCycle === 'monthly' ? 'شهري' : 'سنوي'}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="ml-2 h-4 w-4" />
              <span>
                التجديد: {format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: ar })}
              </span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="ml-2 h-4 w-4" />
              <span>{subscription.paymentMethod}</span>
            </div>

            {/* Days until renewal indicator */}
            {subscription.isActive && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  {isOverdue
                    ? `متأخر ${Math.abs(daysUntilRenewal)} يوم`
                    : daysUntilRenewal === 0
                    ? 'ينتهي اليوم'
                    : `${daysUntilRenewal} يوم متبقي`}
                </span>
                <div
                  className={cn(
                    'h-2 w-12 rounded-full',
                    isOverdue
                      ? 'bg-red-500'
                      : isExpiringSoon
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  )}
                />
              </div>
            )}
          </div>

          {subscription.notes && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{subscription.notes}</p>
            </div>
          )}
        </CardContent>

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
          animate={{
            translateX: isHovered ? '200%' : '-100%',
          }}
          transition={{ duration: 0.6 }}
        />
      </Card>
    </motion.div>
  );
}