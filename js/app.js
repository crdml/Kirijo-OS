const app = {
    state: {
        protagonist: 'male', // Por defecto: Makoto
        user: "Artemis" // Nick fijo
    },

    init: function() {
        this.bootSequence();
        this.updateClock();
        setInterval(() => this.updateClock(), 60000);
    },

    // 1. Secuencia de Arranque (Modificada)
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

    openGame: function(gameId) {
        if(gameId === 'p3p') {
            this.changeView('view-game-interface');
        }
    },

    goHome: function() {
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
            root.setProperty('--kirijo-dim', '#6b002c');  // Rosa oscuro para bordes tenues
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
            const moduleName = currentModuleBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
            this.loadModule(moduleName);
        }
    },

    // --- CARGA DE DATOS ---

    loadModule: async function(type) {
        const display = document.getElementById('data-display');
        display.innerHTML = '<div class="empty-state" style="color:var(--kirijo-blue)">Desencriptando datos de Kirijo Group...</div>';
        
        // Gestión de clase activa en botones
        document.querySelectorAll('.modules-nav button').forEach(b => b.classList.remove('active-mod'));
        // Buscar el botón clicado (esto es un truco rápido para añadir la clase active)
        const btns = document.querySelectorAll('.modules-nav button');
        if(type === 'school') btns[0].classList.add('active-mod');
        if(type === 'social') btns[1].classList.add('active-mod');
        if(type === 'missing') btns[2].classList.add('active-mod');
        if(type === 'fusions') btns[3].classList.add('active-mod');

        // Mapeo de archivos (Deben coincidir con los que tienes en carpeta 'data')
        let filename = '';
        if(type === 'school') filename = 'data/p3p_school_answers.json';
        if(type === 'social') filename = 'data/p3p_social_links_master.json';
        if(type === 'missing') filename = 'data/p3p_missing_persons.json';
        if(type === 'fusions') filename = 'data/p3p_special_fusions.json';

        try {
            const response = await fetch(filename);
            if(!response.ok) throw new Error("No se pudo leer el archivo local. Asegúrate de usar un servidor local o subirlo a la web.");
            const data = await response.json();
            
            if(type === 'school') this.renderSchool(data, display);
            if(type === 'social') this.renderSocial(data, display);
            if(type === 'missing') this.renderMissing(data, display);
            if(type === 'fusions') this.renderFusions(data, display);

        } catch (error) {
            display.innerHTML = `<div class="data-card" style="border-color:var(--alert-red)">
                <h3 style="color:var(--alert-red)">ERROR DE SISTEMA</h3>
                <p>${error.message}</p>
                <small>Nota: Chrome bloquea leer JSON locales por seguridad. Usa una extensión como "Web Server for Chrome" o sube esto a GitHub Pages.</small>
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
                    q.answers.forEach(a => html += `<div style="margin-bottom:3px;"><span style="color:#fff">${a.date}:</span> ${a.answer}</div>`);
                    html += `</div>`;
                } else {
                    html += `<div style="margin-bottom:8px; border-bottom:1px solid #222; padding-bottom:4px;">
                        <span style="color:var(--kirijo-blue); font-weight:bold;">${q.date}</span> <br>
                        ❓ ${q.question} <br>
                        ✅ <strong style="color:#fff">${q.answer}</strong> 
                        <span style="color:var(--text-dim); font-size:0.8em">(${q.stat_boost || 'Info'})</span>
                    </div>`;
                }
            });
            html += `</div>`;
        });
        container.innerHTML = html;
    },

    // Reemplaza toda la función renderSocial por esta:
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

            if(!routeData) return; // Si no existe ruta para este género

            // Alerta roja si es crítico (ej: Shinjiro)
            const isCritical = routeData.critical_warning ? true : false;

            html += `<div class="data-card social-card" style="${isCritical ? 'border-color:var(--alert-red)' : ''}">
                
                <div class="arcana-header">
                    <img src="assets/Tarot/${sl.arcana_image}" alt="${sl.arcana_name}" class="arcana-img">
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
                html += `<div style="margin-bottom:12px; background:rgba(0,0,0,0.3); padding:8px; border-radius:4px;">
                    <strong style="color:var(--kirijo-blue)">Rango ${r.rank}</strong> 
                    ${r.date ? `<span style="font-size:0.8em">(${r.date})</span>` : ''}`;
                
                if(r.type === 'automatic') {
                    html += `<div style="color:var(--text-dim); font-style:italic;">Evento Automático</div>`;
                } else if (r.responses) {
                    r.responses.forEach(resp => {
                        html += `<div style="margin-top:5px; padding-left:10px; border-left:2px solid #444;">
                             "${resp.context.substring(0,40)}..." <br>
                             👉 <span style="color:#fff; font-weight:bold;">${resp.best_choice}</span>
                             ${resp.romance_flag ? '❤️' : ''}
                        </div>`;
                    });
                }
                html += `</div>`;
            });

            html += `</div></details></div>`;
        });
        container.innerHTML = html;
    },

    renderMissing: function(data, container) {
        let html = '<h3 style="color:var(--alert-red); text-align:center;">PERSONAS DESAPARECIDAS</h3>';
        
        // ORDENAMIENTO CRONOLÓGICO
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
            
            html += `<div class="data-card" style="${isCritical ? 'border: 2px solid var(--alert-red); box-shadow: 0 0 15px rgba(255, 42, 42, 0.15);' : ''}">
                <div class="data-title" style="display:flex; justify-content:space-between; ${isCritical ? 'color:var(--alert-red)' : ''}">
                    <span>📅 Disponible: ${p.available_date}</span>
                    <span style="font-size:0.9em; opacity:0.8">Límite: ${p.deadline}</span>
                </div>
                <div style="margin:10px 0;">
                    <strong style="font-size:1.1em; color: #fff;">${p.name}</strong> <br>
                    📍 ${p.location} <br>
                    🎁 <span style="color:var(--kirijo-blue)">${p.reward}</span>
                </div>
                
                ${isCritical ? `<div class="data-highlight" style="background:rgba(60, 0, 0, 0.8); border: 1px solid var(--alert-red); color: #ffcccc; padding:8px; border-radius:4px; margin-top: 10px; font-size: 0.9em;">🚨 <strong>IMPORTANTE:</strong> ${p.warning_message}</div>` : ''}
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
    }
};

// Iniciar
document.addEventListener('DOMContentLoaded', () => app.init());