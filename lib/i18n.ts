export const locales = ["he", "ar", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";
export const rtl = (l: Locale) => l === "he" || l === "ar";
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const localeNames: Record<Locale, string> = {
  he: "עברית",
  ar: "العربية",
  en: "English",
  ru: "Русский",
};

type Dict = {
  meta: { title: string; description: string; menuTitle: string; menuDescription: string; loyaltyTitle: string };
  nav: { menu: string; story: string; loyalty: string; visit: string; order: string; account: string };
  scenes: { title: string; text: string }[];
  scrollHint: string;
  signature: { title: string; text: string };
  process: { title: string; steps: string[] };
  menu: { title: string; text: string; all: string; points: string; order: string; fullMenu: string; note: string };
  story: { title: string; text: string[] };
  tasting: { title: string; text: string };
  loyalty: {
    title: string;
    text: string;
    rules: string[];
    tiers: { name: string; range: string; perk: string }[];
    soon: string;
    cta: string;
  };
  visit: { title: string; address: string; hoursTitle: string; hours: [string, string][]; phone: string; map: string; waze: string };
  footer: { rights: string; source: string };
  account: { title: string; email: string; send: string; sent: string; points: string; qr: string; history: string; logout: string; notReady: string };
  admin: { title: string; notReady: string };
  marquee: string[];
  stats: { value: string; label: string }[];
  club: { card: string; free: string; pts: string };
  insta: { text: string; cta: string };
  branches: { title: string; open: string; closed: string; city: string; since: string };
};

const he: Dict = {
  meta: {
    title: "קשטוטה חיפה | קינוח חלב ושמנת בדרך העצמאות 78",
    description: "קשטוטה חיפה: עוגה רכה ספוגה בחלב, שכבת שמנת עבה וקווי שוקולד. דרך העצמאות 78, פתוח כל יום מ-08:00.",
    menuTitle: "תפריט ומחירים | קשטוטה חיפה",
    menuDescription: "כל התפריט של קשטוטה חיפה עם מחירים: קשטוטה, עוגות, גלידה, שייקים ושתייה חמה.",
    loyaltyTitle: "מועדון לקוחות | קשטוטה חיפה",
  },
  nav: { menu: "תפריט", story: "הסיפור", loyalty: "מועדון", visit: "איך מגיעים", order: "להזמין", account: "החשבון שלי" },
  scenes: [
    { title: "קחו כפית. לאט.", text: "הביס הראשון הוא השקט. העוגה ספוגה בחלב עד הסוף ונמסה בפה." },
    { title: "ואז מגיע הענן.", text: "שכבה עבה של שמנת, מהסוג שמגרדים מהמכסה כשאף אחד לא מסתכל." },
    { title: "שוקולד שמצויר ביד", text: "הקווים נמשכים ביד, אז אין שתי תבניות שנראות בדיוק אותו דבר. וגם אין זמן להשוות." },
    { title: "קצת אדום מלמעלה.", text: "תות אחד, פרוס למניפה. בעיקר כדי שיהיה על מה לריב." },
    { title: "חלו יא חלו", text: "ככה אומרים \"מתוק, הו מתוק\" בערבית. גם אתם תגידו את זה." },
  ],
  scrollHint: "גללו למטה",
  signature: { title: "אלה שחוזרים אליהם", text: "ארבעת הטעמים האהובים שלנו, ואחריהם כל השאר. המשיכו לגלול." },
  process: {
    title: "ככה מכינים קשטוטה",
    steps: ["עוגה רכה בתחתית התבנית", "חלב ושמנת נשפכים מעל", "תוספת: לוטוס, אוראו, פירות ועוד", "קווי שוקולד, קרמל ושמנת לסיום"],
  },
  menu: {
    title: "תפריט",
    text: "המחירים בשקלים. כל שקל שווה נקודה במועדון.",
    all: "הכול",
    points: "נקודות",
    order: "להזמין",
    fullMenu: "לכל התפריט",
    note: "המחירים לפי התפריט של הסניף בנובמבר 2026. ייתכנו שינויים.",
  },
  story: {
    title: "קשטוטה בחיפה",
    text: [
      "פתחנו במרץ 2026 בדרך העצמאות 78, מול הנמל.",
      "יש לנו קשטוטה בכמה טעמים, עוגות, קרפים, גלידה ושייקים. פתוח כל יום מ-08:00 בבוקר עד חצות, ובסופ\"ש עד 01:00.",
    ],
  },
  tasting: { title: "טעימות חינם בימי שישי", text: "כל יום שישי בין 08:00 ל-10:00 אפשר לטעום את העוגות שלנו בחינם." },
  loyalty: {
    title: "מועדון קשטוטה",
    text: "צוברים נקודות על כל קנייה בסניף ומקבלים קינוחים במתנה.",
    rules: ["כל ₪1 = נקודה אחת", "350 נקודות = קשטוטה קלאסית במתנה", "50 נקודות מתנה בהצטרפות", "קינוח מתנה ביום ההולדת"],
    tiers: [
      { name: "Milk", range: "0 עד 499 נקודות", perk: "צבירה רגילה" },
      { name: "Cream", range: "500 עד 1,499", perk: "10% יותר נקודות" },
      { name: "Helw", range: "1,500 ומעלה", perk: "20% יותר נקודות" },
    ],
    soon: "המועדון נפתח בקרוב. הכללים עדיין יכולים להשתנות.",
    cta: "להצטרף",
  },
  visit: {
    title: "בואו לבקר",
    address: "דרך העצמאות 78, חיפה",
    hoursTitle: "שעות פתיחה",
    hours: [["ראשון עד רביעי", "08:00 עד 00:00"], ["חמישי עד שבת", "08:00 עד 01:00"]],
    phone: "052-909-0978",
    map: "לניווט",
    waze: "ניווט ב-Waze",
  },
  footer: { rights: "קשטוטה חיפה", source: "המחירים והתפריט לפי התפריט הדיגיטלי של הסניף." },
  account: {
    title: "החשבון שלי",
    email: "אימייל",
    send: "שלחו לי קישור כניסה",
    sent: "שלחנו קישור לאימייל.",
    points: "נקודות",
    qr: "הראו את הקוד בקופה",
    history: "היסטוריה",
    logout: "יציאה",
    notReady: "המועדון עוד לא פעיל. נעדכן כשייפתח.",
  },
  admin: { title: "ניהול", notReady: "החיבור למסד הנתונים עוד לא הוגדר." },
  marquee: ["עוד כפית אחת", "חלו יא חלו", "ספוג, לא יבש", "לילות בדרך העצמאות", "לחלוק או לא לחלוק"],
  stats: [
    { value: "58", label: "קינוחים ומשקאות בתפריט" },
    { value: "₪1", label: "שווה נקודה במועדון" },
    { value: "50", label: "נקודות מתנה בהצטרפות" },
    { value: "01:00", label: "פתוח עד מאוחר, חמישי עד שבת" },
  ],
  club: { card: "כרטיס מועדון", free: "ההצטרפות בחינם", pts: "50 נקודות" },
  insta: { text: "מה חדש בסניף, טעמים חדשים וטעימות של שישי. הכול עולה לאינסטגרם.", cta: "לעקוב באינסטגרם" },
  branches: { title: "הסניפים שלנו", open: "פתוח עכשיו", closed: "סגור עכשיו", city: "חיפה", since: "מאז מרץ 2026" },
};

const ar: Dict = {
  meta: {
    title: "قشطوطة حيفا | حلوى الحليب والقشطة في شارع العتسمؤوت 78",
    description: "قشطوطة حيفا: كيك طري مشبع بالحليب، طبقة قشطة سميكة وخطوط شوكولاتة. شارع العتسمؤوت 78، مفتوح يوميًا من 08:00.",
    menuTitle: "القائمة والأسعار | قشطوطة حيفا",
    menuDescription: "قائمة قشطوطة حيفا كاملة مع الأسعار: قشطوطة، كعكات، بوظة، ميلك شيك ومشروبات ساخنة.",
    loyaltyTitle: "نادي الزبائن | قشطوطة حيفا",
  },
  nav: { menu: "القائمة", story: "قصتنا", loyalty: "النادي", visit: "العنوان", order: "اطلب", account: "حسابي" },
  scenes: [
    { title: "خذوا معلقة. وعلى مهلكم.", text: "أول لقمة هي الأهدى. الكيك مشبّع بالحليب للآخر وبيذوب لحاله." },
    { title: "وبعدين بتيجي الغيمة.", text: "طبقة قشطة سميكة، من النوع اللي بتلحسوه عن الغطا لما ما حدا شايف." },
    { title: "شوكولاتة مرسومة باليد", text: "الخطوط بتنرسم باليد، فما في صينيتين متل بعض بالزبط. وأصلًا ما في وقت تقارنوا." },
    { title: "شوية أحمر من فوق.", text: "حبة فراولة وحدة، مفتوحة متل المروحة. بالأغلب عشان يكون في إشي تتخانقوا عليه." },
    { title: "حلّو يا حلّو", text: "هيك بنقولها إحنا. وأكيد رح تقولوها إنتو كمان." },
  ],
  scrollHint: "انزل لتحت",
  signature: { title: "اللي الكل بيرجعلها", text: "أربع نكهات بنحبها كتير، وبعدهم الباقي. كمّلوا نزول." },
  process: {
    title: "هيك بنحضّر القشطوطة",
    steps: ["كيك طري بقاع الصينية", "حليب وقشطة فوقه", "الإضافة: لوتس، أوريو، فواكه وغيرها", "خطوط شوكولاتة وكراميل وقشطة بالآخر"],
  },
  menu: {
    title: "القائمة",
    text: "الأسعار بالشيكل. كل شيكل يساوي نقطة في النادي.",
    all: "الكل",
    points: "نقاط",
    order: "اطلب",
    fullMenu: "القائمة كاملة",
    note: "الأسعار حسب قائمة الفرع في تشرين الثاني 2026 وقد تتغير.",
  },
  story: {
    title: "قشطوطة في حيفا",
    text: [
      "فتحنا في آذار 2026 بشارع العتسمؤوت 78، مقابل الميناء.",
      "عنا قشطوطة بأكثر من نكهة، كعكات، كريب، بوظة وميلك شيك. مفتوح كل يوم من 08:00 الصبح لنص الليل، وبنهاية الأسبوع لـ 01:00.",
    ],
  },
  tasting: { title: "تذوق مجاني يوم الجمعة", text: "كل جمعة من 08:00 لـ 10:00 فيك تتذوق كعكاتنا ببلاش." },
  loyalty: {
    title: "نادي قشطوطة",
    text: "اجمع نقاط على كل شراء بالفرع واحصل على حلويات هدية.",
    rules: ["كل ₪1 = نقطة", "350 نقطة = قشطوطة كلاسيك هدية", "50 نقطة هدية عند التسجيل", "حلوى هدية بعيد ميلادك"],
    tiers: [
      { name: "Milk", range: "0 إلى 499 نقطة", perk: "جمع عادي" },
      { name: "Cream", range: "500 إلى 1,499", perk: "نقاط أكثر بـ 10%" },
      { name: "Helw", range: "1,500 وأكثر", perk: "نقاط أكثر بـ 20%" },
    ],
    soon: "النادي بيفتح قريبًا. القواعد ممكن تتغير.",
    cta: "انضم",
  },
  visit: {
    title: "زورونا",
    address: "شارع العتسمؤوت 78، حيفا",
    hoursTitle: "ساعات الدوام",
    hours: [["الأحد حتى الأربعاء", "08:00 حتى 00:00"], ["الخميس حتى السبت", "08:00 حتى 01:00"]],
    phone: "052-909-0978",
    map: "افتح الخريطة",
    waze: "الطريق بـ Waze",
  },
  footer: { rights: "قشطوطة حيفا", source: "الأسعار والقائمة حسب القائمة الرقمية للفرع." },
  account: {
    title: "حسابي",
    email: "البريد الإلكتروني",
    send: "ابعتلي رابط الدخول",
    sent: "بعتنا رابط على بريدك.",
    points: "نقاط",
    qr: "فرجي الكود عند الصندوق",
    history: "السجل",
    logout: "خروج",
    notReady: "النادي لسا مش فعال. رح نخبرك لما يفتح.",
  },
  admin: { title: "الإدارة", notReady: "الاتصال بقاعدة البيانات لسا مش جاهز." },
  marquee: ["كمان معلقة", "حلّو يا حلّو", "مشبّع مش ناشف", "سهرات شارع العتسمؤوت", "بتشاركها ولا لأ؟"],
  stats: [
    { value: "58", label: "حلوى ومشروب في القائمة" },
    { value: "₪1", label: "يساوي نقطة في النادي" },
    { value: "50", label: "نقطة هدية عند التسجيل" },
    { value: "01:00", label: "مفتوح لوقت متأخر من الخميس للسبت" },
  ],
  club: { card: "بطاقة النادي", free: "الاشتراك مجاني", pts: "50 نقطة" },
  insta: { text: "جديد الفرع، نكهات جديدة وتذوق يوم الجمعة. كله بينزل على إنستغرام.", cta: "تابعونا على إنستغرام" },
  branches: { title: "فروعنا", open: "مفتوح الآن", closed: "مغلق الآن", city: "حيفا", since: "منذ آذار 2026" },
};

const en: Dict = {
  meta: {
    title: "Qashtota Haifa | Milk and cream dessert on Ha'atzma'ut Rd 78",
    description: "Qashtota Haifa: soft sponge soaked in milk, a thick layer of cream and chocolate lines. Ha'atzma'ut Rd 78, open daily from 8:00.",
    menuTitle: "Menu and prices | Qashtota Haifa",
    menuDescription: "The full Qashtota Haifa menu with prices: qashtota, cakes, ice cream, shakes and hot drinks.",
    loyaltyTitle: "Loyalty club | Qashtota Haifa",
  },
  nav: { menu: "Menu", story: "Story", loyalty: "Club", visit: "Visit", order: "Order", account: "My account" },
  scenes: [
    { title: "Take a spoon. Slowly.", text: "The first bite is the quiet one. The sponge is soaked in milk all the way through and gives way on its own." },
    { title: "Then the cloud arrives.", text: "A thick layer of cream, the kind you scrape off the lid when nobody is looking." },
    { title: "Chocolate, drawn by hand", text: "The lines are drawn by hand, so no two trays look quite the same. Not that anyone waits around to compare." },
    { title: "A little red on top.", text: "One strawberry, fanned out. Mostly so there's something to fight over." },
    { title: "Helw ya helw", text: "Arabic for \"sweet, oh sweet\". You'll be saying it too." },
  ],
  scrollHint: "Scroll down",
  signature: { title: "The ones people come back for", text: "Our four favourites first, then everything else. Keep scrolling." },
  process: {
    title: "How we make it",
    steps: ["Soft sponge at the bottom of the tray", "Milk and cream poured over", "Toppings: Lotus, Oreo, fruit and more", "Chocolate, caramel and cream lines to finish"],
  },
  menu: {
    title: "Menu",
    text: "Prices in shekels. Every shekel is one club point.",
    all: "All",
    points: "pts",
    order: "Order",
    fullMenu: "Full menu",
    note: "Prices follow the branch menu as of November 2026 and may change.",
  },
  story: {
    title: "Qashtota in Haifa",
    text: [
      "We opened in March 2026 at Ha'atzma'ut Road 78, across from the port.",
      "We make qashtota in several flavours, plus cakes, crêpes, ice cream and shakes. Open every day from 8:00 until midnight, and until 1:00 on weekends.",
    ],
  },
  tasting: { title: "Free tasting on Fridays", text: "Every Friday from 8:00 to 10:00 you can taste our cakes for free." },
  loyalty: {
    title: "Qashtota club",
    text: "Collect points on every purchase at the shop and get desserts on us.",
    rules: ["₪1 = 1 point", "350 points = a free classic qashtota", "50 points when you join", "A free dessert on your birthday"],
    tiers: [
      { name: "Milk", range: "0 to 499 points", perk: "Standard points" },
      { name: "Cream", range: "500 to 1,499", perk: "10% more points" },
      { name: "Helw", range: "1,500 and up", perk: "20% more points" },
    ],
    soon: "The club opens soon. Rules may still change.",
    cta: "Join",
  },
  visit: {
    title: "Visit us",
    address: "Ha'atzma'ut Rd 78, Haifa",
    hoursTitle: "Opening hours",
    hours: [["Sunday to Wednesday", "08:00 to 00:00"], ["Thursday to Saturday", "08:00 to 01:00"]],
    phone: "052-909-0978",
    map: "Get directions",
    waze: "Route in Waze",
  },
  footer: { rights: "Qashtota Haifa", source: "Menu and prices follow the branch's digital menu." },
  account: {
    title: "My account",
    email: "Email",
    send: "Send me a login link",
    sent: "We sent a link to your email.",
    points: "points",
    qr: "Show this code at the counter",
    history: "History",
    logout: "Log out",
    notReady: "The club isn't live yet. We'll let you know when it opens.",
  },
  admin: { title: "Admin", notReady: "The database connection isn't set up yet." },
  marquee: ["One more spoon", "Helw ya helw", "Soaked, never dry", "Late nights on Ha'atzma'ut", "Share it, or don't"],
  stats: [
    { value: "58", label: "desserts and drinks on the menu" },
    { value: "₪1", label: "earns one club point" },
    { value: "50", label: "welcome points when you join" },
    { value: "01:00", label: "late nights, Thursday to Saturday" },
  ],
  club: { card: "Club card", free: "Joining is free", pts: "50 pts" },
  insta: { text: "New flavours, branch news and Friday tastings. It all goes up on Instagram.", cta: "Follow on Instagram" },
  branches: { title: "Our branches", open: "Open now", closed: "Closed now", city: "Haifa", since: "Since March 2026" },
};

const ru: Dict = {
  meta: {
    title: "Каштота Хайфа | Десерт из молока и сливок на Ха-Ацмаут, 78",
    description: "Каштота Хайфа: мягкий бисквит, пропитанный молоком, толстый слой сливок и шоколадные линии. Ха-Ацмаут, 78, каждый день с 8:00.",
    menuTitle: "Меню и цены | Каштота Хайфа",
    menuDescription: "Полное меню Каштота Хайфа с ценами: каштота, торты, мороженое, шейки и горячие напитки.",
    loyaltyTitle: "Клуб постоянных гостей | Каштота Хайфа",
  },
  nav: { menu: "Меню", story: "О нас", loyalty: "Клуб", visit: "Адрес", order: "Заказать", account: "Мой аккаунт" },
  scenes: [
    { title: "Возьмите ложку. Не спешите.", text: "С первой ложкой все замолкают. Бисквит пропитан молоком насквозь и тает во рту." },
    { title: "А потом приходит облако.", text: "Толстый слой сливок, тот самый, который соскребают с крышки, пока никто не видит." },
    { title: "Шоколад, нарисованный от руки", text: "Линии рисуют от руки, поэтому двух одинаковых противней не бывает. Хотя сравнивать всё равно никто не успевает." },
    { title: "Немного красного сверху.", text: "Одна клубника веером. В основном чтобы было из-за чего спорить." },
    { title: "Хелу я хелу", text: "По-арабски это «сладко, ах как сладко». Скоро вы тоже будете так говорить." },
  ],
  scrollHint: "Листайте вниз",
  signature: { title: "К ним возвращаются", text: "Сначала наши четыре любимых вкуса, а за ними все остальные. Листайте дальше." },
  process: {
    title: "Как мы её готовим",
    steps: ["Мягкий бисквит на дне формы", "Сверху молоко и сливки", "Топпинг: Lotus, Oreo, фрукты и другое", "В конце линии шоколада, карамели и сливок"],
  },
  menu: {
    title: "Меню",
    text: "Цены в шекелях. Каждый шекель = один балл в клубе.",
    all: "Все",
    points: "баллов",
    order: "Заказать",
    fullMenu: "Всё меню",
    note: "Цены по меню филиала на ноябрь 2026 года и могут меняться.",
  },
  story: {
    title: "Каштота в Хайфе",
    text: [
      "Мы открылись в марте 2026 года на улице Ха-Ацмаут, 78, напротив порта.",
      "У нас каштота нескольких вкусов, торты, блины, мороженое и шейки. Открыто каждый день с 8:00 до полуночи, в выходные до 1:00.",
    ],
  },
  tasting: { title: "Бесплатная дегустация по пятницам", text: "Каждую пятницу с 8:00 до 10:00 наши торты можно попробовать бесплатно." },
  loyalty: {
    title: "Клуб Каштота",
    text: "Копите баллы за покупки в кафе и получайте десерты в подарок.",
    rules: ["₪1 = 1 балл", "350 баллов = классическая каштота в подарок", "50 баллов за регистрацию", "Десерт в подарок на день рождения"],
    tiers: [
      { name: "Milk", range: "от 0 до 499 баллов", perk: "Обычное начисление" },
      { name: "Cream", range: "от 500 до 1 499", perk: "На 10% больше баллов" },
      { name: "Helw", range: "от 1 500", perk: "На 20% больше баллов" },
    ],
    soon: "Клуб скоро откроется. Правила ещё могут измениться.",
    cta: "Вступить",
  },
  visit: {
    title: "Приходите",
    address: "Ха-Ацмаут, 78, Хайфа",
    hoursTitle: "Часы работы",
    hours: [["Вс, пн, вт, ср", "08:00 до 00:00"], ["Чт, пт, сб", "08:00 до 01:00"]],
    phone: "052-909-0978",
    map: "Построить маршрут",
    waze: "Маршрут в Waze",
  },
  footer: { rights: "Каштота Хайфа", source: "Меню и цены по цифровому меню филиала." },
  account: {
    title: "Мой аккаунт",
    email: "Email",
    send: "Прислать ссылку для входа",
    sent: "Мы отправили ссылку на вашу почту.",
    points: "баллов",
    qr: "Покажите код на кассе",
    history: "История",
    logout: "Выйти",
    notReady: "Клуб ещё не работает. Мы сообщим, когда он откроется.",
  },
  admin: { title: "Управление", notReady: "Подключение к базе данных ещё не настроено." },
  marquee: ["Ещё одну ложку", "Хелу я хелу", "Сочный, а не сухой", "Ночи на Ха-Ацмаут", "Поделиться или нет"],
  stats: [
    { value: "58", label: "десертов и напитков в меню" },
    { value: "₪1", label: "это один балл в клубе" },
    { value: "50", label: "баллов в подарок при вступлении" },
    { value: "01:00", label: "работаем допоздна с четверга по субботу" },
  ],
  club: { card: "Карта клуба", free: "Вступление бесплатное", pts: "50 баллов" },
  insta: { text: "Новые вкусы, новости филиала и пятничные дегустации. Всё это выходит в Instagram.", cta: "Подписаться в Instagram" },
  branches: { title: "Наши филиалы", open: "Сейчас открыто", closed: "Сейчас закрыто", city: "Хайфа", since: "С марта 2026" },
};

export const dict: Record<Locale, Dict> = { he, ar, en, ru };
export type { Dict };
