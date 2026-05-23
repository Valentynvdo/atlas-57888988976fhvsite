import React from "react";
import { Zap, Bot, Eye, Brain, EyeOff, Shield, RefreshCw } from "lucide-react";

export default function AtlasComparison() {
  return (
    <section
      id="comparison"
      style={{
        padding: "100px 5%",
        background: "#030303",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2
            className="shimmer-text"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: 20,
              background: "linear-gradient(120deg, #ffffff 0%, #d4dcff 35%, #b8f0ff 70%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            Звичайні ШІ vs. ATLAS
          </h2>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", maxWidth: 800, margin: "0 auto", lineHeight: 1.6 }}>
            Чому це не просто чат-бот, а ваша нова операційна система.
            <br />
            Більшість штучних інтелектів сьогодні — це просто вкладка у браузері. Вони чекають, поки ви до них звернетесь. Вони нічого не знають про ваш комп'ютер, не бачать вас і обмежені тим, що заклали в них розробники. <strong style={{ color: "#00E5FF" }}>ATLAS — це дещо зовсім інше.</strong>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Item 1 */}
          <ComparisonItem 
            title="1. Формат взаємодії: Пасивність проти Присутності"
            normal="Щоб щось запитати, вам потрібно відкрити додаток, надрукувати текст або натиснути кнопку мікрофона і чекати на відповідь."
            atlas="Завжди поруч. Завдяки технології WebRTC VAD, він постійно (але безпечно) слухає простір навколо. Вам достатньо просто сказати команду вголос, знаходячись у кімнаті. Він розуміє, коли ви звертаєтесь до нього, а коли просто розмовляєте по телефону."
          />
          {/* Item 2 */}
          <ComparisonItem 
            title="2. Зір та Розпізнавання: Сліпота проти FaceID"
            normal="Бачить лише те, що ви йому вручну завантажите як картинку."
            atlas="Має власний локальний FaceID (на базі InsightFace). Щойно ви сідаєте за комп'ютер, він без жодного кліку розпізнає вас. Він вітається з вами на ім'я, відрізняє вас від гостей та підлаштовує свій контекст. При цьому ваші біометричні дані ніколи не відправляються в інтернет — усе обробляється локально на вашому комп'ютері."
          />
          {/* Item 3 */}
          <ComparisonItem 
            title="3. Навички: Обмеженість проти Саморозвитку (Еволюція)"
            normal='Якщо ви попросите його виконати специфічну дію на вашому комп'ютері, він відповість: "Вибачте, я лише мовна модель і не маю доступу до вашої системи".'
            atlas="Вміє писати код для самого себе! Завдяки модулю evolution.py, якщо ви даєте команду, яку він ще не вміє робити, він не здається. ATLAS самостійно аналізує завдання, генерує новий Python-скрипт, впроваджує його у свою ж систему і миттєво виконує. Він буквально еволюціонує з кожним вашим запитом, перетворюючи розмову на нові реальні алгоритми."
          />
          {/* Item 4 */}
          <ComparisonItem 
            title="4. Контекст: Ізольованість проти UI-Розуміння"
            normal="Не знає, що відбувається на вашому екрані. Вам доводиться копіювати текст і пояснювати контекст вручну."
            atlas="Аналізує ваш робочий стіл (UI Understanding). Він знає, яка програма у вас зараз відкрита, де знаходиться ваша мишка, і може відповідати на запитання в контексті того, на що ви зараз дивитесь."
          />
          {/* Item 5 */}
          <ComparisonItem 
            title="5. Ініціатива: Очікування проти Проактивності"
            normal="Мовчить, поки ви до нього не звернетесь."
            atlas="Діє на випередження. Модуль proactive_watcher.py постійно моніторить систему. Якщо стається помилка, збій або система потребує оптимізації, ATLAS може самостійно проаналізувати проблему і запропонувати вам рішення ще до того, як ви зрозумієте, що щось пішло не так. Крім того, ви можете доручити йому довгий пошук в інтернеті, і він автономно збере інформацію та надішле вам готовий звіт прямо в Telegram."
          />
          {/* Item 6 */}
          <ComparisonItem 
            title='6. Пам"ять: "Ефект Золотої Рибки" проти Семантичної Пам"яті'
            normal="Кожен новий чат — це чистий аркуш. Він забуває те, що ви обговорювали тиждень тому."
            atlas="Має вбудовану семантичну пам'ять (semantic_memory). Він запам'ятовує ваші звички, уподобання, попередні проєкти та обіцянки. Навіть через кілька місяців він може нагадати вам деталі з минулих розмов."
          />
          {/* Item 7 */}
          <ComparisonItem 
            title='7. Архітектура "Мозку": Спалювання грошей проти Розумної Маршрутизації'
            normal='Використовує найважчу і найдорожчу модель навіть для того, щоб просто сказати "Привіт".'
            atlas="Має каскадну систему інтелекту. Для простих розмов та підслуховування він використовує швидкі та дешеві моделі (наприклад, DeepSeek), а коли справа доходить до складного планування чи написання коду — автоматично перемикається на найпотужніші нейромережі світу (Claude 3.5 Sonnet). Це робить його не лише розумним, але й неймовірно економним у використанні."
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonItem({ title, normal, atlas }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20,
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      transition: "transform 0.3s ease, border-color 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      e.currentTarget.style.transform = "none";
    }}
    >
      <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#fff", margin: 0 }}>
        {title}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ padding: 20, background: "rgba(255,95,87,0.05)", borderRadius: 16, borderLeft: "4px solid rgba(255,95,87,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,95,87,1)", fontWeight: 600, marginBottom: 12 }}>
            <Bot size={20} />
            <span>Звичайний ШІ</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>
            {normal}
          </p>
        </div>
        <div style={{ padding: 20, background: "rgba(0,229,255,0.05)", borderRadius: 16, borderLeft: "4px solid rgba(0,229,255,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(0,229,255,1)", fontWeight: 600, marginBottom: 12 }}>
            <Zap size={20} />
            <span>ATLAS</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
            {atlas}
          </p>
        </div>
      </div>
    </div>
  );
}
