export type SubscriptionSegment =
  | 'not_paid'
  | 'active'
  | 'auto_renew_off'
  | 'expired'
  | 'renewed';

export const SEGMENT_LABELS: Record<SubscriptionSegment, string> = {
  not_paid: 'Не оплатили подписку',
  active: 'Оплатили, подписка активна',
  auto_renew_off: 'Отключили автопродление',
  expired: 'Подписка закончилась',
  renewed: 'Повторно оформили подписку',
};

export interface Lesson {
  id: string;
  number: number;
  title: string;
  module: string;
  duration: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  keyTakeaways: string[];
  isFreePreview?: boolean;
  publishedAt: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  category: 'PDF-гайд' | 'Чек-лист' | 'Рабочая тетрадь' | 'Аудиопрактика';
  fileSize: string;
  pagesOrDuration: string;
  description: string;
  downloadUrl: string;
  updatedAt: string;
  contentPreview: string[];
}

export interface ClubUser {
  id: string;
  telegramId: string;
  username: string;
  fullName: string;
  segment: SubscriptionSegment;
  joinedAt: string;
  nextChargeDate: string | null;
  totalPaidRub: number;
  yookassaPaymentMethodId: string | null;
  inChannel: boolean;
  inChat: boolean;
}

export type TriggerKey =
  | 'bot_started_no_pay'
  | 'payment_success'
  | 'upcoming_charge'
  | 'payment_failed'
  | 'auto_renew_disabled'
  | 'subscription_expired'
  | 'subscription_renewed';

export interface AutoMessageTemplate {
  key: TriggerKey;
  title: string;
  delayLabel: string;
  text: string;
  buttonText: string;
  buttonAction: 'open_pay' | 'open_miniapp' | 'open_community' | 'renew_sub';
  enabled: boolean;
}

export interface BroadcastItem {
  id: string;
  title: string;
  targetSegment: 'all' | SubscriptionSegment;
  text: string;
  mediaType: 'none' | 'photo' | 'video';
  mediaUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  sentAt: string;
  recipientsCount: number;
}

export interface PaymentRecord {
  id: string;
  yookassaId: string;
  userId: string;
  userName: string;
  userHandle: string;
  amountRub: number;
  type: 'Первичная оплата' | 'Автосписание (рекуррент)' | 'Повторное оформление';
  status: 'Succeeded' | 'Canceled';
  createdAt: string;
}

export interface BotChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  mediaType?: 'none' | 'photo' | 'video';
  mediaUrl?: string;
  buttonText?: string;
  buttonAction?: 'open_pay' | 'open_miniapp' | 'open_community' | 'renew_sub' | 'show_program';
  triggerTag?: string;
}

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les-1',
    number: 1,
    title: 'Тревога как компас: как перестать гасить симптомы и услышать сигнал',
    module: 'Модуль 1 · Базовая саморегуляция',
    duration: '34:15',
    description:
      'Разбираем нейробиологию фоновой тревоги. Почему попытки «взять себя в руки» усиливают панику и как перевести беспредметную тревогу в конкретную точку выбора.',
    coverUrl: '/src/assets/images/lesson_cover_anxiety_1795006010043.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    keyTakeaways: [
      'Отличие первичной адаптивной тревоги от вторичной накрутки',
      'Техника «Заземление через 3 опоры» за 90 секунд',
      'Протокол разбора катастрофических сценариев без токсичного позитива',
    ],
    isFreePreview: true,
    publishedAt: '01 ноя 2026',
  },
  {
    id: 'les-2',
    number: 2,
    title: 'Личные границы без чувства вины и разрушения близких отношений',
    module: 'Модуль 1 · Базовая саморегуляция',
    duration: '41:20',
    description:
      'Как говорить «нет» родителям, партнёру и коллегам без агрессии, оправданий и трёхдневного самобичевания. Разбор слияния и эмоционального шантажа.',
    coverUrl: '/src/assets/images/lesson_cover_boundaries_1795006010496.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    keyTakeaways: [
      'Почему вина при защите границ — это маркер сепарации, а не ошибки',
      'Формула мягкого, но окончательного отказа из 2 предложений',
      'Что делать, когда близкий человек обижается на ваши границы',
    ],
    publishedAt: '04 ноя 2026',
  },
  {
    id: 'les-3',
    number: 3,
    title: 'Тень и Внутренний Критик: легализация «плохих» эмоций',
    module: 'Модуль 2 · Глубинная психология',
    duration: '38:50',
    description:
      'Зависть, злость, стыд и жадность — где в них спрятана ваша витальность. Практика разотождествления с карающим родительским голосом внутри.',
    coverUrl: '/src/assets/images/lesson_cover_shadow_1795006011937.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    keyTakeaways: [
      'Как распознать интроекты: чей голос звучит в вашей голове',
      'Карта теневых импульсов: как превратить зависть в навигатор целей',
      'Упражнение «Амнистия неидеальности»',
    ],
    publishedAt: '07 ноя 2026',
  },
  {
    id: 'les-4',
    number: 4,
    title: 'Эмоциональное выгорание и синдром отличника: выход из гонки',
    module: 'Модуль 2 · Глубинная психология',
    duration: '45:10',
    description:
      'Когда отдых больше не восстанавливает. Разбираем нарциссическое расширение, страх оказаться «обычным» и протокол бережного возвращения энергии.',
    coverUrl: '/src/assets/images/lesson_cover_burnout_1795006013634.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4',
    keyTakeaways: [
      '3 стадии истощения нервной системы и почему отпуск не помогает на 3-й стадии',
      'Ревизия скрытых энергетических дыр и незакрытых обязательств',
      'Микро-ритуалы восстановления дофаминовой чувствительности',
    ],
    publishedAt: '10 ноя 2026',
  },
  {
    id: 'les-5',
    number: 5,
    title: 'Типы привязанности во взрослых отношениях: тревожный и избегающий танец',
    module: 'Модуль 3 · Отношения и близость',
    duration: '52:00',
    description:
      'Почему нас тянет к эмоционально недоступным партнёрам, как устроена ловушка «догоняющий — убегающий» и как формировать надёжную привязанность.',
    coverUrl: '/src/assets/images/lesson_cover_boundaries_1795006010496.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    keyTakeaways: [
      'Диагностика своего ведущего паттерна привязанности в стрессе',
      'Стоп-краны при активации страха отвержения',
      'Как просить о поддержке прямо, а не через претензию или молчание',
    ],
    publishedAt: '12 ноя 2026',
  },
  {
    id: 'les-6',
    number: 6,
    title: 'Сепарация от родителей во взрослом возрасте: свобода быть собой',
    module: 'Модуль 3 · Отношения и близость',
    duration: '39:40',
    description:
      'Как перестать ждать одобрения мамы и папы в 30+ лет, выйти из треугольника Карпмана и завершить внутренний подростковый бунт.',
    coverUrl: '/src/assets/images/lesson_cover_anxiety_1795006010043.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    keyTakeaways: [
      '4 уровня сепарации: функциональная, эмоциональная, ценностная, конфликтная',
      'Отказ от иллюзии «переделать родителей»',
      'Практика возвращения чужой ответственности',
    ],
    publishedAt: '14 ноя 2026',
  },
  {
    id: 'les-7',
    number: 7,
    title: 'Психосоматика зажимов: о чём молчит тело, когда голова всё понимает',
    module: 'Модуль 4 · Телесность и опора',
    duration: '31:25',
    description:
      'Связь подавленного гнева и контроля с мышечным панцирем. Практический разбор челюстного, грудного и диафрагмального блоков.',
    coverUrl: '/src/assets/images/lesson_cover_burnout_1795006013634.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    keyTakeaways: [
      'Карта телесных маркеров подавленных реакций «бей / беги / замри»',
      'Практика безопасного завершения стресс-цикла через дыхание и движение',
      'Как вернуть контакт с телесными сигналами усталости и сытости',
    ],
    publishedAt: '15 ноя 2026',
  },
  {
    id: 'les-8',
    number: 8,
    title: 'Синдром самозванца и страх больших денег: психология проявленности',
    module: 'Модуль 4 · Телесность и опора',
    duration: '44:05',
    description:
      'Почему при росте дохода или публичности включается самосаботаж. Разбор страха зависти, стыда за успех и права занимать своё место.',
    coverUrl: '/src/assets/images/lesson_cover_shadow_1795006011937.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    keyTakeaways: [
      'Присвоение реального опыта вместо обесценивания результатов',
      'Работа со страхом разоблачения и критики в соцсетях и профессии',
      'Финансовый потолок как защитный механизм психики',
    ],
    publishedAt: '16 ноя 2026',
  },
  {
    id: 'les-9',
    number: 9,
    title: 'Внутренняя взрослая опора: жизнь без костылей и вечного поиска гуру',
    module: 'Модуль 4 · Телесность и опора',
    duration: '48:30',
    description:
      'Финальный базовый урок стартового блока. Как выстроить устойчивую систему самоподдержки, выдерживать неопределённость и быть автором своей жизни.',
    coverUrl: '/src/assets/images/lesson_cover_anxiety_1795006010043.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4',
    keyTakeaways: [
      'Архитектура Внутреннего Взрослого: баланс дисциплины и сострадания',
      'Как проходить кризисы и потери без разрушения самооценки',
      'Личный манифест психологической гигиены на каждый месяц',
    ],
    publishedAt: '18 ноя 2026',
  },
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    title: 'Дневник КПТ-самоанализа автоматических мыслей (шаблон на 30 дней)',
    category: 'Рабочая тетрадь',
    fileSize: '2.4 МБ',
    pagesOrDuration: '18 стр. · PDF',
    description:
      'Пошаговая таблица СМЭР (Ситуация — Мысль — Эмоция — Реакция) с примерами заполнения и списком из 12 когнитивных искажений.',
    downloadUrl: '#download-cbt-diary',
    updatedAt: '15 ноя 2026',
    contentPreview: [
      '1. Триггерная ситуация: фиксируем только факты без оценок («Руководитель написал: зайди в 15:00»).',
      '2. Автоматическая мысль: что самое страшное дорисовало воображение («Меня хотят уволить»).',
      '3. Уровень веры в мысль (0–100%) и телесный отклик (сжатие в груди, холод в пальцах).',
      '4. Проверка реальности: 3 аргумента «за» и 3 рациональных альтернативных объяснения.',
    ],
  },
  {
    id: 'mat-2',
    title: 'Чек-лист экстренной самопомощи при острой тревоге и панике',
    category: 'Чек-лист',
    fileSize: '1.1 МБ',
    pagesOrDuration: '4 стр. · PDF',
    description:
      'Карманный протокол на 1 экран телефона: дыхание по квадрату 4-7-8, техника 5-4-3-2-1 и фразы-якоря для возвращения в реальность.',
    downloadUrl: '#download-panic-checklist',
    updatedAt: '12 ноя 2026',
    contentPreview: [
      'Шаг 1: Назовите вслух 5 предметов одного цвета вокруг вас и коснитесь холодной поверхности.',
      'Шаг 2: Удлините выдох в два раза относительно вдоха (вдох на 4 счёта, выдох на 8).',
      'Шаг 3: Напомните себе: «Это выброс адреналина. Это неприятно, но абсолютно безопасно и пройдёт через 7 минут».',
    ],
  },
  {
    id: 'mat-3',
    title: 'Атлас личных границ: 25 готовых экологичных формулировок отказа',
    category: 'PDF-гайд',
    fileSize: '3.6 МБ',
    pagesOrDuration: '24 стр. · PDF',
    description:
      'Шпаргалка для сложных диалогов с родственниками, клиентами, начальством и друзьями. От мягкого переноса до жёсткого пресечения манипуляций.',
    downloadUrl: '#download-boundaries-guide',
    updatedAt: '10 ноя 2026',
    contentPreview: [
      'Для семьи: «Я очень тебя люблю, но решение по этому вопросу я принимаю самостоятельно. Давай сменим тему».',
      'Для работы: «Я могу взять эту задачу в приоритет, если мы перенесём дедлайн по текущему проекту X на четверг».',
      'Против непрошеных советов: «Спасибо за заботу, сейчас мне важна просто поддержка, а не план действий».',
    ],
  },
  {
    id: 'mat-4',
    title: 'Трекер ресурсного состояния и профилактики эмоционального выгорания',
    category: 'Чек-лист',
    fileSize: '1.8 МБ',
    pagesOrDuration: '6 стр. · PDF',
    description:
      'Еженедельный аудит батарейки: сон, сенсорная разгрузка, баланс «надо / хочу» и ранние сигналы перегрузки нервной системы.',
    downloadUrl: '#download-burnout-tracker',
    updatedAt: '16 ноя 2026',
    contentPreview: [
      'Красные флаги недели: цинизм, раздражение на мелкие просьбы, думскроллинг перед сном более 45 минут.',
      'Зелёные зоны восстановления: 60 минут без экранов, физическая разрядка, 1 завершённое микро-дело.',
    ],
  },
  {
    id: 'mat-5',
    title: 'Карта типов привязанности и триггеров в паре',
    category: 'PDF-гайд',
    fileSize: '4.2 МБ',
    pagesOrDuration: '32 стр. · PDF',
    description:
      'Наглядные схемы циклов конфликта между тревожным и избегающим партнёрами + скрипт конструктивного диалога по методу ЭФТ.',
    downloadUrl: '#download-attachment-map',
    updatedAt: '18 ноя 2026',
    contentPreview: [
      'Цикл преследования-отстранения: как остановить эскалацию в первые 3 минуты ссоры.',
      'Перевод с языка претензий («Тебе вечно некогда») на язык уязвимости («Я скучаю и мне страшно потерять контакт»).',
    ],
  },
];

export const INITIAL_USERS: ClubUser[] = [
  {
    id: 'usr-1',
    telegramId: '419283741',
    username: '@alina_psy_care',
    fullName: 'Алина Воронцова (Вы — Тест-режим)',
    segment: 'active',
    joinedAt: '18 окт 2026',
    nextChargeDate: '18 дек 2026',
    totalPaidRub: 5000,
    yookassaPaymentMethodId: 'pm_yookassa_98f2a1c0',
    inChannel: true,
    inChat: true,
  },
  {
    id: 'usr-2',
    telegramId: '582910442',
    username: '@dmitry_k',
    fullName: 'Дмитрий Ковалев',
    segment: 'not_paid',
    joinedAt: '17 ноя 2026',
    nextChargeDate: null,
    totalPaidRub: 0,
    yookassaPaymentMethodId: null,
    inChannel: false,
    inChat: false,
  },
  {
    id: 'usr-3',
    telegramId: '309182311',
    username: '@marina_sokol',
    fullName: 'Марина Соколова',
    segment: 'auto_renew_off',
    joinedAt: '25 окт 2026',
    nextChargeDate: '25 ноя 2026 (отключено)',
    totalPaidRub: 2500,
    yookassaPaymentMethodId: null,
    inChannel: true,
    inChat: true,
  },
  {
    id: 'usr-4',
    telegramId: '774129830',
    username: '@evgeny_morozov',
    fullName: 'Евгений Морозов',
    segment: 'expired',
    joinedAt: '10 сен 2026',
    nextChargeDate: null,
    totalPaidRub: 2500,
    yookassaPaymentMethodId: null,
    inChannel: false,
    inChat: false,
  },
  {
    id: 'usr-5',
    telegramId: '612094857',
    username: '@ksenia_lebedeva',
    fullName: 'Ксения Лебедева',
    segment: 'renewed',
    joinedAt: '02 сен 2026',
    nextChargeDate: '15 дек 2026',
    totalPaidRub: 7500,
    yookassaPaymentMethodId: 'pm_yookassa_44b7e912',
    inChannel: true,
    inChat: true,
  },
  {
    id: 'usr-6',
    telegramId: '883412098',
    username: '@olga_romanova',
    fullName: 'Ольга Романова',
    segment: 'active',
    joinedAt: '05 ноя 2026',
    nextChargeDate: '05 дек 2026',
    totalPaidRub: 2500,
    yookassaPaymentMethodId: 'pm_yookassa_71c3d804',
    inChannel: true,
    inChat: true,
  },
  {
    id: 'usr-7',
    telegramId: '912038475',
    username: '@artem_vlasov',
    fullName: 'Артём Власов',
    segment: 'not_paid',
    joinedAt: '18 ноя 2026',
    nextChargeDate: null,
    totalPaidRub: 0,
    yookassaPaymentMethodId: null,
    inChannel: false,
    inChat: false,
  },
];

export const INITIAL_AUTO_MESSAGES: AutoMessageTemplate[] = [
  {
    key: 'bot_started_no_pay',
    title: '1. Запустил бота, но не оплатил',
    delayLabel: 'Через 15 минут после /start без оплаты',
    text: 'Привет! Вы заглянули в клуб «Психология для психов», но остановились в шаге от входа.\n\nВнутри вас уже ждут 9 глубоких видеоуроков без воды, рабочие тетради КПТ и бережное закрытое комьюнити.\n\nОткройте Mini App, чтобы посмотреть полную программу и бесплатный вводный фрагмент.',
    buttonText: 'Открыть программу в Mini App',
    buttonAction: 'open_miniapp',
    enabled: true,
  },
  {
    key: 'payment_success',
    title: '2. Оплатил подписку',
    delayLabel: 'Мгновенно после вебхука ЮKassa (payment.succeeded)',
    text: 'Добро пожаловать в клуб «Психология для психов»! Ваша подписка (2 500 ₽/мес) успешно активирована.\n\nВам открыт полный доступ ко всем 9 видеоурокам, PDF-материалам, а также персональные приглашения в наш закрытый канал и чат участников.',
    buttonText: 'Войти в Mini App клуба',
    buttonAction: 'open_miniapp',
    enabled: true,
  },
  {
    key: 'upcoming_charge',
    title: '3. Скоро следующее списание',
    delayLabel: 'За 3 дня до даты автопродления',
    text: 'Напоминаем с заботой: через 3 дня ваша подписка на клуб «Психология для психов» автоматически продлится на следующий месяц (2 500 ₽).\n\nВ новом месяце мы разбираем тему глубинных сценариев и добавляем 3 новых практикума. Управлять подпиской можно в Mini App.',
    buttonText: 'Проверить статус в Mini App',
    buttonAction: 'open_miniapp',
    enabled: true,
  },
  {
    key: 'payment_failed',
    title: '4. Не удалось продлить подписку',
    delayLabel: 'При ошибке автосписания ЮKassa (недостаточно средств)',
    text: 'Не получилось автоматически продлить вашу подписку на клуб «Психология для психов» (2 500 ₽) — возможно, на карте недостаточно средств.\n\nМы сохранили за вами доступ ещё на 24 часа. Пожалуйста, обновите оплату в Mini App, чтобы не вылететь из закрытого чата и канала.',
    buttonText: 'Оплатить и сохранить доступ',
    buttonAction: 'open_pay',
    enabled: true,
  },
  {
    key: 'auto_renew_disabled',
    title: '5. Отключил автопродление',
    delayLabel: 'Сразу после отключения автосписания в Mini App',
    text: 'Вы отключили автопродление подписки. Никаких автоматических списаний больше не будет.\n\nВаш полный доступ к урокам, материалам, каналу и чату продолжит действовать до конца оплаченного периода. Вы сможете включить продление обратно в любой момент.',
    buttonText: 'Управление подпиской',
    buttonAction: 'open_miniapp',
    enabled: true,
  },
  {
    key: 'subscription_expired',
    title: '6. Подписка закончилась',
    delayLabel: 'В день окончания срока (авто-исключение из канала и чата)',
    text: 'Срок вашей подписки на клуб «Психология для психов» завершился. Бот временно закрыл доступ к урокам, каналу и чату участников.\n\nМы будем рады вашему возвращению! Как только вы будете готовы продолжить практику — оформите подписку повторно в один клик.',
    buttonText: 'Восстановить доступ (2 500 ₽)',
    buttonAction: 'renew_sub',
    enabled: true,
  },
  {
    key: 'subscription_renewed',
    title: '7. Повторно оформил подписку',
    delayLabel: 'Мгновенно после повторной оплаты бывшим участником',
    text: 'С возвращением в «Психология для психов»! Рады снова видеть вас среди своих.\n\nВсе новые уроки и материалы уже доступны в Mini App, а бот сгенерировал для вас свежие ссылки для возвращения в закрытый канал и чат.',
    buttonText: 'Перейти в канал и чат',
    buttonAction: 'open_community',
    enabled: true,
  },
];

export const INITIAL_BROADCASTS: BroadcastItem[] = [
  {
    id: 'bc-1',
    title: 'Анонс нового урока №9 + рабочая тетрадь по опоре',
    targetSegment: 'active',
    text: 'Участники клуба, в Mini App загружен 9-й видеоурок «Внутренняя взрослая опора: жизнь без костылей» и новая рабочая тетрадь. Приятного просмотра и ждём ваши инсайты в закрытом чате!',
    mediaType: 'photo',
    mediaUrl: '/src/assets/images/lesson_cover_anxiety_1795006010043.jpg',
    buttonText: 'Смотреть урок в Mini App',
    sentAt: '18 ноя 2026, 11:20',
    recipientsCount: 142,
  },
  {
    id: 'bc-2',
    title: 'Спецпредложение для тех, кто ещё не решился вступить',
    targetSegment: 'not_paid',
    text: 'Вы интересовались клубом «Психология для психов». Мы открыли бесплатный демо-просмотр 1-го урока про тревогу прямо внутри Mini App — заходите познакомиться с форматом без оплаты!',
    mediaType: 'none',
    buttonText: 'Смотреть демо-урок',
    sentAt: '16 ноя 2026, 18:00',
    recipientsCount: 84,
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-101',
    yookassaId: '2e91f840-000f-5000-9000-1b68e7129a01',
    userId: 'usr-1',
    userName: 'Алина Воронцова',
    userHandle: '@alina_psy_care',
    amountRub: 2500,
    type: 'Автосписание (рекуррент)',
    status: 'Succeeded',
    createdAt: '18 ноя 2026, 09:00',
  },
  {
    id: 'pay-102',
    yookassaId: '2e91c112-000f-5000-8000-4a92b8412f44',
    userId: 'usr-5',
    userName: 'Ксения Лебедева',
    userHandle: '@ksenia_lebedeva',
    amountRub: 2500,
    type: 'Повторное оформление',
    status: 'Succeeded',
    createdAt: '15 ноя 2026, 14:32',
  },
  {
    id: 'pay-103',
    yookassaId: '2e88a409-000f-5000-a000-9c41d2038e19',
    userId: 'usr-6',
    userName: 'Ольга Романова',
    userHandle: '@olga_romanova',
    amountRub: 2500,
    type: 'Первичная оплата',
    status: 'Succeeded',
    createdAt: '05 ноя 2026, 19:14',
  },
  {
    id: 'pay-104',
    yookassaId: '2e79b201-000f-5000-b000-3d81a9042c77',
    userId: 'usr-3',
    userName: 'Марина Соколова',
    userHandle: '@marina_sokol',
    amountRub: 2500,
    type: 'Первичная оплата',
    status: 'Succeeded',
    createdAt: '25 окт 2026, 12:48',
  },
];
