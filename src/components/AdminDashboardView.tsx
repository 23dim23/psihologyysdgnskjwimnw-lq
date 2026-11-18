import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Users,
  Send,
  Bell,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Check,
  Search,
  X,
} from 'lucide-react';
import {
  AutoMessageTemplate,
  BroadcastItem,
  ClubUser,
  Lesson,
  MaterialItem,
  PaymentRecord,
  SubscriptionSegment,
  TriggerKey,
  SEGMENT_LABELS,
} from '../data/clubData';
import { ResilientImage } from './ResilientImage';

export type AdminSection =
  | 'lessons'
  | 'materials'
  | 'users'
  | 'broadcasts'
  | 'automessages'
  | 'payments';

interface AdminDashboardViewProps {
  initialSection?: AdminSection;
  lessons: Lesson[];
  materials: MaterialItem[];
  users: ClubUser[];
  broadcasts: BroadcastItem[];
  autoMessages: AutoMessageTemplate[];
  payments: PaymentRecord[];
  onSaveLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
  onSaveMaterial: (material: MaterialItem) => void;
  onDeleteMaterial: (id: string) => void;
  onUpdateUserSegment: (userId: string, segment: SubscriptionSegment) => void;
  onSendBroadcast: (broadcast: Omit<BroadcastItem, 'id' | 'sentAt' | 'recipientsCount'>) => void;
  onUpdateAutoMessage: (template: AutoMessageTemplate) => void;
}

const COVER_PRESETS = [
  {
    label: 'Утренний свет (Тревога / Опора)',
    url: '/src/assets/images/lesson_cover_anxiety_1795006010043.jpg',
  },
  {
    label: 'Архитектура (Личные границы)',
    url: '/src/assets/images/lesson_cover_boundaries_1795006010496.jpg',
  },
  {
    label: 'Призма (Тень и Критик)',
    url: '/src/assets/images/lesson_cover_shadow_1795006011937.jpg',
  },
  {
    label: 'Эвкалипт (Выгорание и Ресурс)',
    url: '/src/assets/images/lesson_cover_burnout_1795006013634.jpg',
  },
];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  initialSection = 'lessons',
  lessons,
  materials,
  users,
  broadcasts,
  autoMessages,
  payments,
  onSaveLesson,
  onDeleteLesson,
  onSaveMaterial,
  onDeleteMaterial,
  onUpdateUserSegment,
  onSendBroadcast,
  onUpdateAutoMessage,
}) => {
  const [section, setSection] = useState<AdminSection>(initialSection);

  // Lesson Form State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  // Material Form State
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);

  // User Segment Filter State
  const [userSegmentFilter, setUserSegmentFilter] = useState<'all' | SubscriptionSegment>('all');
  const [userSearch, setUserSearch] = useState('');

  // Broadcast Form State
  const [bcTitle, setBcTitle] = useState('');
  const [bcSegment, setBcSegment] = useState<'all' | SubscriptionSegment>('not_paid');
  const [bcText, setBcText] = useState(
    'Друзья, в эту пятницу проводим закрытый эфир-разбор «Как перестать спасать всех вокруг». Подключайтесь к клубу, чтобы получить доступ ко всем видеоурокам и чату!'
  );
  const [bcMediaType, setBcMediaType] = useState<'none' | 'photo' | 'video'>('photo');
  const [bcMediaUrl, setBcMediaUrl] = useState(COVER_PRESETS[0].url);
  const [bcButtonText, setBcButtonText] = useState('Открыть приложение клуба');
  const [bcSuccessBanner, setBcSuccessBanner] = useState<string | null>(null);

  const [savedTriggerKey, setSavedTriggerKey] = useState<TriggerKey | null>(null);

  const startNewLesson = () => {
    setIsCreatingLesson(true);
    setEditingLesson({
      id: `les-${Date.now()}`,
      number: lessons.length + 1,
      title: '',
      module: 'Модуль 5 · Практикумы',
      duration: '36:00',
      description: '',
      coverUrl: COVER_PRESETS[0].url,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      keyTakeaways: [
        'Практическое упражнение для самостоятельной проработки',
        'Вопросы для обсуждения в закрытом Telegram-чате клуба',
      ],
      publishedAt: '18 ноя 2026',
    });
  };

  const handleLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    onSaveLesson(editingLesson);
    setEditingLesson(null);
    setIsCreatingLesson(false);
  };

  const startNewMaterial = () => {
    setIsCreatingMaterial(true);
    setEditingMaterial({
      id: `mat-${Date.now()}`,
      title: '',
      category: 'Чек-лист',
      fileSize: '1.5 МБ',
      pagesOrDuration: '8 стр. · PDF',
      description: '',
      downloadUrl: '#download-new',
      updatedAt: '18 ноя 2026',
      contentPreview: [
        '1. Практический алгоритм самопомощи из нового модуля клуба.',
        '2. Контрольные вопросы для еженедельной сверки состояния.',
      ],
    });
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    onSaveMaterial(editingMaterial);
    setEditingMaterial(null);
    setIsCreatingMaterial(false);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcText.trim()) return;
    onSendBroadcast({
      title:
        bcTitle.trim() ||
        `Рассылка (${bcSegment === 'all' ? 'Вся база' : SEGMENT_LABELS[bcSegment]})`,
      targetSegment: bcSegment,
      text: bcText,
      mediaType: bcMediaType,
      mediaUrl: bcMediaType !== 'none' ? bcMediaUrl : undefined,
      buttonText: bcButtonText.trim() || undefined,
    });
    setBcSuccessBanner('Рассылка успешно отправлена выбранному сегменту через бота!');
    setBcTitle('');
    setTimeout(() => setBcSuccessBanner(null), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchSeg = userSegmentFilter === 'all' || u.segment === userSegmentFilter;
    const matchText =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.telegramId.includes(userSearch);
    return matchSeg && matchText;
  });

  const activeSubscribersCount = users.filter(
    (u) => u.segment === 'active' || u.segment === 'renewed' || u.segment === 'auto_renew_off'
  ).length;

  const totalRevenueRub = payments
    .filter((p) => p.status === 'Succeeded')
    .reduce((acc, item) => acc + item.amountRub, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Admin Top Summary Card */}
      <div className="bg-stone-900 text-stone-50 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-stone-400">Управление клубом</p>
            <h1 className="text-lg font-semibold text-white">Админ-панель</h1>
          </div>
          <div className="text-right tabular-nums">
            <p className="text-[11px] text-stone-400">Выручка ЮKassa</p>
            <p className="text-sm font-bold text-amber-300">
              {totalRevenueRub.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-center tabular-nums">
          <div>
            <p className="text-[10px] text-stone-400">Уроков</p>
            <p className="text-xs font-semibold text-white">{lessons.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400">Материалов</p>
            <p className="text-xs font-semibold text-white">{materials.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400">Активных подписок</p>
            <p className="text-xs font-semibold text-white">{activeSubscribersCount}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Admin Section Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          type="button"
          onClick={() => setSection('lessons')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
            section === 'lessons'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Уроки ({lessons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSection('materials')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
            section === 'materials'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Материалы ({materials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSection('users')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
            section === 'users'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>База ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSection('broadcasts')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
            section === 'broadcasts'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-700'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Рассылки</span>
        </button>

        <button
          type="button"
          onClick={() => setSection('automessages')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
            section === 'automessages'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-700'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Автосообщения (7)</span>
        </button>

        <button
          type="button"
          onClick={() => setSection('payments')}
          className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
            section === 'payments'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-700'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Оплаты ({payments.length})</span>
        </button>
      </div>

      {/* SECTION 1: LESSONS CMS */}
      {section === 'lessons' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                База видеоуроков
              </h2>
              <p className="text-[11px] text-stone-500">
                Добавление и редактирование без разработчика
              </p>
            </div>
            <button
              type="button"
              onClick={startNewLesson}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить урок</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 aspect-video rounded-lg overflow-hidden bg-stone-900 shrink-0 mt-0.5">
                    <ResilientImage
                      src={lesson.coverUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 tabular-nums">
                      <span className="font-semibold text-stone-800">
                        Урок #{lesson.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{lesson.duration}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-stone-900 leading-snug mt-0.5">
                      {lesson.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[11px] text-stone-500 truncate max-w-[180px]">
                    {lesson.module}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingLesson(false);
                        setEditingLesson(lesson);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-[11px] font-medium text-stone-800 flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Изменить</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteLesson(lesson.id)}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-red-50 text-stone-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: MATERIALS CMS */}
      {section === 'materials' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Дополнительные материалы
              </h2>
              <p className="text-[11px] text-stone-500">
                PDF-гайды, чек-листы и рабочие тетради
              </p>
            </div>
            <button
              type="button"
              onClick={startNewMaterial}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить PDF</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 tabular-nums">
                  <span className="font-semibold text-stone-800">{mat.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{mat.pagesOrDuration}</span>
                  <span aria-hidden="true">·</span>
                  <span>{mat.fileSize}</span>
                </div>
                <h3 className="text-xs font-semibold text-stone-900 leading-snug">
                  {mat.title}
                </h3>
                <p className="text-[11px] text-stone-600 line-clamp-2">
                  {mat.description}
                </p>
                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingMaterial(false);
                      setEditingMaterial(mat);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-[11px] font-medium text-stone-800 flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Редактировать</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMaterial(mat.id)}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-red-50 text-stone-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: USERS & 5 SEGMENTS */}
      {section === 'users' && (
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              База пользователей ({users.length})
            </h2>
            <p className="text-[11px] text-stone-500">
              Фильтрация по 5 сегментам и управление подписками
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
            <button
              type="button"
              onClick={() => setUserSegmentFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 ${
                userSegmentFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              Все ({users.length})
            </button>
            {(Object.keys(SEGMENT_LABELS) as SubscriptionSegment[]).map((seg) => {
              const count = users.filter((u) => u.segment === seg).length;
              return (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setUserSegmentFilter(seg)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 ${
                    userSegmentFilter === seg
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  {SEGMENT_LABELS[seg]} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Поиск по имени или @username..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{u.fullName}</p>
                    <p className="text-[11px] text-stone-500 font-mono tabular-nums">
                      {u.username} · ID {u.telegramId}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-900 tabular-nums">
                    {u.totalPaidRub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>След. списание: {u.nextChargeDate || '—'}</span>
                  <span>
                    {u.inChannel && u.inChat ? 'В канале и чате' : 'Доступ закрыт'}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">
                    Статус подписки (Сегмент):
                  </label>
                  <select
                    value={u.segment}
                    onChange={(e) =>
                      onUpdateUserSegment(u.id, e.target.value as SubscriptionSegment)
                    }
                    className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900"
                  >
                    {(Object.keys(SEGMENT_LABELS) as SubscriptionSegment[]).map((seg) => (
                      <option key={seg} value={seg}>
                        {SEGMENT_LABELS[seg]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: BROADCASTS */}
      {section === 'broadcasts' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Рассылка через Telegram-бота
            </h2>
            <p className="text-[11px] text-stone-500">
              По всей базе или выбранному сегменту (текст, фото, видео, кнопка)
            </p>
          </div>

          {bcSuccessBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-100 text-xs">
              {bcSuccessBanner}
            </div>
          )}

          <form
            onSubmit={handleBroadcastSubmit}
            className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3"
          >
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Сегмент получателей
              </label>
              <select
                value={bcSegment}
                onChange={(e) =>
                  setBcSegment(e.target.value as 'all' | SubscriptionSegment)
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium"
              >
                <option value="all">Вся база пользователей</option>
                {(Object.keys(SEGMENT_LABELS) as SubscriptionSegment[]).map((seg) => (
                  <option key={seg} value={seg}>
                    {SEGMENT_LABELS[seg]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Заголовок (для истории)
              </label>
              <input
                type="text"
                value={bcTitle}
                onChange={(e) => setBcTitle(e.target.value)}
                placeholder="Например: Анонс нового урока"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Текст сообщения
              </label>
              <textarea
                rows={4}
                required
                value={bcText}
                onChange={(e) => setBcText(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Вложение
                </label>
                <select
                  value={bcMediaType}
                  onChange={(e) =>
                    setBcMediaType(e.target.value as 'none' | 'photo' | 'video')
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                >
                  <option value="none">Без медиа</option>
                  <option value="photo">Фото</option>
                  <option value="video">Видео</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Текст кнопки
                </label>
                <input
                  type="text"
                  value={bcButtonText}
                  onChange={(e) => setBcButtonText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Отправить рассылку</span>
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-700">
              Отправленные рассылки ({broadcasts.length})
            </h3>
            {broadcasts.map((bc) => (
              <div
                key={bc.id}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-stone-500 tabular-nums">
                  <span>
                    {bc.targetSegment === 'all'
                      ? 'Вся база'
                      : SEGMENT_LABELS[bc.targetSegment]}
                  </span>
                  <span>
                    {bc.sentAt} · {bc.recipientsCount} чел.
                  </span>
                </div>
                <p className="text-xs font-semibold text-stone-900">{bc.title}</p>
                <p className="text-[11px] text-stone-600 line-clamp-2">{bc.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: 7 AUTOMATED MESSAGES */}
      {section === 'automessages' && (
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              7 автоматических сообщений бота
            </h2>
            <p className="text-[11px] text-stone-500">
              Самостоятельная настройка текстов и кнопок по триггерам
            </p>
          </div>

          <div className="space-y-3">
            {autoMessages.map((tpl) => (
              <div
                key={tpl.key}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2.5"
              >
                <div>
                  <h3 className="text-xs font-semibold text-stone-900">{tpl.title}</h3>
                  <p className="text-[10px] text-stone-500">{tpl.delayLabel}</p>
                </div>

                <textarea
                  rows={3}
                  value={tpl.text}
                  onChange={(e) =>
                    onUpdateAutoMessage({ ...tpl, text: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 leading-relaxed"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tpl.buttonText}
                    onChange={(e) =>
                      onUpdateAutoMessage({ ...tpl, buttonText: e.target.value })
                    }
                    className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
                    placeholder="Текст кнопки"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSavedTriggerKey(tpl.key);
                      setTimeout(() => setSavedTriggerKey(null), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{savedTriggerKey === tpl.key ? 'Сохранено' : 'Сохранить'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: PAYMENTS */}
      {section === 'payments' && (
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Оплаты и автосписания ЮKassa
            </h2>
            <p className="text-[11px] text-stone-500">
              Журнал транзакций по подписке 2 500 ₽ / мес
            </p>
          </div>

          <div className="space-y-2.5">
            {payments.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-stone-200 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-900">{p.userName}</p>
                  <p className="text-[11px] text-stone-500">
                    {p.type} · {p.createdAt}
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 truncate">
                    {p.yookassaId}
                  </p>
                </div>
                <div className="text-right shrink-0 tabular-nums">
                  <p className="text-sm font-bold text-stone-900">
                    {p.amountRub.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-[10px] font-medium text-emerald-700">Оплачено</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT LESSON SHEET */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end justify-center">
          <form
            onSubmit={handleLessonSubmit}
            className="bg-white w-full max-w-[440px] rounded-t-3xl p-5 space-y-3.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-semibold text-stone-900">
                {isCreatingLesson
                  ? `Новый видеоурок №${editingLesson.number}`
                  : `Редактирование урока №${editingLesson.number}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingLesson(null);
                  setIsCreatingLesson(false);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Название урока
              </label>
              <input
                type="text"
                required
                value={editingLesson.title}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, title: e.target.value })
                }
                placeholder="Введите название видеоурока"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Модуль
                </label>
                <input
                  type="text"
                  required
                  value={editingLesson.module}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, module: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Длительность
                </label>
                <input
                  type="text"
                  required
                  value={editingLesson.duration}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Обложка урока
              </label>
              <select
                value={editingLesson.coverUrl}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, coverUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              >
                {COVER_PRESETS.map((preset) => (
                  <option key={preset.url} value={preset.url}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Описание урока
              </label>
              <textarea
                rows={3}
                required
                value={editingLesson.description}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить урок</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL: CREATE / EDIT MATERIAL SHEET */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end justify-center">
          <form
            onSubmit={handleMaterialSubmit}
            className="bg-white w-full max-w-[440px] rounded-t-3xl p-5 space-y-3.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-semibold text-stone-900">
                {isCreatingMaterial ? 'Новый материал' : 'Редактирование материала'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingMaterial(null);
                  setIsCreatingMaterial(false);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Название материала
              </label>
              <input
                type="text"
                required
                value={editingMaterial.title}
                onChange={(e) =>
                  setEditingMaterial({ ...editingMaterial, title: e.target.value })
                }
                placeholder="Например: Чек-лист самопомощи"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Формат
              </label>
              <select
                value={editingMaterial.category}
                onChange={(e) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    category: e.target.value as MaterialItem['category'],
                  })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              >
                <option value="PDF-гайд">PDF-гайд</option>
                <option value="Чек-лист">Чек-лист</option>
                <option value="Рабочая тетрадь">Рабочая тетрадь</option>
                <option value="Аудиопрактика">Аудиопрактика</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Описание материала
              </label>
              <textarea
                rows={3}
                required
                value={editingMaterial.description}
                onChange={(e) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Сохранить материал</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
