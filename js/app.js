const app = {
    state: {
        protagonist: 'male', // Por defecto: Makoto
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
            { id: 'fusions', label: '🃏 Fusiones', colorClass: 'p4-btn-6' }     // Margaret
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
        
        // Mensaje inicial
        log.innerHTML = "> Initializing system...<br>";

        // Secuencia temporal
        setTimeout(() => log.innerHTML += "> Authenticating biometrics...<br>", 800);
        setTimeout(() => log.innerHTML += "> Identity Confirmed: Artemis.<br>", 1600);
        
        setTimeout(() => {
            // TU MENSAJE PERSONALIZADO
            log.innerHTML += "> Welcome Artemis from S.E.E.S.";
            
            // Actualizar el header del dashboard también
            document.getElementById('user-nick').innerText = "Artemis (S.E.E.S)";
            
            // Mostrar botón rojo
            const btn = document.getElementById('btn-login');
            btn.classList.remove('hidden');
            
            // Listener para entrar
            btn.onclick = () => {
                this.changeView('view-dashboard');
            };
        }, 2500);
    },

    changeView: function(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        
        // Ocultar vistas no activas para rendimiento
        if(viewId === 'view-dashboard') {
            document.querySelectorAll('.view').forEach(v => {
                if(v.id !== 'view-dashboard') v.classList.add('hidden');
            });
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
        
        // 1. Configurar Tema y Títulos
        const titleEl = document.querySelector('.current-module-title');
        const genderSwitch = document.querySelector('.gender-switch');
        
        if(gameId === 'p3p') {
            // Estilo P3P (Dark)
            document.body.classList.remove('theme-p4'); // Quitar tema P4 si estaba
            titleEl.innerText = "P3P DATABASE";
            genderSwitch.style.display = 'flex'; // Mostrar selector de género
            
            // Resetear a azul por defecto (Makoto)
            this.setGender('male'); 
        } 
        else if(gameId === 'p4g') {
            // Estilo P4G (Yellow Pop)
            document.body.classList.add('theme-p4');
            titleEl.innerText = "TV WORLD NAV";
            genderSwitch.style.display = 'none'; // P4 no tiene FeMC
            
            // Limpiar datos anteriores
             document.getElementById('data-display').innerHTML = 
                '<div class="empty-state" style="color:#000; font-weight:bold; font-style:italic;">Selecciona un canal...</div>';
        }

        // 2. GENERAR BOTONES DE NAVEGACIÓN DINÁMICAMENTE
        const navContainer = document.getElementById('modules-container');
        navContainer.innerHTML = ''; // Limpiar botones anteriores

        if (this.gameConfig[gameId]) {
            this.gameConfig[gameId].forEach(btn => {
                const button = document.createElement('button');
                button.innerHTML = btn.label;
                button.className = btn.colorClass; // Clases específicas para colores
                button.onclick = () => this.loadModule(btn.id);
                
                // Si es P3P y es el botón de desaparecidos, aseguramos la clase 'alert-text'
                if(gameId === 'p3p' && btn.id === 'missing') {
                    button.classList.add('alert-text');
                }
                
                navContainer.appendChild(button);
            });
        }
    },

    goHome: function() {
        // Quitar tema P4 para volver al Dashboard oscuro
        document.body.classList.remove('theme-p4');
        
        // Resetear variables CSS globales por si acaso
        const root = document.documentElement.style;
        root.setProperty('--bg-dark', '#050505');
        root.setProperty('--text-main', '#e0f7ff');

        this.changeView('view-dashboard');
        document.getElementById('data-display').innerHTML = '<div class="empty-state">Seleccione un módulo de datos.</div>';
    },

    setGender: function(gender) {
        this.state.protagonist = gender;
        
        // --- LÓGICA DE CAMBIO DE COLOR (BLUE VS PINK) ---
        const root = document.documentElement.style;
        
        if (gender === 'female') {
            // MODO KOTONE (FEMC): Rosa Vibrante
            root.setProperty('--kirijo-blue', '#fe0067'); // Rosa P3P
            root.setProperty('--kirijo-dim', '#6b002c');  // Rosa oscuro
        } else {
            // MODO MAKOTO (MC): Azul Kirijo Original
            root.setProperty('--kirijo-blue', '#00d2ff'); // Azul Cyan
            root.setProperty('--kirijo-dim', '#005f73');  // Azul oscuro
        }

        // Actualizar botones visualmente
        document.getElementById('btn-male').classList.toggle('active', gender === 'male');
        document.getElementById('btn-female').classList.toggle('active', gender === 'female');
        
        // Si hay un módulo abierto, recargarlo para mostrar los datos del nuevo género
        const currentModuleBtn = document.querySelector('.modules-nav button.active-mod');
        if(currentModuleBtn) {
            // Simulamos clic recargando el módulo actual
            // Obtenemos el ID del módulo basado en el texto o índice (simplificado aquí)
            // Para robustez, mejor reiniciar la vista o no hacer nada si no es crítico.
            // En este caso, dejaremos que el usuario navegue.
        }
    },

    // --- CARGA DE DATOS ---

    loadModule: async function(type) {
        const display = document.getElementById('data-display');
        
        // Gestión visual de botones activos
        const navContainer = document.getElementById('modules-container');
        if(navContainer) {
            navContainer.querySelectorAll('button').forEach(b => b.classList.remove('active-mod'));
            // Intentamos marcar el botón actual (truco simple basado en el texto del botón o orden)
            // Para simplificar, confiaremos en que el usuario ve el cambio de contenido.
        }

        // Detectar Juego
        const isP4 = document.body.classList.contains('theme-p4');
        
        // Mensaje de carga con estilo según el juego
        if (isP4) {
             display.innerHTML = '<div class="empty-state" style="color:#000;">Sintonizando el Canal de Medianoche...</div>';
        } else {
             display.innerHTML = '<div class="empty-state" style="color:var(--kirijo-blue)">Desencriptando datos de Kirijo Group...</div>';
        }

        let filename = '';

        // --- LÓGICA DE SELECCIÓN DE ARCHIVO ---
        if (!isP4) {
            // Archivos de P3P
            if(type === 'school') filename = 'data/p3p_school_answers.json';
            if(type === 'social') filename = 'data/p3p_social_links_master.json';
            if(type === 'missing') filename = 'data/p3p_missing_persons.json';
            if(type === 'fusions') filename = 'data/p3p_special_fusions.json';
        } else {
            // Archivos de P4G
            if(type === 'school') filename = 'data/p4g_school_answers.json';
            if(type === 'social') filename = 'data/p4g_social_links.json';
            if(type === 'riddle') filename = 'data/p4g_riddles.json';
            
            // Placeholder para los que aún no creamos
            if(type === 'lunch' || type === 'quiz' || type === 'fusions') {
                display.innerHTML = '<div class="data-card"><h3>🚧 En construcción</h3><p>Este canal aún no emite señal.</p></div>';
                return;
            }
        }

        try {
            const response = await fetch(filename);
            if(!response.ok) throw new Error("No se encontró el archivo de datos.");
            const data = await response.json();
            
            // Renderizar usando las mismas funciones (Reutilización de código)
            if(type === 'school') this.renderSchool(data, display);
            if(type === 'social') this.renderSocial(data, display);
            
            // Renderizadores específicos de P3P (solo si estamos en P3P)
            if(!isP4) {
                if(type === 'missing') this.renderMissing(data, display);
                if(type === 'fusions') this.renderFusions(data, display);
            }
            // Renderizadores específicos de P4G
            if(isP4) {
                if(type === 'riddle') this.renderRiddles(data, display);
            }

        } catch (error) {
            display.innerHTML = `<div class="data-card" style="border-color:var(--alert-red)">
                <h3 style="color:var(--alert-red)">ERROR DE SEÑAL</h3>
                <p>${error.message}</p>
                <small>Verifica que el archivo JSON esté en la carpeta /data y tenga el nombre correcto.</small>
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
                    // Estilo de examen
                    html += `<div style="border-left: 2px solid var(--alert-red); padding-left:10px; margin:15px 0; background:rgba(255, 42, 42, 0.05)">
                                <strong style="color:var(--alert-red); display:block; margin-bottom:5px;">🚨 ${q.title}</strong>`;
                    q.answers.forEach(a => html += `<div style="margin-bottom:3px;"><span style="font-weight:bold;">${a.date}:</span> ${a.answer}</div>`);
                    html += `</div>`;
                } else {
                    // Pregunta normal
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
        // Ordenar por ID
        data.sort((a,b) => a.id - b.id).forEach(sl => {
            let routeData = null;
            
            // Selección de ruta según género
            if(sl.type === 'shared' || sl.type === 'shared_automatic') {
                routeData = sl.routes.shared;
            } else {
                routeData = sl.routes[this.state.protagonist]; 
            }

            // Fallback para P4G (siempre usa ruta 'male' por ahora)
            if (!routeData && sl.routes && sl.routes.male) {
                routeData = sl.routes.male;
            }

            if(!routeData) return; // Si no existe ruta

            const isCritical = routeData.critical_warning ? true : false;
            const isP4 = document.body.classList.contains('theme-p4');

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
                
                if(r.type === 'automatic') {
                    html += `<div style="opacity:0.7; font-style:italic;">Evento Automático</div>`;
                } else if (r.responses) {
                    r.responses.forEach(resp => {
                        html += `<div style="margin-top:5px; padding-left:10px; border-left:2px solid #666;">
                             "${resp.context.substring(0,40)}..." <br>
                             👉 <span style="font-weight:bold;">${resp.best_choice}</span>
                             ${resp.romance_flag ? '❤️' : ''}
                        </div>`;
                    });
                }
                // Si hay notas (como en Margaret o el Zorro)
                if (r.context && r.best_choice && !r.responses) {
                     html += `<div style="margin-top:5px;"><strong>Misión:</strong> ${r.context}<br>👉 ${r.best_choice}</div>`;
                }

                html += `</div>`;
            });

            html += `</div></details></div>`;
        });
        container.innerHTML = html;
    },

    renderMissing: function(data, container) {
        // Título de la sección
        let html = '<h3 style="color:var(--alert-red); text-align:center; text-transform:uppercase; letter-spacing:2px;">🚨 Personas Desaparecidas 🚨</h3>';
        
        // ORDENAMIENTO CRONOLÓGICO (Enero va después de Diciembre)
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
            
            // Estilo de borde rojo
            const borderStyle = isCritical 
                ? 'border: 2px solid var(--alert-red); box-shadow: 0 0 15px rgba(255, 42, 42, 0.2);' 
                : 'border-left: 4px solid var(--alert-red);';

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
        let html = '<h3>FUSIONES ESPECIALES</h3>';
        
        html += '<h4 style="color:var(--kirijo-blue)">Spread Fusions</h4>';
        data.special_spreads.forEach(f => {
            html += `<div class="data-card">
                <div class="data-title">${f.result} (Lv ${f.level}) - ${f.arcana}</div>
                <div style="color:var(--text-dim); margin-bottom:5px;">${f.type}</div>
                <div style="background:#000; padding:10px; border-radius:4px; font-family:monospace; color:#ccc;">
                    ${f.ingredients.join(' + ')}
                </div>
                ${f.req_item ? `<div style="color:orange; margin-top:5px; font-size:0.9em">🔒 Req: ${f.req_item}</div>` : ''}
            </div>`;
        });

        html += '<h4 style="color:var(--kirijo-blue); margin-top:30px;">Social Link Ultimates</h4>';
        data.max_social_link_ultimates.forEach(f => {
             html += `<div class="data-card">
                <div class="data-title">${f.persona} (Lv ${f.level}) - ${f.arcana}</div>
                <div>Requiere: <strong>${f.req_item}</strong></div>
                <div style="font-size:0.9em; color:var(--text-dim)">${f.fusion_method}</div>
            </div>`;
        });

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
                            <strong style="color:#e60012">Grupo A:</strong><br>
                            ${r.question_a}
                        </div>
                        <div style="flex:1; background:#f0f0f0; padding:10px; border-radius:5px;">
                            <strong style="color:#005f73">Grupo B:</strong><br>
                            ${r.question_b}
                        </div>
                    </div>

                    <div style="background:#ffe600; color:#000; padding:10px; border:2px dashed #000; text-align:center; font-weight:bold; font-size:1.1rem;">
                        👉 Respuesta: ${r.answer}
                    </div>
                    <div style="margin-top:5px; font-size:0.85em; color:#666; font-style:italic;">
                        💡 Por qué: ${r.explanation}
                    </div>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }
};

// Iniciar
document.addEventListener('DOMContentLoaded', () => app.init());