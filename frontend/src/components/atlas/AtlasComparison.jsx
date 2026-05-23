import React from "react";
import { Zap, Bot, Eye, Brain, EyeOff, Shield, RefreshCw } from "lucide-react";

export default function AtlasComparison() {
  return (
    <section
      id="comparison"
      className="section-container"
      style={{ position: "relative", perspective: 1000 }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-eyebrow">Еволюція ШІ</div>
          <h2
            className="shimmer-text"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: 20,
              marginTop: 16,
              background: "linear-gradient(120deg, #ffffff 0%, #d4dcff 35%, #b8f0ff 70%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            Звичайні ШІ vs. ATLAS
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.7)", maxWidth: 800, margin: "0 auto", lineHeight: 1.6 }}>
            Чому це не просто чат-бот, а ваша нова операційна система.
            <br />
            Більшість штучних інтелектів сьогодні — це просто вкладка у браузері. Вони чекають, поки ви до них звернетесь. <strong style={{ color: "#00E5FF" }}>ATLAS — це дещо зовсім інше.</strong>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <ComparisonItem 
            delay="delay-1"
            title="1. Формат взаємодії: Пасивність проти Присутності"
            normal="Щоб щось запитати, вам потрібно відкрити додаток, надрукувати текст або натиснути кнопку мікрофона і чекати на відповідь."
            atlas="Завжди поруч. Завдяки технології WebRTC VAD, він постійно (але безпечно) слухає простір навколо. Вам достатньо просто сказати команду вголос, знаходячись у кімнаті. Він розуміє, коли ви звертаєтесь до нього, а коли просто розмовляєте по телефону."
          />
          <ComparisonItem 
            delay="delay-2"
            title="2. Зір та Розпізнавання: Сліпота проти FaceID"
            normal="Бачить лише те, що ви йому вручну завантажите як картинку."
            atlas="Має власний локальний FaceID (на базі InsightFace). Щойно ви сідаєте за комп'ютер, він без жодного кліку розпізнає вас. Він вітається з вами на ім'я, відрізняє вас від гостей та підлаштовує свій контекст. При цьому ваші біометричні дані ніколи не відправляються в інтернет."
          />
          <ComparisonItem 
            delay="delay-3"
            title="3. Навички: Обмеженість проти Саморозвитку"
            normal={`Якщо ви попросите його виконати специфічну дію на вашому комп'ютері, він відповість: "Вибачте, я лише мовна модель".`}
            atlas="Вміє писати код для самого себе! Завдяки модулю evolution.py, якщо ви даєте команду, яку він ще не вміє робити, він не здається. ATLAS самостійно аналізує завдання, генерує новий Python-скрипт, впроваджує його у свою ж систему і миттєво виконує."
          />
          <ComparisonItem 
            delay="delay-1"
            title="4. Контекст: Ізольованість проти UI-Розуміння"
            normal="Не знає, що відбувається на вашому екрані. Вам доводиться копіювати текст і пояснювати контекст вручну."
            atlas="Аналізує ваш робочий стіл (UI Understanding). Він знає, яка програма у вас зараз відкрита, де знаходиться ваша мишка, і може відповідати на запитання в контексті того, на що ви зараз дивитесь."
          />
          <ComparisonItem 
            delay="delay-2"
            title="5. Ініціатива: Очікування проти Проактивності"
            normal="Мовчить, поки ви до нього не звернетесь."
            atlas="Діє на випередження. Модуль proactive_watcher.py постійно моніторить систему. Якщо стається помилка або збій, ATLAS самостійно аналізує проблему і пропонує рішення. Автономно шукає інформацію і надсилає звіти прямо в Telegram."
          />
          <ComparisonItem 
            delay="delay-3"
            title="6. Пам'ять: 'Ефект Золотої Рибки' проти Семантики"
            normal="Кожен новий чат — це чистий аркуш. Він забуває те, що ви обговорювали тиждень тому."
            atlas="Має вбудовану семантичну пам'ять (semantic_memory). Він запам'ятовує ваші звички, уподобання, попередні проєкти та обіцянки. Навіть через кілька місяців він може нагадати вам деталі з минулих розмов."
          />
          <ComparisonItem 
            delay="delay-1"
            title="7. Архітектура: Спалювання грошей проти Маршрутизації"
            normal="Використовує найважчу і найдорожчу модель навіть для того, щоб просто сказати 'Привіт'."
            atlas="Має каскадну систему інтелекту. Для простих розмов використовує швидкі моделі, а для складного планування — автоматично перемикається на найпотужніші нейромережі світу (Claude 3.5 Sonnet). Це робить його розумним і економним."
          />
        </div>
      </div>
      
      {/* 3D background effects */}
      <div 
        className="pulse-ring" 
        style={{ width: "800px", height: "800px", borderColor: "rgba(0,229,255,0.15)", top: "30%", left: "20%" }} 
      />
      <div 
        className="pulse-ring" 
        style={{ width: "1200px", height: "1200px", borderColor: "rgba(157,76,221,0.1)", top: "60%", left: "80%", animationDelay: "-2s" }} 
      />
    </section>
  );
}

function ComparisonItem({ title, normal, atlas, delay }) {
  return (
    <div 
      className={`reveal ${delay} glass`}
      style={{
        borderRadius: 24,
        padding: "clamp(24px, 4vw, 40px)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        position: "relative",
        overflow: "hidden",
        transformStyle: "preserve-3d"
      }}
    >
      <div 
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle at 50% 0%, rgba(0,229,255,0.08), transparent 70%)",
          opacity: 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
          zIndex: 0
        }}
        className="hover-glow"
      />
      
      <h3 style={{ 
        fontSize: "clamp(1.2rem, 2vw, 1.4rem)", 
        fontWeight: 600, 
        color: "#fff", 
        margin: 0,
        letterSpacing: "-0.01em",
        zIndex: 1
      }}>
        {title}
      </h3>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: 16,
        zIndex: 1
      }}>
        <div style={{ 
          padding: 24, 
          background: "rgba(10,10,10,0.4)", 
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.05)",
          transition: "transform 0.4s ease, background 0.4s ease"
        }} className="comp-card-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 16 }}>
            <Bot size={18} />
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Звичайний ШІ</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
            {normal}
          </p>
        </div>

        <div style={{ 
          padding: 24, 
          background: "linear-gradient(145deg, rgba(0,229,255,0.1) 0%, rgba(10,10,10,0.6) 100%)", 
          borderRadius: 16,
          border: "1px solid rgba(0,229,255,0.2)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease"
        }} className="comp-card-right">
          <div className="scan-line" style={{ opacity: 0.5, animationDuration: "4s" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#00E5FF", fontWeight: 600, marginBottom: 16, position: "relative", zIndex: 2 }}>
            <Zap size={18} />
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>ATLAS</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", fontWeight: 400, position: "relative", zIndex: 2 }}>
            {atlas}
          </p>
        </div>
      </div>
      
      <style>{`
        .glass:hover .hover-glow {
          opacity: 1 !important;
        }
        .glass:hover .comp-card-left {
          transform: translateY(-2px) scale(0.98);
          background: rgba(10,10,10,0.6) !important;
        }
        .glass:hover .comp-card-right {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(0,229,255,0.4) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 40px rgba(0,229,255,0.15), 0 10px 20px rgba(0,0,0,0.5) !important;
        }
      `}</style>
    </div>
  );
}
