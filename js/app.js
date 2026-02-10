const app = {
    state: {
        protagonist: 'male', // Por defecto: Makoto (P3P) / Yu (P4G)
        user: "Artemis" // Nick fijo
    },

    // Configuración de los botones (módulos) para cada juego
    gameConfig: {
        p3p: [
            { id: 'school', label: '📝 Escuela', colorClass: '' },
            { id: 'social', label: '🤝 Vínculos', colorClass: '' },
            { id: 'missing', label: '🕵️ Desaparecidos', colorClass: 'alert-text' },
            { id: 'fusions', label: '🔮 Fusiones', colorClass: '' }
        ],
        p4g: [
            { id: 'school', label: '🎓 Exámenes', colorClass: 'p4-btn-1' },     // Knowledge
            { id: 'social', label: '👓 Social Links', colorClass: 'p4-btn-2' }, // Investigation Team
            { id: 'lunch', label: '🍱 LunchBox', colorClass: 'p4-btn-3' },      // Cooking
            { id: 'quiz', label: '📺 TV Quiz', colorClass: 'p4-btn-4' },        // Midnight Channel
            { id: 'riddle', label: '🎩 Riddles', colorClass: 'p4-btn-5' },      // Funky Student
            { id: 'fusions', label: '🃏 Fusiones', colorClass: 'p4-btn-6' }     // Margaret (Velvet Style)
        ]
    },

    init: function() {
        this.bootSequence();
        this.updateClock();
        setInterval(() => this.updateClock(), 60000);
    },

    // 1. Secuencia de Arranque
    bootSequence: function() {
        const log = document.getElementById('boot-text');
        log.innerHTML = "> Initializing system...<br>";
        setTimeout(() => log.innerHTML += "> Authenticating biometrics...<br>", 800);
        setTimeout(() => log.innerHTML += "> Identity Confirmed: Artemis.<br>", 1600);
        
        setTimeout(() => {
            log.innerHTML += "> Welcome Artemis from S.E.E.S.";
            document.getElementById('user-nick').innerText = "Artemis (S.E.E.S)";
            const btn = document.getElementById('btn-login');
            btn.classList.remove('hidden');
            btn.onclick = () => {
                this.changeView('view-dashboard');
            };
        }, 2500);
    },

    changeView: function(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        if(viewId === 'view-dashboard') {
            document.querySelectorAll('.view').forEach(v => {
                if(v.id !== 'view-dashboard') v.classList.add('hidden');
            });
            // Al volver al dashboard, aseguramos limpiar el modo Velvet
            this.resetAtmosphere();
        }
    },

    updateClock: function() {
        const now = new Date();
        document.getElementById('clock').innerText = 
            now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    },

    // --- NAVEGACIÓN ENTRE JUEGOS ---

    openGame: function(gameId) {
        this.changeView('view-game-interface');
        const titleEl = document.querySelector('.current-module-title');
        const genderSwitch = document.querySelector('.gender-switch');
        
        // Resetear atmósfera por si venimos de Fusiones
        this.resetAtmosphere();

        if(gameId === 'p3p') {
            document.body.classList.remove('theme-p4');
            titleEl.innerText = "P3P DATABASE";
            genderSwitch.style.display = 'flex';
            this.setGender('male'); 
        } 
        else if(gameId === 'p4g') {
            document.body.classList.add('theme-p4');
            titleEl.innerText = "TV WORLD NAV";
            genderSwitch.style.display = 'none';
            document.getElementById('data-display').innerHTML = 
                '<div class="empty-state" style="color:#000; font-weight:bold; font-style:italic;">Selecciona un canal...</div>';
        }

        // Generar botones
        const navContainer = document.getElementById('modules-container');
        navContainer.innerHTML = ''; 

        if (this.gameConfig[gameId]) {
            this.gameConfig[gameId].forEach(btn => {
                const button = document.createElement('button');
                button.innerHTML = btn.label;
                button.className = btn.colorClass;
                button.onclick = () => this.loadModule(btn.id);
                if(gameId === 'p3p' && btn.id === 'missing') button.classList.add('alert-text');
                navContainer.appendChild(button);
            });
        }
    },

    goHome: function() {
        this.resetAtmosphere();
        document.body.classList.remove('theme-p4');
        const root = document.documentElement.style;
        root.setProperty('--bg-dark', '#050505');
        root.setProperty('--text-main', '#e0f7ff');
        this.changeView('view-dashboard');
        document.getElementById('data-display').innerHTML = '<div class="empty-state">Seleccione un módulo de datos.</div>';
    },

    setGender: function(gender) {
        this.state.protagonist = gender;
        const root = document.documentElement.style;
        
        if (gender === 'female') {
            root.setProperty('--kirijo-blue', '#fe0067'); 
            root.setProperty('--kirijo-dim', '#6b002c');
        } else {
            root.setProperty('--kirijo-blue', '#00d2ff');
            root.setProperty('--kirijo-dim', '#005f73');
        }

        document.getElementById('btn-male').classList.toggle('active', gender === 'male');
        document.getElementById('btn-female').classList.toggle('active', gender === 'female');
    },

    // --- GESTIÓN DE AMBIENTE (VELVET ROOM) ---
    resetAtmosphere: function() {
        const root = document.documentElement.style;
        const bgGrid = document.querySelector('.bg-grid');
        const isP4 = document.body.classList.contains('theme-p4');

        // Eliminar overrides
        root.removeProperty('--bg-dark');
        root.removeProperty('--text-main');
        if(bgGrid) {
            bgGrid.style.background = ''; // Vuelve al CSS original (Patrón P4 o Negro P3)
        }

        // Restaurar color de acento correcto
        if (isP4) {
            root.removeProperty('--kirijo-blue'); // Deja que el CSS de P4 mande (Rojo/Colores)
        } else {
            // Reaplicar color P3P (Azul o Rosa)
            this.setGender(this.state.protagonist);
        }
    },

    setVelvetAtmosphere: function() {
        const root = document.documentElement.style;
        const bgGrid = document.querySelector('.bg-grid');
        const velvetBlue = '#0a0e29'; // Azul Noche
        const velvetGold = '#d4af37'; // Dorado

        // Forzar variables globales
        root.setProperty('--bg-dark', velvetBlue);
        root.setProperty('--text-main', velvetGold);
        root.setProperty('--kirijo-blue', velvetGold); // Acentos en dorado

        // Forzar fondo (para tapar el amarillo de P4)
        if(bgGrid) {
            bgGrid.style.background = velvetBlue;
            bgGrid.style.backgroundImage = `radial-gradient(circle at center, #1a237e 0%, ${velvetBlue} 80%)`;
        }
    },

    // --- CARGA DE DATOS ---

    loadModule: async function(type) {
        const display = document.getElementById('data-display');
        const navContainer = document.getElementById('modules-container');
        if(navContainer) {
            navContainer.querySelectorAll('button').forEach(b => b.classList.remove('active-mod'));
        }

        // --- LÓGICA DE AMBIENTE ---
        if (type === 'fusions') {
            this.setVelvetAtmosphere();
        } else {
            this.resetAtmosphere();
        }

        const isP4 = document.body.classList.contains('theme-p4');
        
        // Mensaje de carga
        if (isP4 && type !== 'fusions') {
             display.innerHTML = '<div class="empty-state" style="color:#000;">Sintonizando el Canal de Medianoche...</div>';
        } else if (type === 'fusions') {
             display.innerHTML = '<div class="empty-state" style="color:#d4af37; font-family:serif; font-style:italic;">"Bienvenido a la Habitación de Terciopelo..."</div>';
        } else {
             display.innerHTML = '<div class="empty-state" style="color:var(--kirijo-blue)">Desencriptando datos de Kirijo Group...</div>';
        }

        let filename = '';
        if (!isP4) {
            if(type === 'school') filename = 'data/p3p_school_answers.json';
            if(type === 'social') filename = 'data/p3p_social_links_master.json';
            if(type === 'missing') filename = 'data/p3p_missing_persons.json';
            if(type === 'fusions') filename = 'data/p3p_special_fusions.json';
        } else {
            if(type === 'school') filename = 'data/p4g_school_answers.json';
            if(type === 'social') filename = 'data/p4g_social_links.json';
            if(type === 'riddle') filename = 'data/p4g_riddles.json';
            if(type === 'lunch') filename = 'data/p4g_lunchbox.json';
            if(type === 'quiz') filename = 'data/p4g_tv_quiz.json';
            if(type === 'fusions') filename = 'data/p4g_special_fusions.json';
        }

        try {
            const response = await fetch(filename);
            if(!response.ok) throw new Error("No se encontró el archivo: " + filename);
            const data = await response.json();
            
            // --- RENDERIZADO ---
            if(type === 'school') this.renderSchool(data, display);
            if(type === 'social') this.renderSocial(data, display);
            if(type === 'fusions') this.renderFusions(data, display); // Universal
            
            if(!isP4) {
                if(type === 'missing') this.renderMissing(data, display);
            }
            if(isP4) {
                if(type === 'riddle') this.renderRiddles(data, display);
                if(type === 'lunch') this.renderLunch(data, display);
                if(type === 'quiz') this.renderQuiz(data, display);
            }

        } catch (error) {
            console.error(error);
            display.innerHTML = `<div class="data-card" style="border-color:var(--alert-red)">
                <h3 style="color:var(--alert-red)">ERROR DE SEÑAL</h3>
                <p>${error.message}</p>
            </div>`;
        }
    },

    // --- RENDERIZADORES ---

    renderSchool: function(data, container) {
        let html = '';
        data.school_year_answers.forEach(month => {
            html += `<div class="data-card">
                <div class="data-title">📅 ${month.month}</div>`;
            month.items.forEach(q => {
                if(q.type === 'exam') {
                    html += `<div style="border-left: 2px solid var(--alert-red); padding-left:10px; margin:15px 0; background:rgba(255, 42, 42, 0.05)">
                                <strong style="color:var(--alert-red); display:block; margin-bottom:5px;">🚨 ${q.title}</strong>`;
                    q.answers.forEach(a => html += `<div style="margin-bottom:3px;"><span style="font-weight:bold;">${a.date}:</span> ${a.answer}</div>`);
                    html += `</div>`;
                } else {
                    html += `<div style="margin-bottom:8px; border-bottom:1px solid #888; padding-bottom:4px;">
                        <span style="color:var(--kirijo-blue); font-weight:bold;">${q.date}</span> <br>
                        ❓ ${q.question} <br>
                        ✅ <strong>${q.answer}</strong> 
                        <span style="font-size:0.8em; opacity:0.8">(${q.stat_boost || 'Info'})</span>
                    </div>`;
                }
            });
            html += `</div>`;
        });
        container.innerHTML = html;
    },

    renderSocial: function(data, container) {
        let html = '';
        data.sort((a,b) => a.id - b.id).forEach(sl => {
            let routeData = null;
            if(sl.type === 'shared' || sl.type === 'shared_automatic') {
                routeData = sl.routes.shared;
            } else {
                routeData = sl.routes[this.state.protagonist]; 
            }
            if (!routeData && sl.routes && sl.routes.male) routeData = sl.routes.male;

            if(!routeData) return;
            const isCritical = routeData.critical_warning ? true : false;
            
            html += `<div class="data-card social-card" style="${isCritical ? 'border-color:var(--alert-red)' : ''}">
                <div class="arcana-header">
                    ${sl.arcana_image ? `<img src="assets/Tarot/${sl.arcana_image}" alt="${sl.arcana_name}" class="arcana-img">` : ''}
                    <div class="data-title no-border">${sl.id}. ${sl.arcana_name}</div>
                </div>
                <div class="social-info-container">
                    <div class="social-details">
                        <div style="font-size:1.1em; margin-bottom: 5px;">👤 <strong>${routeData.character}</strong></div>
                        <div>📍 ${routeData.location}</div>
                        <div>📅 ${routeData.availability || 'Eventos automáticos'}</div>
                        ${routeData.warning_message ? `<div class="data-highlight" style="margin-top:10px;">⚠️ ${routeData.warning_message}</div>` : ''}
                        ${isCritical ? `<div class="data-highlight">⚠️ ${routeData.critical_warning}</div>` : ''}
                    </div>
                    ${routeData.image ? `<img src="assets/characters/${routeData.image}" alt="${routeData.character}" class="character-img">` : ''}
                </div>
                <details>
                    <summary style="cursor:pointer; color:var(--kirijo-blue); font-weight:bold; margin-top: 15px;">ABRIR GUÍA DE RESPUESTAS</summary>
                    <div style="margin-top:15px;">`;
            routeData.ranks.forEach(r => {
                html += `<div style="margin-bottom:12px; background:rgba(0,0,0,0.1); padding:8px; border-radius:4px; border: 1px solid #444;">
                    <strong style="color:var(--kirijo-blue)">Rango ${r.rank}</strong> 
                    ${r.date ? `<span style="font-size:0.8em">(${r.date})</span>` : ''}`;
                if(r.type === 'automatic') html += `<div style="opacity:0.7; font-style:italic;">Evento Automático</div>`;
                else if (r.responses) {
                    r.responses.forEach(resp => {
                        html += `<div style="margin-top:5px; padding-left:10px; border-left:2px solid #666;">
                             "${resp.context.substring(0,40)}..." <br>
                             👉 <span style="font-weight:bold;">${resp.best_choice}</span>
                             ${resp.romance_flag ? '❤️' : ''}
                        </div>`;
                    });
                }
                if (r.context && r.best_choice && !r.responses) html += `<div style="margin-top:5px;"><strong>Misión:</strong> ${r.context}<br>👉 ${r.best_choice}</div>`;
                html += `</div>`;
            });
            html += `</div></details></div>`;
        });
        container.innerHTML = html;
    },

    renderMissing: function(data, container) {
        let html = '<h3 style="color:var(--alert-red); text-align:center; text-transform:uppercase; letter-spacing:2px;">🚨 Personas Desaparecidas 🚨</h3>';
        data.sort((a, b) => {
            const getWeight = (dateStr) => {
                const [m, d] = dateStr.split('/').map(Number);
                const month = m < 4 ? m + 12 : m; 
                return (month * 100) + d; 
            };
            return getWeight(a.available_date) - getWeight(b.available_date);
        });
        data.forEach(p => {
            const isCritical = p.type === 'critical_social_link';
            const borderStyle = isCritical ? 'border: 2px solid var(--alert-red); box-shadow: 0 0 15px rgba(255, 42, 42, 0.2);' : 'border-left: 4px solid var(--alert-red);';
            html += `<div class="data-card" style="${borderStyle}">
                <div class="data-title" style="display:flex; justify-content:space-between; border-bottom-color: #500;">
                    <span style="color:var(--alert-red); font-weight:bold;">📅 Disponible: ${p.available_date}</span>
                    <span style="font-size:0.9em; opacity:0.8; color:#ffcccc;">Límite: ${p.deadline}</span>
                </div>
                <div style="margin:10px 0;">
                    <strong style="font-size:1.1em; color: #fff;">${p.name}</strong> <br>
                    <span style="color:#aaa">📍 ${p.location}</span> <br>
                    🎁 <span style="color:#ff6b6b">${p.reward}</span>
                </div>
                ${isCritical ? `<div class="data-highlight" style="background:rgba(60, 0, 0, 0.9); border: 1px solid var(--alert-red); color: #fff; padding:10px; border-radius:4px; margin-top: 10px; font-size: 0.9em;">⚠️ <strong>IMPORTANTE:</strong> ${p.warning_message}</div>` : ''}
            </div>`;
        });
        container.innerHTML = html;
    },

    renderFusions: function(data, container) {
        const velvetBlue = '#0a0e29';
        const velvetGold = '#d4af37';
        const velvetText = '#e0e0e0';

        let html = `
        <div style="background: linear-gradient(180deg, #000020 0%, #1a237e 100%); border: 3px double ${velvetGold}; padding: 20px; border-radius: 8px; color: ${velvetText}; text-align: center; margin-bottom: 30px; box-shadow: 0 0 20px rgba(26, 35, 126, 0.5);">
            <h2 style="color: ${velvetGold}; font-family: 'Georgia', serif; letter-spacing: 4px; border-bottom: 1px solid ${velvetGold}; padding-bottom: 10px; margin-bottom: 5px; font-weight: normal; text-transform: uppercase;">The Velvet Room</h2>
            <div style="font-size: 0.9em; font-style: italic; opacity: 0.8; font-family: serif;">"El lugar que existe entre el sueño y la realidad..."</div>
        </div>
        `;
        
        // Special Spreads
        html += `<h4 style="color:${velvetGold}; border-bottom: 1px solid ${velvetBlue}; margin-top:20px; font-family: serif; text-transform: uppercase;">Special Spreads</h4>`;
        data.special_spreads.forEach(f => {
            html += `<div class="data-card" style="border: 1px solid ${velvetGold}; background: rgba(10, 14, 41, 0.95); color:${velvetText}; margin-bottom: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.8);">
                <div style="border-bottom: 1px solid ${velvetGold}; padding:8px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.1em; color:${velvetGold}; font-family: serif;">${f.result} (Lv ${f.level})</span>
                    <span style="font-size:0.8em; opacity:0.9; background:#000; padding:2px 6px; border-radius:2px; border:1px solid #444;">${f.arcana}</span>
                </div>
                <div style="padding:15px;">
                    <div style="color:#aaa; font-size:0.9em; margin-bottom:5px; font-style:italic;">${f.type || 'Fusion'}</div>
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border:1px solid #333; font-family:monospace; margin-bottom:10px; color:#fff;">
                        ${f.ingredients.join(' + ')}
                    </div>
                    ${f.req_item ? `<div style="color:#ff6b6b; font-size:0.9em;">🔒 ${f.req_item}</div>` : ''}
                    ${f.note ? `<div style="color:#888; font-style:italic; font-size:0.9em; margin-top:5px;">💡 ${f.note}</div>` : ''}
                </div>
            </div>`;
        });

        // Max S.Link Ultimates
        html += `<h4 style="color:${velvetGold}; border-bottom: 1px solid ${velvetBlue}; margin-top:40px; font-family: serif; text-transform: uppercase;">Ultimate Social Link Personas</h4>`;
        html += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px; margin-top:15px;">';
        data.max_social_link_ultimates.forEach(u => {
             html += `<div style="background:rgba(10, 14, 41, 0.8); border:1px solid #444; padding:10px; text-align:center;">
                <strong style="color:${velvetGold}; display:block; font-family: serif; font-size: 1.1em;">${u.persona}</strong>
                <span style="font-size:0.8em; color:#aaa;">Lv ${u.level} - ${u.arcana}</span>
                <div style="font-size:0.75em; margin-top:5px; color:#fff;">${u.req_item}</div>
            </div>`;
        });
        html += '</div>';
        
        container.innerHTML = html;
    },

    renderRiddles: function(data, container) {
        let html = '<h3 style="color:#000; text-align:center; background:#ffe600; border:2px solid #000; padding:10px; transform:skew(-2deg);">🎩 DESAFÍOS DEL FUNKY STUDENT</h3>';
        data.forEach(r => {
            html += `<div class="data-card" style="border: 2px solid #008fb3; background: #fff; color:#000; margin-bottom: 20px; box-shadow: 5px 5px 0px #008fb3;">
                <div style="background:#008fb3; color:#fff; padding:10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.1em; text-transform:uppercase;">${r.title}</span>
                    <span style="background:#fff; color:#008fb3; padding:2px 8px; border-radius:10px; font-size:0.8em; box-shadow: 2px 2px 0px rgba(0,0,0,0.2);">🎁 ${r.reward}</span>
                </div>
                <div style="padding:15px;">
                    <div style="font-size:0.9em; margin-bottom:10px; color:#555;">📍 ${r.unlock_condition}</div>
                    <div style="display:flex; gap:10px; margin-bottom:15px; font-family:monospace; font-size:1.1em;">
                        <div style="flex:1; background:#f0f0f0; padding:10px; border-radius:5px;">
                            <strong style="color:#e60012">Grupo A:</strong><br>${r.question_a}
                        </div>
                        <div style="flex:1; background:#f0f0f0; padding:10px; border-radius:5px;">
                            <strong style="color:#005f73">Grupo B:</strong><br>${r.question_b}
                        </div>
                    </div>
                    <div style="background:#ffe600; color:#000; padding:10px; border:2px dashed #000; text-align:center; font-weight:bold; font-size:1.1rem;">
                        👉 Respuesta: ${r.answer}
                    </div>
                    <div style="margin-top:5px; font-size:0.85em; color:#666; font-style:italic;">💡 Por qué: ${r.explanation}</div>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    renderLunch: function(data, container) {
        let html = '<h3 style="color:#fff; text-align:center; background:#ff8800; border:2px solid #000; padding:10px; transform:skew(-2deg); text-transform:uppercase;">🍱 Menú de Cocina (LunchBox)</h3>';
        data.forEach(item => {
            let favsHtml = item.favorites.map(char => 
                `<span style="background:#fff; color:#ff8800; padding:2px 8px; border-radius:10px; font-size:0.8em; margin-right:5px; border:1px solid #ff8800;">${char}</span>`
            ).join('');
            html += `<div class="data-card" style="border: 2px solid #ff8800; background: #fff; color:#000; margin-bottom: 20px; box-shadow: 5px 5px 0px rgba(255, 136, 0, 0.4);">
                <div style="background:#ff8800; color:#fff; padding:5px 10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.1em;">📅 ${item.date}</span>
                    <span style="font-size:0.9em; opacity:0.9">🍽️ ${item.dish}</span>
                </div>
                <div style="padding:15px;">
                    <div style="margin-bottom:15px;">
                        <div style="font-size:0.85em; color:#666; margin-bottom:5px; text-transform:uppercase; font-weight:bold;">Clave del éxito:</div>
                        <div style="font-size:1.2em; font-weight:bold; color:#d65c00; border-bottom: 2px dashed #ff8800; padding-bottom:5px;">
                            👉 ${item.correct_choice}
                        </div>
                    </div>
                    <div><div style="font-size:0.85em; color:#666; margin-bottom:5px;">A quién le gusta:</div><div>${favsHtml}</div></div>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    renderQuiz: function(data, container) {
        let html = '<h3 style="color:#fff; text-align:center; background:#9d00ff; border:2px solid #fff; padding:15px; text-transform:uppercase; box-shadow: 0 0 15px #9d00ff; text-shadow: 0 0 5px #fff;">📺 MIRACLE QUIZ SHOW</h3>';
        data.forEach(stage => {
            html += `<div class="data-card" style="border: 2px solid #9d00ff; background: #220033; color:#fff; margin-bottom: 30px; box-shadow: 0 0 20px rgba(157, 0, 255, 0.4);">
                <div style="background:linear-gradient(90deg, #9d00ff, #5e0099); color:#fff; padding:10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #fff;">
                    <span style="font-size:1.2em; text-transform:uppercase;">🏆 ${stage.stage}</span>
                    <span style="font-size:0.8em; background:#000; padding:3px 8px; border-radius:4px;">${stage.unlock_condition}</span>
                </div>
                <div style="padding:15px;">
                    <div style="margin-bottom:15px; color:#dca3ff; font-style:italic;">🎁 Recompensa: ${stage.reward}</div>
                    <div style="display:grid; grid-template-columns: 1fr; gap:10px;">`;
            stage.questions.forEach((q, index) => {
                html += `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:5px; border-left: 3px solid #dca3ff;">
                    <div style="font-weight:bold; color:#fff; margin-bottom:5px;">Q${index+1}: ${q.q}</div>
                    <div style="color:#9d00ff; background:#fff; display:inline-block; padding:2px 8px; border-radius:3px; font-weight:bold; font-size:0.9em;">A: ${q.a}</div>
                </div>`;
            });
            html += `</div></div></div>`;
        });
        container.innerHTML = html;
    }
};

// Iniciar
document.addEventListener('DOMContentLoaded', () => app.init());