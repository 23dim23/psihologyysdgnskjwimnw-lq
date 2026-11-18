import React, { useState } from 'react';
import {
  Play,
  Lock,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowUpRight,
  Search,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  MessageCircle,
  Megaphone,
} from 'lucide-react';
import {
  Lesson,
  MaterialItem,
  SubscriptionSegment,
  SEGMENT_LABELS,
} from '../data/clubData';
import { ResilientImage } from './ResilientImage';

interface TelegramMiniAppViewProps {
  activeTab: 'lessons' | 'materials' | 'community' | 'subscription';
  lessons: Lesson[];
  materials: MaterialItem[];
  currentSegment: SubscriptionSegment;
  nextChargeDate: string | null;
  onChangeSegment: (seg: SubscriptionSegment) => void;
  onPaySubscription: () => void;
  onDisableAutoRenew: () => void;
  onRenewSubscription: () => void;
}

export const TelegramMiniAppView: React.FC<TelegramMiniAppViewProps> = ({
  activeTab,
  lessons,
  materials,
  currentSegment,
  nextChargeDate,
  onChangeSegment,
  onPaySubscription,
  onDisableAutoRenew,
  onRenewSubscription,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [receiptEmail, setReceiptEmail] = useState<string>('member@psyclub.ru');
  const [agreeRecurring, setAgreeRecurring] = useState<boolean>(true);
  const [communityBanner, setCommunityBanner] = useState<string | null>(null);

  const hasAccess =
    currentSegment === 'active' ||
    currentSegment === 'auto_renew_off' ||
    currentSegment === 'renewed';

  const modules = ['all', ...Array.from(new Set(lessons.map((l) => l.module)))];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesModule = selectedModule === 'all' || lesson.module === selectedModule;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleLessonClick = (lesson: Lesson) => {
    if (hasAccess || lesson.isFreePreview) {
      setActiveLesson(lesson);
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleCompleteYookassaPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSegment === 'expired' || currentSegment === 'auto_renew_off') {
      onRenewSubscription();
    } else {
      onPaySubscription();
    }
    setShowCheckoutModal(false);
  };

  const handleJoinCommunity = (target: 'channel' | 'chat') => {
    if (!hasAccess) {
      setShowCheckoutModal(true);
      return;
    }
    if (target === 'channel') {
      setCommunityBanner(
        'Персональная ссылка в закрытый Telegram-канал «Психология для психов» активирована.'
      );
    } else {
      setCommunityBanner(
        'Персональный доступ в закрытый Telegram-чат участников открыт.'
      );
    }
    setTimeout(() => setCommunityBanner(null), 4000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* PRE-PAYMENT BANNER (Visible when user has not paid or subscription expired) */}
      {!hasAccess && (
        <section className="bg-stone-900 text-stone-50 rounded-2xl p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-amber-300 mb-1">
              <span>
                {currentSegment === 'expired'
                  ? 'Подписка завершена'
                  : 'Закрытый клуб по подписке'}
              </span>
              <span className="font-mono font-semibold tabular-nums">2 500 ₽ / мес</span>
            </div>
            <h1 className="text-lg font-semibold text-white leading-snug">
              Откройте доступ ко всем {lessons.length} видеоурокам, материалам и чату
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed mt-1">
              Ежемесячная подписка с автопродлением через ЮKassa. Отмена в любой момент в один клик.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCheckoutModal(true)}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-400 active:scale-[0.99] text-stone-950 font-semibold text-xs transition-transform flex items-center justify-center gap-2 tabular-nums"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {currentSegment === 'expired'
                ? 'Повторно оформить подписку · 2 500 ₽'
                : 'Оформить подписку · 2 500 ₽ / мес'}
            </span>
          </button>
        </section>
      )}

      {/* TAB 1: БАЗА УРОКОВ */}
      {activeTab === 'lessons' && (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              База видеоуроков
            </h2>
            <p className="text-xs text-stone-500 tabular-nums">
              {lessons.length} видеоуроков · Пополняется каждый месяц
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по темам уроков..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
            />
          </div>

          {/* Horizontal Module Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
            {modules.map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModule(mod)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  selectedModule === mod
                    ? 'bg-stone-900 text-stone-50'
                    : 'bg-white border border-stone-200 text-stone-700'
                }`}
              >
                {mod === 'all' ? `Все (${lessons.length})` : mod}
              </button>
            ))}
          </div>

          {/* Single-Column Mobile Lesson Cards */}
          <div className="space-y-3">
            {filteredLessons.map((lesson) => {
              const isUnlocked = hasAccess || lesson.isFreePreview;
              return (
                <article
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                    <ResilientImage
                      src={lesson.coverUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-stone-200">
                      <div className="flex items-center gap-1.5 tabular-nums">
                        <span className="font-semibold text-white">
                          Урок {lesson.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{lesson.duration}</span>
                        {lesson.isFreePreview && !hasAccess && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-300 font-medium">
                              Демо-урок
                            </span>
                          </>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-xs">
                        {isUnlocked ? (
                          <Play className="w-3.5 h-3.5 fill-stone-900 ml-0.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-stone-700" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1">
                      <span className="truncate">{lesson.module}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums shrink-0">{lesson.publishedAt}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-stone-900 leading-snug mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: МАТЕРИАЛЫ */}
      {activeTab === 'materials' && (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              Дополнительные материалы
            </h2>
            <p className="text-xs text-stone-500">
              PDF-гайды, рабочие тетради КПТ и чек-листы
            </p>
          </div>

          <div className="space-y-2.5">
            {materials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => {
                  if (hasAccess) {
                    setActiveMaterial(mat);
                  } else {
                    setShowCheckoutModal(true);
                  }
                }}
                className="bg-white border border-stone-200 rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                  {hasAccess ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4 text-stone-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1 tabular-nums">
                    <span className="font-medium text-stone-800">{mat.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{mat.pagesOrDuration}</span>
                    <span aria-hidden="true">·</span>
                    <span>{mat.fileSize}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 leading-snug mb-1">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 self-center" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: ДОСТУП К СООБЩЕСТВУ */}
      {activeTab === 'community' && (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              Закрытое сообщество
            </h2>
            <p className="text-xs text-stone-500">
              Два отдельных пространства для участников клуба
            </p>
          </div>

          {communityBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-100 text-xs leading-relaxed">
              {communityBanner}
            </div>
          )}

          {/* Closed Channel */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span>Закрытый Telegram-канал</span>
                  <span aria-hidden="true">·</span>
                  <span>{hasAccess ? 'Доступ открыт' : 'По подписке'}</span>
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  Канал «Психология для психов»
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Публикация контента, подкастов, психологических разборов, анонсов эфиров и информации для участников клуба.
            </p>

            <button
              type="button"
              onClick={() => handleJoinCommunity('channel')}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <span>
                {hasAccess
                  ? 'Перейти в закрытый Telegram-канал'
                  : 'Оформить подписку для входа в канал'}
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Closed Chat */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span>Закрытый Telegram-чат</span>
                  <span aria-hidden="true">·</span>
                  <span>{hasAccess ? 'Доступ открыт' : 'По подписке'}</span>
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  Чат общения участников
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Безопасное пространство для общения участников клуба, обсуждения уроков и взаимной поддержки.
            </p>

            <button
              type="button"
              onClick={() => handleJoinCommunity('chat')}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-stone-900 text-stone-900 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <span>
                {hasAccess
                  ? 'Перейти в закрытый Telegram-чат'
                  : 'Оформить подписку для входа в чат'}
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* TAB 4: УПРАВЛЕНИЕ ПОДПИСКОЙ */}
      {activeTab === 'subscription' && (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              Управление подпиской
            </h2>
            <p className="text-xs text-stone-500">
              Статус подписки, дата следующего списания и автопродление
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <div>
                <p className="text-[11px] text-stone-500">Статус подписки</p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">
                  {SEGMENT_LABELS[currentSegment]}
                </p>
              </div>
              <div className="text-right tabular-nums">
                <p className="text-[11px] text-stone-500">Тариф</p>
                <p className="text-base font-bold text-stone-900 mt-0.5">
                  2 500 ₽ / мес
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Дата следующего списания:</span>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {currentSegment === 'active' || currentSegment === 'renewed'
                    ? nextChargeDate || '18 дек 2026'
                    : currentSegment === 'auto_renew_off'
                    ? 'Отключено (доступ до 18 дек)'
                    : 'Не запланировано'}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>Способ оплаты:</span>
                <span className="font-mono text-stone-900">
                  ЮKassa · МИР •••• 4492
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>Доступ к материалам и чату:</span>
                <span className="font-medium text-stone-900">
                  {hasAccess ? 'Открыт' : 'Закрыт'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2.5">
              {(currentSegment === 'active' || currentSegment === 'renewed') && (
                <button
                  type="button"
                  onClick={onDisableAutoRenew}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-stone-300 text-stone-800 font-medium text-xs"
                >
                  Отключить автопродление
                </button>
              )}

              {currentSegment === 'auto_renew_off' && (
                <button
                  type="button"
                  onClick={onRenewSubscription}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Повторно оформить подписку</span>
                </button>
              )}

              {(currentSegment === 'not_paid' || currentSegment === 'expired') && (
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2 tabular-nums"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {currentSegment === 'expired'
                      ? 'Повторно оформить подписку · 2 500 ₽'
                      : 'Оформить подписку · 2 500 ₽ / мес'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 5 Segments Quick Switcher for testing all states */}
          <div className="bg-stone-100 border border-stone-200 rounded-2xl p-3.5 space-y-2">
            <p className="text-[11px] font-semibold text-stone-700">
              Проверка 5 состояний подписки:
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(SEGMENT_LABELS) as SubscriptionSegment[]).map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => onChangeSegment(seg)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    currentSegment === seg
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  <span>{SEGMENT_LABELS[seg]}</span>
                  <span className="text-[10px] opacity-75">
                    {seg === 'not_paid' || seg === 'expired' ? 'Закрыто' : 'Активно'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODAL 1: LESSON VIDEO PLAYER (Mobile Bottom Sheet) */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-[#FAF9F5] w-full max-w-[440px] rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-stone-600 tabular-nums">
                Урок {activeLesson.number} · {activeLesson.duration}
              </span>
              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-900">
                <video
                  src={activeLesson.videoUrl}
                  poster={activeLesson.coverUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-[11px] text-stone-500 mb-1">{activeLesson.module}</p>
                <h3 className="text-base font-semibold text-stone-900 leading-snug">
                  {activeLesson.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-1.5">
                  {activeLesson.description}
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2">
                <p className="text-xs font-semibold text-stone-900">
                  Ключевые тезисы урока:
                </p>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {activeLesson.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-stone-400">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MATERIAL PREVIEW & DOWNLOAD (Mobile Bottom Sheet) */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-[#FAF9F5] w-full max-w-[440px] rounded-t-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-stone-600">
                {activeMaterial.category} · {activeMaterial.pagesOrDuration}
              </span>
              <button
                type="button"
                onClick={() => setActiveMaterial(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4">
              <h3 className="text-base font-semibold text-stone-900 leading-snug">
                {activeMaterial.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {activeMaterial.description}
              </p>

              <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2">
                <p className="text-xs font-semibold text-stone-800">
                  Фрагмент материала:
                </p>
                {activeMaterial.contentPreview.map((line, i) => (
                  <p key={i} className="text-xs text-stone-600 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveMaterial(null)}
                className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Скачать файл ({activeMaterial.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: YOOKASSA RECURRENT CHECKOUT SHEET (Mobile Bottom Sheet) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end justify-center">
          <form
            onSubmit={handleCompleteYookassaPayment}
            className="bg-white w-full max-w-[440px] rounded-t-3xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <p className="text-[11px] font-medium text-stone-500">
                  ЮKassa · Ежемесячная подписка
                </p>
                <h3 className="text-base font-semibold text-stone-900">
                  Клуб «Психология для психов»
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-stone-100 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-900">
                  Полный доступ на 30 дней
                </p>
                <p className="text-[11px] text-stone-600">
                  Уроки, материалы, закрытый канал и чат
                </p>
              </div>
              <span className="text-lg font-bold text-stone-900 tabular-nums">
                2 500 ₽
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email для чека
                </label>
                <input
                  type="email"
                  required
                  value={receiptEmail}
                  onChange={(e) => setReceiptEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeRecurring}
                  onChange={(e) => setAgreeRecurring(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-stone-300"
                />
                <span>
                  Автоматическое продление 2 500 ₽ раз в месяц (отключение в любой момент в разделе «Подписка»).
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2 tabular-nums"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Оплатить 2 500 ₽ и открыть доступ</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
