import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  FileText,
  Users,
  CreditCard,
  SlidersHorizontal,
} from 'lucide-react';
import {
  INITIAL_AUTO_MESSAGES,
  INITIAL_BROADCASTS,
  INITIAL_LESSONS,
  INITIAL_MATERIALS,
  INITIAL_PAYMENTS,
  INITIAL_USERS,
  AutoMessageTemplate,
  BroadcastItem,
  ClubUser,
  Lesson,
  MaterialItem,
  PaymentRecord,
  SubscriptionSegment,
} from './data/clubData';
import { TelegramMiniAppView } from './components/TelegramMiniAppView';
import { AdminDashboardView, AdminSection } from './components/AdminDashboardView';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

type BottomNavTab = 'lessons' | 'materials' | 'community' | 'subscription' | 'admin';

export default function App() {
  const [activeNav, setActiveNav] = useState<BottomNavTab>('lessons');
  const [adminInitialSection] = useState<AdminSection>('lessons');
  const [telegramUserName, setTelegramUserName] = useState<string>('Алина Воронцова');

  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [users, setUsers] = useState<ClubUser[]>(INITIAL_USERS);
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>(INITIAL_BROADCASTS);
  const [autoMessages, setAutoMessages] =
    useState<AutoMessageTemplate[]>(INITIAL_AUTO_MESSAGES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser?.first_name) {
        const fullName = [tgUser.first_name, tgUser.last_name]
          .filter(Boolean)
          .join(' ');
        setTelegramUserName(fullName);
      }
    }
  }, []);

  const currentUser = users[0];
  const hasAccess =
    currentUser.segment === 'active' ||
    currentUser.segment === 'auto_renew_off' ||
    currentUser.segment === 'renewed';

  const getNowTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const handleUserSegmentChange = (newSegment: SubscriptionSegment) => {
    const hasCommunityAccess =
      newSegment === 'active' ||
      newSegment === 'auto_renew_off' ||
      newSegment === 'renewed';

    setUsers((prev) =>
      prev.map((u, idx) =>
        idx === 0
          ? {
              ...u,
              segment: newSegment,
              nextChargeDate:
                newSegment === 'active' || newSegment === 'renewed'
                  ? '18 дек 2026'
                  : newSegment === 'auto_renew_off'
                  ? '18 дек 2026 (отключено)'
                  : null,
              inChannel: hasCommunityAccess,
              inChat: hasCommunityAccess,
            }
          : u
      )
    );
  };

  const handlePaySubscription = () => {
    handleUserSegmentChange('active');
    const newPay: PaymentRecord = {
      id: `pay-${Date.now()}`,
      yookassaId: `2e99a${Math.floor(100 + Math.random() * 899)}-000f-5000-9000-yookassa`,
      userId: currentUser.id,
      userName: telegramUserName,
      userHandle: currentUser.username,
      amountRub: 2500,
      type: 'Первичная оплата',
      status: 'Succeeded',
      createdAt: `18 ноя 2026, ${getNowTime()}`,
    };
    setPayments((prev) => [newPay, ...prev]);
  };

  const handleDisableAutoRenew = () => {
    handleUserSegmentChange('auto_renew_off');
  };

  const handleRenewSubscription = () => {
    handleUserSegmentChange('renewed');
    const newPay: PaymentRecord = {
      id: `pay-${Date.now()}`,
      yookassaId: `2e99r${Math.floor(100 + Math.random() * 899)}-000f-5000-9000-yookassa`,
      userId: currentUser.id,
      userName: telegramUserName,
      userHandle: currentUser.username,
      amountRub: 2500,
      type: 'Повторное оформление',
      status: 'Succeeded',
      createdAt: `18 ноя 2026, ${getNowTime()}`,
    };
    setPayments((prev) => [newPay, ...prev]);
  };

  const handleSaveLesson = (lesson: Lesson) => {
    setLessons((prev) => {
      const exists = prev.some((l) => l.id === lesson.id);
      if (exists) {
        return prev.map((l) => (l.id === lesson.id ? lesson : l));
      }
      return [...prev, lesson];
    });
  };

  const handleDeleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSaveMaterial = (material: MaterialItem) => {
    setMaterials((prev) => {
      const exists = prev.some((m) => m.id === material.id);
      if (exists) {
        return prev.map((m) => (m.id === material.id ? material : m));
      }
      return [...prev, material];
    });
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateUserSegment = (userId: string, segment: SubscriptionSegment) => {
    if (userId === currentUser.id) {
      handleUserSegmentChange(segment);
      return;
    }
    const hasComm =
      segment === 'active' || segment === 'auto_renew_off' || segment === 'renewed';
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              segment,
              inChannel: hasComm,
              inChat: hasComm,
              nextChargeDate: hasComm ? '18 дек 2026' : null,
            }
          : u
      )
    );
  };

  const handleSendBroadcast = (
    bcData: Omit<BroadcastItem, 'id' | 'sentAt' | 'recipientsCount'>
  ) => {
    const recipientsCount =
      bcData.targetSegment === 'all'
        ? users.length * 32
        : users.filter((u) => u.segment === bcData.targetSegment).length * 28 + 12;

    const newBroadcast: BroadcastItem = {
      ...bcData,
      id: `bc-${Date.now()}`,
      sentAt: `18 ноя 2026, ${getNowTime()}`,
      recipientsCount,
    };

    setBroadcasts((prev) => [newBroadcast, ...prev]);
  };

  const handleUpdateAutoMessage = (updated: AutoMessageTemplate) => {
    setAutoMessages((prev) =>
      prev.map((item) => (item.key === updated.key ? updated : item))
    );
  };

  return (
    <div className="min-h-screen bg-stone-200/70 flex justify-center">
      {/* Native Mobile Telegram Mini App Container (440px max width) */}
      <div className="w-full max-w-[440px] min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col relative shadow-xl border-x border-stone-300/80">
        {/* Compact Sticky Mobile Top App Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
              ПДП
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-tight text-stone-900 truncate">
                Психология для психов
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {hasAccess ? 'Подписка активна' : 'До оплаты подписки'}
              </p>
            </div>
          </div>

          {/* Quick Toggle: До оплаты / После оплаты */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => handleUserSegmentChange('not_paid')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                !hasAccess
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              До оплаты
            </button>
            <button
              type="button"
              onClick={() => handleUserSegmentChange('active')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                hasAccess
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              После оплаты
            </button>
          </div>
        </header>

        {/* Scrollable Mobile Viewport Body */}
        <main className="flex-1 pb-20">
          {activeNav !== 'admin' ? (
            <TelegramMiniAppView
              activeTab={activeNav}
              lessons={lessons}
              materials={materials}
              currentSegment={currentUser.segment}
              nextChargeDate={currentUser.nextChargeDate}
              onChangeSegment={handleUserSegmentChange}
              onPaySubscription={handlePaySubscription}
              onDisableAutoRenew={handleDisableAutoRenew}
              onRenewSubscription={handleRenewSubscription}
            />
          ) : (
            <AdminDashboardView
              initialSection={adminInitialSection}
              lessons={lessons}
              materials={materials}
              users={users}
              broadcasts={broadcasts}
              autoMessages={autoMessages}
              payments={payments}
              onSaveLesson={handleSaveLesson}
              onDeleteLesson={handleDeleteLesson}
              onSaveMaterial={handleSaveMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onUpdateUserSegment={handleUpdateUserSegment}
              onSendBroadcast={handleSendBroadcast}
              onUpdateAutoMessage={handleUpdateAutoMessage}
            />
          )}
        </main>

        {/* Always-Visible Fixed Bottom Menu Bar inside Mini App */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 grid grid-cols-5 h-16 px-1">
          <button
            type="button"
            onClick={() => setActiveNav('lessons')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeNav === 'lessons'
                ? 'text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-1 whitespace-nowrap">Уроки</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('materials')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeNav === 'materials'
                ? 'text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-1 whitespace-nowrap">Материалы</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('community')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeNav === 'community'
                ? 'text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 whitespace-nowrap">Клуб</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('subscription')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeNav === 'subscription'
                ? 'text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] mt-1 whitespace-nowrap">Подписка</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeNav === 'admin'
                ? 'text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1 whitespace-nowrap">Админка</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
