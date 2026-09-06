function resolveCheatSheet(scene, scriptData = {}) {
    if (scene.cheat_sheet && scene.cheat_sheet.title && Array.isArray(scene.cheat_sheet.rows) && scene.cheat_sheet.rows.length > 0) {
        return scene.cheat_sheet;
    }

    const t = `${scene.text || ''} ${scriptData.hook || ''} ${scriptData.selectedAngle || ''} ${scriptData.topic || ''}`.toLowerCase();

    // 1. Овсянка, завтраки, углеводы, инсулин
    if (t.includes('овсянк') || t.includes('завтрак') || t.includes('каш') || t.includes('хлопь')) {
        return {
            title: 'СРАВНЕНИЕ: ОВСЯНКА VS БЕЛКОВЫЙ ЗАВТРАК',
            badge: 'ШПАРГАЛКА',
            col1_header: 'Параметр',
            col2_header: 'Овсяные хлопья',
            col3_header: 'Яйца + авокадо + сыр',
            rows: [
                { col1: 'Сытость', col2: '1.5 часа (дикий голод)', col3: '4.5 часа ровной энергии' },
                { col1: 'Инсулин', col2: 'Резкий скачок +140%', col3: 'Стабильный сахар' },
                { col1: 'Тяга к сладкому', col2: 'Пик к 11:30 утра', col3: '0% желания сорваться' }
            ]
        };
    }

    // 2. Вечерний жор, аппетит, кортизол, стресс
    if (t.includes('жор') || t.includes('вечер') || t.includes('голод') || t.includes('аппетит') || t.includes('срыв') || t.includes('кортизол') || t.includes('стресс')) {
        return {
            title: '3 ШАГА: КАК ПОБЕДИТЬ ВЕЧЕРНИЙ ЖОР',
            badge: 'ЛАЙФХАК',
            col1_header: 'Время дня',
            col2_header: 'Что съесть / сделать',
            col3_header: 'Гормональный эффект',
            rows: [
                { col1: 'Обед (13:00)', col2: '35г белка + клетчатка', col3: 'Лептин держит сытость до ночи' },
                { col1: 'В 17:00', col2: '25г орехов или сыр', col3: 'Блокирует гормон голода грелин' },
                { col1: 'Ужин (19:30)', col2: 'Индейка + сложные угли', col3: 'Синтез мелатонина и крепкий сон' }
            ]
        };
    }

    // 3. Творог, молочка, лактоза, отеки
    if (t.includes('творог') || t.includes('молочк') || t.includes('лактоз')) {
        return {
            title: 'ПРАВИЛО МОЛОЧКИ БЕЗ ОТЕКОВ (+1.5 КГ)',
            badge: 'СХЕМА',
            col1_header: 'Время приема',
            col2_header: 'Реакция организма',
            col3_header: 'Результат утром',
            rows: [
                { col1: 'На ночь (21:00)', col2: 'ИИ 120 держит натрий', col3: 'Ложный отек +1.5 кг' },
                { col1: 'В обед (13:00)', col2: 'Усвоение кальция и белка', col3: 'Сытость 4ч без задержки воды' },
                { col1: 'С ягодами / орехами', col2: 'Клетчатка гасит инсулин', col3: 'Слив воды и плоский живот' }
            ]
        };
    }

    // 4. Отеки, задержка воды, соль, лимфа
    if (t.includes('отек') || t.includes('вод') || t.includes('соль') || t.includes('лимф')) {
        return {
            title: 'ТАБЛИЦА СЛИВА ОТЕКОВ (-3 КГ ЗА 4 ДНЯ)',
            badge: 'ШПАРГАЛКА',
            col1_header: 'Причина отека',
            col2_header: 'Что убрать',
            col3_header: 'Чем заменить для слива',
            rows: [
                { col1: 'Инсулиновый отек', col2: 'Сладкое и молочка на ночь', col3: 'Овощной белковый ужин' },
                { col1: 'Солевой отек', col2: 'Колбасы и скрытая соль', col3: 'Калий: петрушка, курага' },
                { col1: 'Кортизоловый застой', col2: 'Сон меньше 6 часов', col3: '300 мг магния цитрат' }
            ]
        };
    }

    // 5. Щитовидка, Т3, метаболизм, плато
    if (t.includes('щитовид') || t.includes('т3') || t.includes('т4') || t.includes('плато')) {
        return {
            title: 'ПОДДЕРЖКА ЩИТОВИДКИ ПРИ ПОХУДЕНИИ',
            badge: 'ПРОТОКОЛ',
            col1_header: 'Показатель',
            col2_header: 'Диета 1200 ккал',
            col3_header: 'Сытный баланс',
            rows: [
                { col1: 'Гормон Т3', col2: 'Падает на 35% (плато)', col3: 'Норма жиросжигания' },
                { col1: 'Углеводы', col2: 'Отказ (спад метаболизма)', col3: '120-140г сложных углей' },
                { col1: 'Селен и Йод', col2: 'Дефицит (усталость и отек)', col3: '2 бразильских ореха в день' }
            ]
        };
    }

    // 6. По умолчанию: Таблица нормы КБЖУ рост-вес для женщин (формула Миффлина)
    return {
        title: 'НОРМА КБЖУ ДЛЯ СНИЖЕНИЯ ВЕСА (ФОРМУЛА МИФФЛИНА)',
        badge: 'МИФФЛИН-САН ЖЕОР',
        col1_header: 'Вес / Рост',
        col2_header: 'Базовый обмен (ОО)',
        col3_header: 'Сытный дефицит (-15%)',
        rows: [
            { col1: '55-65 кг (162-166 см)', col2: '1350 ккал', col3: '1650 ккал + 95г белка' },
            { col1: '66-75 кг (165-170 см)', col2: '1480 ккал', col3: '1780 ккал + 110г белка' },
            { col1: '76-85 кг (168-174 см)', col2: '1620 ккал', col3: '1920 ккал + 125г белка' }
        ]
    };
}

export function generateVideoHtml(scriptData, customVideoUrl = null) {
    let totalDur = 0;
    let scenesHtml = '';
    let delay = 0;

    const defaultVideo = customVideoUrl || "https://videos.pexels.com/video-files/7143967/7143967-uhd_2160_4096_30fps.mp4";

    const scenes = (scriptData.scenes && Array.isArray(scriptData.scenes) && scriptData.scenes.length > 0)
        ? scriptData.scenes
        : [
            { duration: 5.5, text: 'ПОЧЕМУ ВЕС СТОИТ НА ДЕФИЦИТЕ КАЛОРИЙ?', visual: 'text_only' },
            { duration: 5.5, text: 'ДИЕТЫ НИЖЕ 1200 ККАЛ БЛОКИРУЮТ СЖИГАНИЕ ЖИРА', visual: 'line_chart', stat_value: '-40%', stat_label: 'Спад метаболизма' },
            { duration: 6.0, text: 'СРАВНИ: ЖЕСТКИЙ ГОЛОД ПРОТИВ СЫТНОГО БАЛАНСА', visual: 'comparison_table', stat_value: 'Диета vs Баланс', stat_label: 'Заскринь шпаргалку' },
            { duration: 5.5, text: 'ОРГАНИЗМ СПАСАЕТ СЕБЯ И СЖИГАЕТ МЫШЦЫ', visual: 'circle_progress', stat_value: '+80%', stat_label: 'Стресс-кортизол' },
            { duration: 5.5, text: 'СЕКРЕТ В ФОРМУЛЕ МИФФЛИНА-САН ЖЕОРА', visual: 'chart_bar', stat_value: '100%', stat_label: 'Точный расчет' },
            { duration: 6.0, text: 'А НА КАКИХ ДИЕТАХ СИДЕЛИ ВЫ? НАПИШИТЕ В КОММЕНТАРИЯХ', visual: 'text_only' }
        ];

    // Вычисляем общую длительность
    scenes.forEach((s) => {
        totalDur += (typeof s.duration === 'number' ? s.duration : 5.5);
    });

    // Генерация сегментов прогресс-бара
    let segmentBarsHtml = '';
    let accumulatedDelay = 0;

    scenes.forEach((scene, index) => {
        const dur = typeof scene.duration === 'number' ? scene.duration : 5.5;
        const widthPercent = ((dur / totalDur) * 100).toFixed(2);
        
        let graphicHtml = '';
        let textClass = 'text-center';

        // Проверка: является ли сцена карточкой для сохранения ("Заскринь")
        const isBookmarkable = scene.visual === 'comparison_table' 
            || (scene.text && (scene.text.toLowerCase().includes('сравни') || scene.text.toLowerCase().includes('заскринь') || scene.text.toLowerCase().includes('шпаргалк') || scene.text.toLowerCase().includes('миффлин')))
            || (scene.stat_label && scene.stat_label.toLowerCase().includes('заскринь'));

        if (scene.visual !== 'text_only') {
            textClass = 'text-up';
            
            if (scene.visual === 'line_chart') {
                graphicHtml = `
                <div class="chart-box">
                    <svg width="520" height="200" viewBox="0 0 520 200">
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#f43f5e" />
                                <stop offset="100%" stop-color="#fb7185" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <!-- Фоновая сетка -->
                        <line x1="20" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-dasharray="8 8"/>
                        <line x1="20" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="2" stroke-dasharray="8 8"/>
                        <!-- Динамическая кривая спада/роста с плавной прорисовкой -->
                        <path class="neon-line" d="M20,40 Q150,50 260,130 T500,170" fill="none" stroke="url(#lineGrad)" stroke-width="12" stroke-linecap="round" filter="url(#glow)"/>
                        <!-- Пульсирующий маяк на пике изменения -->
                        <circle class="beacon-pulse" cx="20" cy="40" r="10" fill="#f43f5e"/>
                        <circle class="beacon-core" cx="20" cy="40" r="6" fill="#ffffff"/>
                    </svg>
                </div>`;
            } else if (scene.visual === 'comparison_table') {
                const cs = resolveCheatSheet(scene, scriptData);
                graphicHtml = `
                <div class="comp-table-wrap">
                    <div class="screenshot-callout">
                        <div class="cam-flash">📸</div>
                        <span>ПОСТАВЬ НА ПАУЗУ И ЗАСКРИНЬ ШПАРГАЛКУ</span>
                    </div>
                    <div class="cheat-sheet-card">
                        <div class="cheat-sheet-header">
                            <span class="cheat-sheet-title">⚡ ${cs.title}</span>
                            <span class="cheat-sheet-badge">${cs.badge || 'ШПАРГАЛКА'}</span>
                        </div>
                        <table class="cheat-table">
                            <thead>
                                <tr>
                                    <th class="th-col1">${cs.col1_header}</th>
                                    <th class="th-col2">${cs.col2_header}</th>
                                    <th class="th-col3">${cs.col3_header}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(Array.isArray(cs.rows) ? cs.rows : []).map(r => `
                                    <tr class="cheat-row">
                                        <td class="td-col1">${r.col1 || ''}</td>
                                        <td class="td-col2 ${typeof r.col2 === 'string' && (r.col2.includes('голод') || r.col2.includes('спад') || r.col2.includes('+1.5') || r.col2.includes('1200') || r.col2.includes('Отказ') || r.col2.includes('Сладкое') || r.col2.includes('Колбасы')) ? 'val-warn' : ''}">${r.col2 || ''}</td>
                                        <td class="td-col3 val-accent">${r.col3 || ''}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>`;
            } else if (scene.visual === 'chart_bar') {
                graphicHtml = `
                <div class="chart-bars-card">
                    <div class="chart-bars">
                        <div class="bar-col">
                            <span class="bar-val">1200</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="--h: 42%; --d: 0.1s; background: #64748b;"></div>
                            </div>
                            <span class="bar-name">Диета</span>
                        </div>
                        <div class="bar-col">
                            <span class="bar-val accent-text">1850</span>
                            <div class="bar-track">
                                <div class="bar-fill accent" style="--h: 92%; --d: 0.3s; background: linear-gradient(180deg, #10b981 0%, #059669 100%);"></div>
                            </div>
                            <span class="bar-name accent-name">Баланс</span>
                        </div>
                        <div class="bar-col">
                            <span class="bar-val">2200</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="--h: 70%; --d: 0.5s; background: #38bdf8;"></div>
                            </div>
                            <span class="bar-name">Расход</span>
                        </div>
                    </div>
                </div>`;
            } else if (scene.visual === 'circle_progress') {
                graphicHtml = `
                <div class="circle-container">
                    <svg width="220" height="220" viewBox="0 0 220 220">
                        <circle class="bg" cx="110" cy="110" r="85"/>
                        <circle class="fg" cx="110" cy="110" r="85"/>
                    </svg>
                    <div class="circle-center-text">
                        <span class="circle-num">${scene.stat_value || '80%'}</span>
                        <span class="circle-sub">Эффект</span>
                    </div>
                </div>`;
            }

            graphicHtml = `
            <div class="graphic-block" data-scene="${index}">
                ${graphicHtml}
                ${scene.stat_value && scene.visual !== 'circle_progress' && scene.visual !== 'comparison_table' ? `<div class="stat-value"><span class="stat-num">${scene.stat_value}</span></div>` : ''}
                ${scene.stat_label && scene.visual !== 'comparison_table' ? `<div class="stat-label">${scene.stat_label}</div>` : ''}
            </div>`;
        }

        scenesHtml += `
        <div class="scene" style="--dur: ${dur}s; --del: ${delay}s;" data-index="${index}" data-time="${delay.toFixed(1)}">
            <div class="${textClass}">${scene.text}</div>
            ${graphicHtml}
        </div>`;

        segmentBarsHtml += `
        <div class="seg-item" style="width: ${widthPercent}%;">
            <div class="seg-fill" style="animation-duration: ${dur}s; animation-delay: ${accumulatedDelay}s;"></div>
        </div>`;

        delay += dur;
        accumulatedDelay += dur;
    });

    return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Shorts Preview — Худею вкусно</title>
<style>
:root {
    --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --ease-smooth: cubic-bezier(0.25, 1, 0.5, 1);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    background: #000;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-text-size-adjust: 100%;
    user-select: none;
}
.canvas {
    width: 1080px;
    height: 1920px;
    position: absolute;
    top: 50%;
    left: 50%;
    background: #08090d;
    background-image: 
        radial-gradient(circle at 50% 18%, rgba(22, 28, 42, 0.95) 0%, rgba(9, 11, 16, 0.98) 55%, #050608 100%),
        radial-gradient(rgba(255, 255, 255, 0.07) 1.5px, transparent 1.5px);
    background-size: 100% 100%, 36px 36px;
    overflow: hidden;
    transform-origin: center center;
    box-shadow: 0 0 100px rgba(0,0,0,0.95);
}

/* Атмосферные дышащие световые сферы на темном фоне */
.ambient-orb-1 {
    position: absolute;
    width: 750px;
    height: 750px;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.02) 55%, transparent 70%);
    filter: blur(50px);
    pointer-events: none;
    z-index: 1;
    animation: orbBreath1 12s ease-in-out infinite alternate;
}
.ambient-orb-2 {
    position: absolute;
    width: 650px;
    height: 650px;
    bottom: 18%;
    right: -100px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(56, 189, 248, 0.02) 55%, transparent 70%);
    filter: blur(50px);
    pointer-events: none;
    z-index: 1;
    animation: orbBreath2 14s ease-in-out infinite alternate;
}
.ambient-orb-3 {
    position: absolute;
    width: 500px;
    height: 500px;
    bottom: 35%;
    left: -80px;
    background: radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 65%);
    filter: blur(60px);
    pointer-events: none;
    z-index: 1;
    animation: orbBreath3 16s ease-in-out infinite alternate;
}
@keyframes orbBreath1 {
    0% { transform: translateX(-50%) scale(1); opacity: 0.7; }
    50% { transform: translateX(-46%) scale(1.12); opacity: 1; }
    100% { transform: translateX(-54%) scale(0.95); opacity: 0.8; }
}
@keyframes orbBreath2 {
    0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
    100% { transform: translate(-40px, -30px) scale(1.15); opacity: 0.95; }
}
@keyframes orbBreath3 {
    0% { transform: translate(0, 0) scale(0.9); opacity: 0.5; }
    100% { transform: translate(30px, -40px) scale(1.1); opacity: 0.85; }
}

/* Эстетичный виньетированный оверлей */
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 40%, rgba(5,5,8,0.7) 100%);
    z-index: 2;
    pointer-events: none;
}

/* Плашка управления звуком (SFX & Lo-Fi) */
.audio-bar {
    position: absolute;
    top: 50px;
    left: 50px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(15, 23, 42, 0.75);
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 14px 28px;
    border-radius: 40px;
    backdrop-filter: blur(20px);
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    transition: transform 0.2s, background 0.2s;
}
.audio-bar:active { transform: scale(0.96); }
.audio-icon { font-size: 32px; }
.audio-text {
    font-size: 26px;
    font-weight: 800;
    color: #38bdf8;
    letter-spacing: 1px;
    font-family: monospace;
}
.eq-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 24px;
}
.eq-bar {
    width: 6px;
    background: #10b981;
    border-radius: 3px;
    height: 6px;
}
.eq-playing .eq-bar:nth-child(1) { animation: eqBounce 0.6s infinite ease-in-out; }
.eq-playing .eq-bar:nth-child(2) { animation: eqBounce 0.8s infinite 0.2s ease-in-out; }
.eq-playing .eq-bar:nth-child(3) { animation: eqBounce 0.5s infinite 0.4s ease-in-out; }
@keyframes eqBounce {
    0%, 100% { height: 6px; }
    50% { height: 24px; }
}

/* Верхний динамический сегментированный прогресс-бар */
.top-progress-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 16px 24px 0 24px;
    z-index: 15;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.segments-container {
    display: flex;
    gap: 6px;
    width: 100%;
    height: 10px;
}
.seg-item {
    background: rgba(255,255,255,0.25);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    backdrop-filter: blur(5px);
}
.seg-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
    box-shadow: 0 0 12px #10b981;
    animation: segFill linear forwards;
}
@keyframes segFill {
    to { width: 100%; }
}
.time-badge {
    align-self: flex-end;
    font-size: 22px;
    font-weight: 800;
    color: #e2e8f0;
    font-family: monospace;
    background: rgba(0,0,0,0.5);
    padding: 4px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.15);
}

/* Сцены */
.scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: sceneFade var(--dur) linear forwards;
    animation-delay: var(--del);
}
@keyframes sceneFade {
    0% { opacity: 0; }
    4% { opacity: 1; }
    94% { opacity: 1; }
    100% { opacity: 0; }
}

/* Заголовки и текст сцен */
.text-center, .text-up {
    position: absolute;
    top: 42%;
    width: 960px;
    font-size: 78px;
    font-weight: 900;
    text-align: center;
    text-transform: uppercase;
    line-height: 1.22;
    text-shadow: 0 10px 35px rgba(0,0,0,0.98), 0 2px 5px rgba(0,0,0,0.8);
    color: #ffffff;
    letter-spacing: -1px;
    animation-delay: var(--del);
}
.text-center {
    animation: textPulse var(--dur) var(--ease-smooth) forwards;
    transform: translateY(-50%);
}
@keyframes textPulse {
    0% { transform: translateY(-50%) scale(0.92); opacity: 0; filter: blur(12px); }
    14% { transform: translateY(-50%) scale(1); opacity: 1; filter: blur(0px); }
    100% { transform: translateY(-50%) scale(1.06); }
}
.text-up {
    animation: textMoveHigh var(--dur) var(--ease-smooth) forwards;
}
@keyframes textMoveHigh {
    0% { transform: translateY(-30%) scale(0.92); opacity: 0; filter: blur(12px); }
    14% { transform: translateY(-50%) scale(1); opacity: 1; filter: blur(0px); }
    32% { transform: translateY(-50%) scale(1); }
    48% { transform: translateY(-530px) scale(0.86); }
    100% { transform: translateY(-530px) scale(0.86); }
}

/* Блок графики */
.graphic-block {
    position: absolute;
    bottom: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(400px);
    opacity: 0;
    animation: graphicSlideUp var(--dur) var(--ease-out-back) forwards;
    animation-delay: var(--del);
}
@keyframes graphicSlideUp {
    0%, 38% { transform: translateY(400px) scale(0.85); opacity: 0; }
    52% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

/* 1. Плавная прорисовка линии графика (stroke-dashoffset) с маяком */
.neon-line {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: drawLine 1.6s var(--ease-smooth) forwards;
    animation-delay: calc(var(--del) + 0.65s);
}
@keyframes drawLine {
    to { stroke-dashoffset: 0; }
}
.beacon-pulse {
    animation: pulseBeacon 1.2s infinite ease-out;
    animation-delay: calc(var(--del) + 0.8s);
    transform-origin: 20px 40px;
}
@keyframes pulseBeacon {
    0% { r: 10; opacity: 1; }
    100% { r: 28; opacity: 0; }
}

/* 2. Контент «Заскринь» (Сохранения / Шпаргалка высокой пользы) */
.comp-table-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    width: 960px;
    max-width: 96%;
}
.screenshot-callout {
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(90deg, #f59e0b, #d97706);
    color: #000000;
    font-size: 24px;
    font-weight: 900;
    padding: 12px 34px;
    border-radius: 50px;
    letter-spacing: 0.8px;
    box-shadow: 0 0 35px rgba(245, 158, 11, 0.7);
    animation: bookmarkGlow 1.2s infinite alternate ease-in-out;
}
@keyframes bookmarkGlow {
    from { transform: scale(0.98); box-shadow: 0 0 25px rgba(245, 158, 11, 0.5); }
    to { transform: scale(1.02); box-shadow: 0 0 50px rgba(245, 158, 11, 0.9); }
}
.cam-flash {
    font-size: 30px;
    animation: flashIcon 0.8s infinite alternate;
}
@keyframes flashIcon {
    from { transform: rotate(-10deg); }
    to { transform: rotate(10deg); }
}

/* Карточка шпаргалки с высокой концентрацией пользы */
.cheat-sheet-card {
    width: 100%;
    background: rgba(11, 17, 32, 0.88);
    border: 3px solid rgba(56, 189, 248, 0.45);
    border-radius: 32px;
    padding: 24px 30px;
    backdrop-filter: blur(28px);
    box-shadow: 0 25px 60px rgba(0,0,0,0.92), 0 0 30px rgba(14, 165, 233, 0.2);
    box-sizing: border-box;
}
.cheat-sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid rgba(255, 255, 255, 0.12);
    padding-bottom: 12px;
    margin-bottom: 12px;
}
.cheat-sheet-title {
    font-size: 26px;
    font-weight: 900;
    color: #38bdf8;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}
.cheat-sheet-badge {
    background: rgba(245, 158, 11, 0.2);
    border: 1px solid rgba(245, 158, 11, 0.6);
    color: #fbbf24;
    font-size: 16px;
    font-weight: 900;
    padding: 5px 14px;
    border-radius: 20px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
}

.cheat-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
}
.cheat-table th {
    font-size: 19px;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 6px 12px;
}
.cheat-table th.th-col1 { width: 33%; text-align: left; }
.cheat-table th.th-col2 { width: 33%; text-align: left; }
.cheat-table th.th-col3 { width: 34%; text-align: right; }

.cheat-row {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
}
.cheat-row td {
    padding: 13px 14px;
    font-size: 21px;
    font-weight: 700;
    color: #f1f5f9;
    vertical-align: middle;
    line-height: 1.3;
}
.cheat-row td.td-col1 {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    color: #ffffff;
    font-weight: 800;
    text-align: left;
}
.cheat-row td.td-col2 {
    color: #cbd5e1;
    text-align: left;
}
.cheat-row td.td-col3 {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    text-align: right;
    color: #34d399;
    font-weight: 800;
}
.val-accent {
    color: #34d399 !important;
    font-weight: 800 !important;
    text-shadow: 0 0 15px rgba(52, 211, 153, 0.4);
}
.val-warn {
    color: #f87171 !important;
    font-weight: 700 !important;
}

.comp-table {
    display: flex;
    align-items: center;
    background: rgba(15, 23, 42, 0.75);
    border-radius: 38px;
    padding: 35px 55px;
    border: 3px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(24px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.85);
}
.comp-table .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 32px;
}
.tag-pill {
    font-size: 24px;
    font-weight: 800;
    padding: 6px 18px;
    border-radius: 20px;
    letter-spacing: 1px;
    margin-bottom: 12px;
}
.bad-pill { background: rgba(239, 68, 68, 0.25); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
.good-pill { background: rgba(16, 185, 129, 0.25); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }

.comp-table b {
    font-size: 68px;
    font-weight: 900;
    text-shadow: 0 8px 25px rgba(0,0,0,0.8);
}
.metric-bad { color: #ef4444; }
.metric-good { color: #10b981; }
.sub-text { font-size: 26px; color: #94a3b8; font-weight: 600; margin-top: 6px; }

.comp-table .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 140px;
    position: relative;
}
.comp-table .divider::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background: rgba(255,255,255,0.25);
    border-radius: 2px;
}
.vs-badge {
    position: relative;
    z-index: 2;
    background: #0f172a;
    border: 2px solid rgba(255,255,255,0.3);
    color: #e2e8f0;
    font-size: 18px;
    font-weight: 900;
    padding: 6px 10px;
    border-radius: 12px;
}

/* 3. Столбчатая диаграмма с динамическим ростом и пружиной */
.chart-bars-card {
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(255,255,255,0.18);
    border-radius: 35px;
    padding: 30px 45px;
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 45px rgba(0,0,0,0.8);
}
.chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 45px;
    height: 200px;
}
.bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    height: 100%;
    justify-content: flex-end;
}
.bar-val {
    font-size: 30px;
    font-weight: 900;
    color: #94a3b8;
    font-family: monospace;
}
.accent-text {
    color: #10b981;
    font-size: 36px;
    text-shadow: 0 0 15px rgba(16,185,129,0.7);
}
.bar-track {
    width: 68px;
    height: 130px;
    background: rgba(255,255,255,0.12);
    border-radius: 34px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    padding: 4px;
}
.bar-fill {
    width: 100%;
    border-radius: 30px;
    height: 0;
    animation: growBarHeight 1.2s var(--ease-out-back) forwards;
    animation-delay: calc(var(--del) + 0.6s + var(--d));
}
.bar-fill.accent {
    box-shadow: 0 0 35px #10b981;
}
@keyframes growBarHeight {
    to { height: var(--h); }
}
.bar-name {
    font-size: 22px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
}
.accent-name { color: #10b981; font-weight: 900; }

/* 4. Круговой индикатор с заполнением */
.circle-container {
    position: relative;
    width: 220px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
}
circle {
    fill: none;
    stroke-width: 24;
    stroke-linecap: round;
}
.circle-container .bg {
    stroke: rgba(255,255,255,0.12);
}
.circle-container .fg {
    stroke: #10b981;
    stroke-dasharray: 534;
    stroke-dashoffset: 534;
    transform: rotate(-90deg);
    transform-origin: center;
    animation: drawCircleDash 1.6s var(--ease-smooth) forwards;
    animation-delay: calc(var(--del) + 0.6s);
    filter: drop-shadow(0 0 25px #10b981);
}
@keyframes drawCircleDash {
    to { stroke-dashoffset: 106; }
}
.circle-center-text {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.circle-num {
    font-size: 58px;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 0 20px #10b981;
}
.circle-sub {
    font-size: 20px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
}

/* Статистика и цифры */
.stat-value {
    font-size: 135px;
    font-weight: 900;
    color: #10b981;
    text-shadow: 0 10px 45px rgba(16,185,129,0.6);
    line-height: 1;
    margin-top: 25px;
    letter-spacing: -4px;
    animation: popStat 0.8s var(--ease-out-back) forwards;
    animation-delay: calc(var(--del) + 0.5s);
    opacity: 0;
}
@keyframes popStat {
    0% { transform: scale(0.6); opacity: 0; }
    70% { transform: scale(1.12); opacity: 1; }
    100% { transform: scale(1.0); opacity: 1; }
}
.stat-label {
    font-size: 44px;
    font-weight: 800;
    color: #f1f5f9;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 12px;
    text-shadow: 0 5px 20px rgba(0,0,0,0.9);
}

/* Нижний градиентный финишный бар */
.bottom-glow-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 12px;
    background: linear-gradient(90deg, #10b981 0%, #38bdf8 50%, #f43f5e 100%);
    box-shadow: 0 -5px 25px rgba(16,185,129,0.5);
    z-index: 10;
}
</style>
</head>
<body>
    <div class="canvas">
        <div class="ambient-orb-1"></div>
        <div class="ambient-orb-2"></div>
        <div class="ambient-orb-3"></div>
        <div class="overlay"></div>

        <!-- Кнопка включения звука (SFX + Lo-Fi Chill) -->
        <div class="audio-bar" id="audio-toggle" title="Включить / выключить звуковые эффекты (SFX) и Lo-Fi фон">
            <span class="audio-icon" id="audio-icon">🔇</span>
            <span class="audio-text" id="audio-text">ЗВУК: ВЫКЛ</span>
            <div class="eq-bars" id="eq-bars">
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
            </div>
        </div>

        <!-- Кнопка прямого скачивания MP4 для Instagram & TikTok -->
        <a href="/api/video/download?type=dark&filename=shorts_guidepp.mp4" download="shorts_guidepp.mp4" class="audio-bar" style="left: auto; right: 40px; text-decoration: none; border-color: rgba(56,189,248,0.5); background: rgba(14,20,30,0.85);" title="Скачать вертикальное видео MP4">
            <span class="audio-icon">📥</span>
            <span class="audio-text" style="color: #38bdf8;">СКАЧАТЬ MP4</span>
        </a>

        <!-- Верхний сегментированный динамический прогресс-бар -->
        <div class="top-progress-wrap">
            <div class="segments-container">
                ${segmentBarsHtml}
            </div>
            <div class="time-badge" id="time-display">00:00 / ${Math.round(totalDur)}с</div>
        </div>

        ${scenesHtml}
        
        <div class="bottom-glow-bar"></div>
    </div>

    <script>
        // Адаптивное масштабирование канваса под размер окна
        function resize() {
            const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
            document.querySelector('.canvas').style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
        }
        window.addEventListener('resize', resize);
        resize();

        // ----------------------------------------------------
        // WEB AUDIO API: SFX (WHOOSH, POP) + LO-FI AMBIENT CHORDS
        // ----------------------------------------------------
        let audioCtx = null;
        let isAudioOn = false;
        let loFiInterval = null;

        function getAudioContext() {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioCtx = new AudioContextClass();
                }
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        // SFX: Мягкий киношный 'Вуш' (Whoosh) при появлении сцен
        function playWhooshSfx() {
            if (!isAudioOn) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            try {
                const dur = 0.45;
                const bufferSize = Math.floor(ctx.sampleRate * dur);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
                }

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(250, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + dur * 0.45);
                filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + dur);
                filter.Q.value = 3.2;

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + dur * 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                noise.start();
            } catch(e) {}
        }

        // SFX: Неоновый 'Поп / Щелчок' при появлении инфографики и цифр
        function playPopSfx() {
            if (!isAudioOn) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.09);

                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + 0.09);
            } catch(e) {}
        }

        // Lo-Fi: Теплые приглушенные атмосферные аккорды (Dm9 -> G13 -> Cmaj7)
        function playLoFiAmbientChord() {
            if (!isAudioOn) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            const chords = [
                [146.83, 220.00, 261.63, 329.63], // D, A, C, E (Dm9)
                [174.61, 246.94, 293.66, 392.00], // F, B, D, G (G7/13)
                [130.81, 196.00, 246.94, 329.63]  // C, G, B, E (Cmaj7)
            ];
            const chord = chords[Math.floor(Math.random() * chords.length)];

            chord.forEach(f => {
                try {
                    const osc = ctx.createOscillator();
                    const filter = ctx.createBiquadFilter();
                    const gain = ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.value = f;

                    filter.type = 'lowpass';
                    filter.frequency.value = 650; // Мягкий бархатный срез высоких частот

                    gain.gain.setValueAtTime(0.001, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.8);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.5);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start();
                    osc.stop(ctx.currentTime + 5.5);
                } catch(e) {}
            });
        }

        // Переключатель звука
        const audioBtn = document.getElementById('audio-toggle');
        const audioIcon = document.getElementById('audio-icon');
        const audioText = document.getElementById('audio-text');
        const eqBars = document.getElementById('eq-bars');

        audioBtn.addEventListener('click', () => {
            isAudioOn = !isAudioOn;
            if (isAudioOn) {
                getAudioContext();
                audioIcon.textContent = '🔊';
                audioText.textContent = 'ЗВУК: ВКЛ (SFX + Lo-Fi)';
                audioText.style.color = '#10b981';
                eqBars.classList.add('eq-playing');
                playWhooshSfx();
                playLoFiAmbientChord();
                loFiInterval = setInterval(playLoFiAmbientChord, 5200);
            } else {
                audioIcon.textContent = '🔇';
                audioText.textContent = 'ЗВУК: ВЫКЛ';
                audioText.style.color = '#38bdf8';
                eqBars.classList.remove('eq-playing');
                if (loFiInterval) clearInterval(loFiInterval);
            }
        });

        // Синхронизация SFX со сменой сцен и таймером
        const scenesElements = document.querySelectorAll('.scene');
        const timeDisplay = document.getElementById('time-display');
        const totalDuration = ${totalDur};
        const startTime = Date.now();

        // Таймер секунд
        setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000) % totalDuration;
            const sec = Math.floor(elapsed);
            const totalSec = Math.round(totalDuration);
            timeDisplay.textContent = '00:' + (sec < 10 ? '0' : '') + sec + ' / ' + totalSec + 'с';
        }, 300);

        // Тайминги звуковых событий под каждую сцену
        scenesElements.forEach((el) => {
            const delSec = parseFloat(el.getAttribute('data-time') || 0);
            setTimeout(() => {
                playWhooshSfx();
                // Через 500мс после смены сцены — щелчок появления инфографики
                if (el.querySelector('.graphic-block')) {
                    setTimeout(playPopSfx, 500);
                }
            }, delSec * 1000);
        });
    </script>
</body>
</html>`;
}

let lastHtml = null;

export function getLastGeneratedHtml() {
    if (lastHtml) return lastHtml;
    return generateVideoHtml({
        scenes: [
            { duration: 5.0, text: 'ПОЧЕМУ ВЕС НАМЕРТВО СТОИТ ПОСЛЕ 30 ЛЕТ?', visual: 'text_only' },
            { duration: 5.5, text: 'ДИЕТЫ НИЖЕ 1200 ККАЛ БЛОКИРУЮТ СЖИГАНИЕ ЖИРА', visual: 'line_chart', stat_value: '-40%', stat_label: 'Спад метаболизма' },
            { duration: 6.0, text: 'СРАВНИ: ЖЕСТКИЙ ГОЛОД ПРОТИВ СЫТНОГО БАЛАНСА', visual: 'comparison_table', stat_value: 'Диета vs Баланс', stat_label: 'Заскринь шпаргалку' },
            { duration: 5.5, text: 'ОРГАНИЗМ СПАСАЕТ СЕБЯ И СЖИГАЕТ МЫШЦЫ', visual: 'circle_progress', stat_value: '+80%', stat_label: 'Стресс-кортизол' },
            { duration: 5.5, text: 'СЕКРЕТ В ФОРМУЛЕ МИФФЛИНА-САН ЖЕОРА', visual: 'chart_bar', stat_value: '100%', stat_label: 'Точный расчет' },
            { duration: 5.5, text: 'А НА КАКИХ ДИЕТАХ СИДЕЛИ ВЫ? НАПИШИТЕ В КОММЕНТАРИЯХ', visual: 'text_only' }
        ]
    });
}

export async function renderVideo(scriptData, query = null) {
    lastHtml = generateVideoHtml(scriptData);
    return {
        success: true,
        html: lastHtml,
        theme: 'dark-infographic',
        isDarkTheme: true,
        videoUrl: '/api/video/download?type=dark&filename=shorts_guidepp.mp4',
        downloadUrl: '/api/video/download?type=dark&filename=shorts_guidepp.mp4',
        previewUrl: '/preview',
        isFallback: false,
        message: 'Стильный темный фон со структурированной инфографикой, SFX-звуками и карточкой для сохранения успешно сгенерирован'
    };
}
