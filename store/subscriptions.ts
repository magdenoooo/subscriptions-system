import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  renewalDate: string;
  paymentMethod: string;
  category: string;
  notes?: string;
  isActive: boolean;
  color: string;
  icon: string;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  searchTerm: string;
  filterCategory: string;
  sortBy: 'name' | 'price' | 'renewalDate';
  sortOrder: 'asc' | 'desc';
  
  // Actions
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscriptionStatus: (id: string) => void;
  
  // Filters and Search
  setSearchTerm: (term: string) => void;
  setFilterCategory: (category: string) => void;
  setSortBy: (sortBy: 'name' | 'price' | 'renewalDate') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  
  // Computed
  getFilteredSubscriptions: () => Subscription[];
  getTotalMonthlyExpense: () => number;
  getUpcomingRenewals: (days?: number) => Subscription[];
  getCategorySummary: () => { [key: string]: { count: number; total: number } };
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const defaultSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    price: 49.99,
    renewalDate: '2024-02-15',
    paymentMethod: 'فيزا',
    category: 'ترفيه',
    notes: 'خطة العائلة',
    isActive: true,
    color: '#E50914',
    icon: 'Play',
    currency: 'ريال',
    billingCycle: 'monthly',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Spotify',
    price: 19.99,
    renewalDate: '2024-02-20',
    paymentMethod: 'ماستركارد',
    category: 'موسيقى',
    notes: 'خطة بريميوم',
    isActive: true,
    color: '#1DB954',
    icon: 'Music',
    currency: 'ريال',
    billingCycle: 'monthly',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    price: 199.99,
    renewalDate: '2024-02-10',
    paymentMethod: 'فيزا',
    category: 'إنتاجية',
    notes: 'خطة كاملة للمصممين',
    isActive: true,
    color: '#FF0000',
    icon: 'Palette',
    currency: 'ريال',
    billingCycle: 'monthly',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
];

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: defaultSubscriptions,
      searchTerm: '',
      filterCategory: '',
      sortBy: 'renewalDate',
      sortOrder: 'asc',

      addSubscription: (subscriptionData) => {
        const newSubscription: Subscription = {
          ...subscriptionData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));
      },

      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id
              ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
              : sub
          ),
        }));
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      toggleSubscriptionStatus: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id
              ? { ...sub, isActive: !sub.isActive, updatedAt: new Date().toISOString() }
              : sub
          ),
        }));
      },

      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),

      getFilteredSubscriptions: () => {
        const { subscriptions, searchTerm, filterCategory, sortBy, sortOrder } = get();
        
        let filtered = subscriptions.filter((sub) => {
          const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               sub.category.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = !filterCategory || filterCategory === 'all' || sub.category === filterCategory;
          
          return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'renewalDate':
              aValue = new Date(a.renewalDate);
              bValue = new Date(b.renewalDate);
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getTotalMonthlyExpense: () => {
        const { subscriptions } = get();
        return subscriptions
          .filter((sub) => sub.isActive)
          .reduce((total, sub) => {
            return total + (sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price);
          }, 0);
      },

      getUpcomingRenewals: (days = 7) => {
        const { subscriptions } = get();
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        return subscriptions
          .filter((sub) => {
            const renewalDate = new Date(sub.renewalDate);
            return sub.isActive && renewalDate >= today && renewalDate <= futureDate;
          })
          .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
      },

      getCategorySummary: () => {
        const { subscriptions } = get();
        return subscriptions
          .filter((sub) => sub.isActive)
          .reduce((summary, sub) => {
            const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
            
            if (!summary[sub.category]) {
              summary[sub.category] = { count: 0, total: 0 };
            }
            
            summary[sub.category].count += 1;
            summary[sub.category].total += monthlyPrice;
            
            return summary;
          }, {} as { [key: string]: { count: number; total: number } });
      },
    }),
    {
      name: 'subscription-store',
    }
  )
);