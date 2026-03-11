const app = {
    state: {
        protagonist: 'male', // Por defecto: Makoto (P3) / Yu (P4) / Ren (P5)
        user: "Artemis"
    },

    // Configuración de los botones (módulos) para cada juego
    gameConfig: {
        p3p: [
            { id: 'school', label: '📝 Escuela', colorClass: '' },
            { id: 'social', label: '🤝 Vínculos', colorClass: '' },
            { id: 'missing', label: '🕵️ Desaparecidos', colorClass: 'alert-text' },
            { id: 'requests', label: '👠 Misiones', colorClass: '' },
            { id: 'tartarus', label: '💀 Jefes', colorClass: 'alert-text' },
            { id: 'fusions', label: '🔮 Fusiones', colorClass: '' }
        ],
        p3r: [
            { id: 'school', label: '📝 Escuela', colorClass: '' },
            { id: 'social', label: '🤝 Vínculos', colorClass: '' },
            { id: 'linked', label: '🔗 Episodios', colorClass: '' },
            { id: 'dorm', label: '🛏️ Dormitorio', colorClass: '' },
            { id: 'fragments', label: '💎 Fragmentos', colorClass: '' },
            { id: 'missing', label: '🕵️ Desaparecidos', colorClass: 'alert-text' },
            { id: 'requests', label: '👠 Misiones', colorClass: '' },
            { id: 'tartarus', label: '💀 Jefes', colorClass: 'alert-text' },
            { id: 'fusions', label: '🔮 Fusiones', colorClass: '' }
        ],
        p4g: [
            { id: 'school', label: '🎓 Exámenes', colorClass: 'p4-btn-1' },
            { id: 'social', label: '👓 Social Links', colorClass: 'p4-btn-2' },
            { id: 'lunch', label: '🍱 LunchBox', colorClass: 'p4-btn-3' },
            { id: 'books', label: '📖 Libros', colorClass: 'p4-btn-4' },
            { id: 'quiz', label: '📺 TV Quiz', colorClass: 'p4-btn-4' },
            { id: 'riddle', label: '🎩 Riddles', colorClass: 'p4-btn-5' },
            { id: 'fusions', label: '🃏 Fusiones', colorClass: 'p4-btn-6' },
            { id: 'quests', label: '🦊 Misiones', colorClass: 'p4-btn-7' }
        ],
        p5r: [
            { id: 'school', label: '🎓 Exámenes', colorClass: '' },
            { id: 'social', label: '🎭 Confidants', colorClass: '' },
            { id: 'seeds', label: '💀 Semillas', colorClass: '' },
            { id: 'crossword', label: '🧩 Crucigramas', colorClass: '' },
            { id: 'mementos', label: '🚗 Mementos', colorClass: '' },
            { id: 'jazz', label: '🎷 Jazz Club', colorClass: '' },
            { id: 'fusions', label: '⛓️ Fusiones', colorClass: '' }
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
        if(!log) return;
        
        log.innerHTML = "> Initializing system...<br>";
        setTimeout(() => log.innerHTML += "> Authenticating biometrics...<br>", 800);
        setTimeout(() => log.innerHTML += "> Identity Confirmed: Artemis.<br>", 1600);
        
        setTimeout(() => {
            log.innerHTML += "> Welcome Artemis from S.E.E.S.";
            const userNick = document.getElementById('user-nick');
            if(userNick) userNick.innerText = "Artemis (S.E.E.S)";
            
            const btn = document.getElementById('btn-login');
            if(btn) {
                btn.classList.remove('hidden');
                btn.onclick = () => {
                    this.changeView('view-dashboard');
                };
            }
        }, 2500);
    },

    changeView: function(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(viewId);
        if(target) target.classList.add('active');
        
        if(viewId === 'view-dashboard') {
            document.querySelectorAll('.view').forEach(v => {
                if(v.id !== 'view-dashboard') v.classList.add('hidden');
            });
            this.resetAtmosphere();
        }
    },

    updateClock: function() {
        const now = new Date();
        const clock = document.getElementById('clock');
        if(clock) {
            clock.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    },

    // --- NAVEGACIÓN ENTRE JUEGOS ---

    openGame: function(gameId) {
        this.changeView('view-game-interface');
        const titleEl = document.querySelector('.current-module-title');
        const genderSwitch = document.querySelector('.gender-switch');
        const navContainer = document.getElementById('modules-container');
        
        navContainer.setAttribute('data-game', gameId);
        
        this.resetAtmosphere();

        // Configuración específica por juego
        if(gameId === 'p3p') {
            titleEl.innerText = "P3P DATABASE";
            genderSwitch.style.display = 'flex';
            this.setGender('male'); // Reset a MC por defecto
        } 
        else if(gameId === 'p3r') {
            document.body.classList.add('theme-p3r');
            titleEl.innerText = "P3 RELOAD SYSTEM";
            genderSwitch.style.display = 'none';
        }
        else if(gameId === 'p4g') {
            document.body.classList.add('theme-p4');
            titleEl.innerText = "TV WORLD NAV";
            genderSwitch.style.display = 'none';
        }
        else if(gameId === 'p5r') {
            document.body.classList.add('theme-p5r');
            titleEl.innerText = "PHANTOM THIEVES NAV";
            genderSwitch.style.display = 'none';
        }

        // Generar botones de módulos
        navContainer.innerHTML = ''; 
        if (this.gameConfig[gameId]) {
            this.gameConfig[gameId].forEach(btn => {
                const button = document.createElement('button');
                button.innerHTML = btn.label;
                button.className = btn.colorClass;
                button.setAttribute('data-type', btn.id); // Marcador para recarga
                button.onclick = () => {
                    // Gestionar clase activa
                    navContainer.querySelectorAll('button').forEach(b => b.classList.remove('active-mod'));
                    button.classList.add('active-mod');
                    this.loadModule(btn.id, gameId);
                };
                
                if((gameId === 'p3p' || gameId === 'p3r') && (btn.id === 'missing' || btn.id === 'tartarus')) {
                    button.classList.add('alert-text');
                }
                navContainer.appendChild(button);
            });
        }
        
        document.getElementById('data-display').innerHTML = '<div class="empty-state">Seleccione un módulo de datos.</div>';
    },

    goHome: function() {
        this.resetAtmosphere();
        this.changeView('view-dashboard');
        document.getElementById('data-display').innerHTML = '<div class="empty-state">Seleccione un módulo de datos.</div>';
    },

    setGender: function(gender) {
        // 1. Cambiar estado
        this.state.protagonist = gender;
        
        // 2. Cambiar Colores (CSS) - Solo afecta si NO es P3R/P5R (que tienen temas propios)
        const root = document.documentElement.style;
        const isP3R = document.body.classList.contains('theme-p3r');
        const isP5R = document.body.classList.contains('theme-p5r');

        if (!isP3R && !isP5R) { 
            if (gender === 'female') {
                root.setProperty('--kirijo-blue', '#fe0067'); 
                root.setProperty('--kirijo-dim', '#6b002c');
            } else {
                root.setProperty('--kirijo-blue', '#00d2ff');
                root.setProperty('--kirijo-dim', '#005f73');
            }
        }

        // 3. Actualizar botones visualmente
        const btnMale = document.getElementById('btn-male');
        const btnFemale = document.getElementById('btn-female');
        if(btnMale && btnFemale) {
            btnMale.classList.toggle('active', gender === 'male');
            btnFemale.classList.toggle('active', gender === 'female');
        }

        // 4. ¡REFRESCAR LA VISTA ACTUAL!
        const navContainer = document.getElementById('modules-container');
        const activeGame = navContainer ? navContainer.getAttribute('data-game') : null;
        
        if (activeGame === 'p3p') {
            const activeBtn = navContainer.querySelector('button.active-mod');
            if (activeBtn) {
                const moduleType = activeBtn.getAttribute('data-type');
                if(moduleType) this.loadModule(moduleType, 'p3p');
            }
        }
    },

    // --- GESTIÓN DE AMBIENTE ---
    resetAtmosphere: function() {
        const root = document.documentElement.style;
        const bgGrid = document.querySelector('.bg-grid');
        
        document.body.classList.remove('theme-p4');
        document.body.classList.remove('theme-p3r');
        document.body.classList.remove('theme-p5r');

        root.removeProperty('--bg-dark');
        root.removeProperty('--text-main');
        root.removeProperty('--kirijo-blue');
        root.removeProperty('--kirijo-dim');
        
        document.body.style.background = '';
        document.body.style.backgroundImage = '';
        
        if(bgGrid) {
            bgGrid.style.background = '';
            bgGrid.style.backgroundImage = '';
            bgGrid.style.opacity = '1';
        }
    },

    setVelvetAtmosphere: function() {
        const root = document.documentElement.style;
        const bgGrid = document.querySelector('.bg-grid');
        const velvetBlue = '#0a0e29';
        const velvetGold = '#d4af37';

        root.setProperty('--bg-dark', velvetBlue);
        root.setProperty('--text-main', velvetGold);
        root.setProperty('--kirijo-blue', velvetGold);

        if(bgGrid) {
            bgGrid.style.background = velvetBlue;
            bgGrid.style.backgroundImage = `radial-gradient(circle at center, #1a237e 0%, ${velvetBlue} 80%)`;
        }
    },

    // --- CARGA DE DATOS ---

    loadModule: async function(type, gameId) {
        if (!gameId) gameId = document.getElementById('modules-container').getAttribute('data-game');

        const display = document.getElementById('data-display');
        
        // Velvet Room check robusto
        if (type === 'fusions' || type === 'requests') {
            this.setVelvetAtmosphere();
        } else {
            // Forzamos la limpieza del tema Velvet y reaplicamos el tema del juego actual siempre
            this.resetAtmosphere();
            if (gameId === 'p3r') document.body.classList.add('theme-p3r');
            else if (gameId === 'p4g') document.body.classList.add('theme-p4');
            else if (gameId === 'p5r') document.body.classList.add('theme-p5r');
            else if (gameId === 'p3p') this.setGender(this.state.protagonist);
        }

        display.innerHTML = '<div class="empty-state">Cargando datos...</div>';

        let filename = '';
        
        // MAPEO DE ARCHIVOS
        if (gameId === 'p3p') {
            if(type === 'school') filename = 'data/p3p_school_answers.json';
            if(type === 'social') filename = 'data/p3p_social_links_master.json';
            if(type === 'missing') filename = 'data/p3p_missing_persons.json';
            if(type === 'requests') filename = 'data/p3p_elizabeth_requests.json';
            if(type === 'tartarus') filename = 'data/p3p_tartarus_bosses.json';
            if(type === 'fusions') filename = 'data/p3p_special_fusions.json';
        } 
        else if (gameId === 'p3r') {
            if(type === 'school') filename = 'data/p3r_school_answers.json';
            if(type === 'social') filename = 'data/p3r_social_links_master.json';
            if(type === 'linked') filename = 'data/p3r_linked_episodes.json';
            if(type === 'dorm') filename = 'data/p3r_dorm_hangouts.json';
            if(type === 'fragments') filename = 'data/p3r_twilight_fragments.json';
            if(type === 'missing') filename = 'data/p3r_missing_persons.json';
            if(type === 'requests') filename = 'data/p3r_elizabeth_requests.json';
            if(type === 'tartarus') filename = 'data/p3r_tartarus_bosses.json';
            if(type === 'fusions') filename = 'data/p3r_special_fusions.json';
        }
        else if (gameId === 'p4g') {
            if(type === 'school') filename = 'data/p4g_school_answers.json';
            if(type === 'social') filename = 'data/p4g_social_links.json';
            if(type === 'riddle') filename = 'data/p4g_riddles.json';
            if(type === 'lunch') filename = 'data/p4g_lunchbox.json';
            if(type === 'books') filename = 'data/p4g_books.json';
            if(type === 'quiz') filename = 'data/p4g_tv_quiz.json';
            if(type === 'fusions') filename = 'data/p4g_special_fusions.json';
            if(type === 'quests') filename = 'data/p4g_side_quests.json';
        }
        else if (gameId === 'p5r') {
            if(type === 'school') filename = 'data/p5r_school_answers.json';
            if(type === 'social') filename = 'data/p5r_social_links.json';
            if(type === 'seeds') filename = 'data/p5r_will_seeds.json';
            if(type === 'crossword') filename = 'data/p5r_crosswords.json';
            if(type === 'mementos') filename = 'data/p5r_mementos_requests.json';
            if(type === 'jazz') filename = 'data/p5r_jazz_club.json';
            if(type === 'fusions') filename = 'data/p5r_special_fusions.json';
        }

        try {
            const response = await fetch(filename);
            if(!response.ok) throw new Error("No se encontró el archivo: " + filename);
            const data = await response.json();
            
            // --- RENDERIZADO ---
            
            // UNIVERSAL / COMPARTIDO
            if(type === 'fusions') this.renderFusions(data, display);
            else if(type === 'requests') this.renderElizabethRequests(data, display);
            else if(type === 'school') this.renderSchool(data, display);
            else if(type === 'social') this.renderSocial(data, display);
            
            // P3 / P3R
            else if(type === 'missing') this.renderMissing(data, display);
            else if(type === 'tartarus') this.renderTartarusBosses(data, display);
            else if(type === 'linked') this.renderLinkedEpisodes(data, display);
            else if(type === 'dorm') this.renderDorm(data, display);
            else if(type === 'fragments') this.renderTwilightFragments(data, display);
            
            // P4G
            else if(type === 'riddle') this.renderRiddles(data, display);
            else if(type === 'lunch') this.renderLunch(data, display);
            else if(type === 'books') this.renderBooks(data, display);
            else if(type === 'quiz') this.renderQuiz(data, display);
            else if(type === 'quests') this.renderSideQuests(data, display); 
            
            // P5R
            else if(type === 'seeds') this.renderSeeds(data, display);
            else if(type === 'crossword') this.renderCrosswords(data, display);
            else if(type === 'jazz') this.renderJazz(data, display);
            else if(type === 'mementos') this.renderMementos(data, display);

        } catch (error) {
            console.error(error);
            display.innerHTML = `<div class="data-card" style="border-color:var(--alert-red)">
                <h3 style="color:var(--alert-red)">ERROR DE CARGA</h3>
                <p>${error.message}</p>
                <small>Verifica el archivo JSON en /data.</small>
            </div>`;
        }
    },

    // --- NUEVO RENDERIZADOR SOCIAL ESTÁNDAR (P3, P4, P5) ---
    renderSocial: function(data, container) {
        let html = '';
        
        data.sort((a, b) => a.id - b.id).forEach(sl => {
            let routeData = null;
            
            if (sl.type === 'split_character') {
                routeData = sl.routes[this.state.protagonist];
            }
            else if (sl.type === 'shared' || sl.type === 'shared_automatic') {
                if (sl.routes.shared) {
                    routeData = sl.routes.shared;
                } else {
                    routeData = sl.routes[this.state.protagonist] || sl.routes.male;
                }
            } 
            else {
                routeData = sl.routes[this.state.protagonist] || sl.routes.male;
            }

            if (!routeData) return;

            const warningText = routeData.warning_message || routeData.critical_warning;
            const isCritical = !!routeData.critical_warning;

            html += `<div class="data-card social-card ${isCritical ? 'critical-border' : ''}">
                <div class="arcana-header">
                    ${sl.arcana_image ? `<img src="assets/tarot/${sl.arcana_image}" alt="${sl.arcana_name}" class="arcana-img">` : ''}
                    <div class="data-title no-border">${sl.id}. ${sl.arcana_name}</div>
                </div>
                
                <div class="social-info-container">
                    <div class="social-details">
                        <div class="char-name">👤 <strong>${routeData.character}</strong></div>
                        <div class="char-meta">📍 ${routeData.location}</div>
                        <div class="char-meta">📅 ${routeData.availability || 'Eventos automáticos'}</div>
                        
                        ${routeData.unlock_condition ? `<div class="unlock-note">🔓 ${routeData.unlock_condition}</div>` : ''}
                        ${warningText ? `<div class="data-highlight alert-box">⚠️ ${warningText}</div>` : ''}
                    </div>
                    ${routeData.image ? `<img src="assets/characters/${routeData.image}" alt="${routeData.character}" class="character-img">` : ''}
                </div>

                <details>
                    <summary>VER GUÍA DE RESPUESTAS</summary>
                    <div class="ranks-container">`;
            
            if (routeData.abilities) {
                html += `<div class="social-rank-box" style="border-left: 2px solid #ffd700;">
                    <div class="rank-header"><span class="rank-num">HABILIDADES DE CONFIDENTE</span></div>
                    <div class="responses-list">`;
                routeData.abilities.forEach(ab => {
                    html += `<div class="interaction-block" style="font-size:0.9em; padding:5px;">${ab}</div>`;
                });
                html += `</div></div>`;
            }

            if (routeData.ranks) {
                routeData.ranks.forEach(r => {
                    html += `<div class="social-rank-box">
                        <div class="rank-header">
                            <span class="rank-num">RANGO ${r.rank}</span>
                            ${r.type === 'automatic' ? '<span class="badge-auto">Automático</span>' : ''}
                            ${r.date ? `<span class="rank-date">📅 ${r.date}</span>` : ''}
                        </div>
                        
                        ${r.unlock_condition ? `<div class="context-text" style="color:var(--kirijo-blue); margin-bottom:5px;">🔓 Requisito: ${r.unlock_condition}</div>` : ''}

                        <div class="responses-list">`;

                    if (r.interactions && r.interactions.length > 0) {
                        r.interactions.forEach(inter => {
                            html += `<div class="interaction-block">`;
                            
                            if (inter.context) {
                                html += `<div class="context-text">${inter.context}</div>`;
                            }

                            if (inter.options && inter.options.length > 0) {
                                html += `<ul class="options-ul">`;
                                inter.options.forEach(opt => {
                                    let pointsClass = 'points-neutral';
                                    let icon = '';
                                    
                                    if (opt.points >= 3) { pointsClass = 'points-max'; icon = '♪'; }
                                    else if (opt.points === 2) { pointsClass = 'points-mid'; icon = '♪'; }
                                    else if (opt.points === 1) { pointsClass = 'points-low'; }
                                    
                                    if (opt.romance) { icon = '❤️ ' + icon; pointsClass = 'points-romance'; }
                                    
                                    const pointsDisplay = opt.points > 0 ? `+${opt.points} ${icon}` : (opt.isNote ? 'ℹ️' : '');

                                    html += `<li class="option-li">
                                        <span class="opt-text">${opt.text}</span>
                                        ${pointsDisplay ? `<span class="opt-points ${pointsClass}">${pointsDisplay}</span>` : ''}
                                    </li>`;
                                });
                                html += `</ul>`;
                            }
                            html += `</div>`; 
                        });
                    } else if (r.type === 'automatic') {
                        html += `<div class="interaction-block auto-note">La historia avanza automáticamente.</div>`;
                    }

                    html += `</div></div>`;
                });
            }
            
            html += `</div></details></div>`; 
        });
        
        container.innerHTML = html;
    },

    // --- RENDERIZADORES ESPECÍFICOS (P3R/P5R/P4G) ---

    renderDorm: function(data, container) {
        let html = '<h3 style="color:var(--p3r-cyan); border-bottom: 2px solid var(--p3r-cyan); padding-bottom:10px;">🛏️ Vida en el Dormitorio (Buffs de Combate)</h3>';
        data.forEach(char => {
            html += `<div class="data-card" style="border-left: 4px solid var(--p3r-cyan);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">
                    <strong style="font-size:1.2em; color:#fff;">${char.character}</strong>
                    <span style="font-size:0.8em; color:var(--p3r-cyan);">${char.arcana}</span>
                </div>
                <div style="font-size:0.9em; margin-bottom:10px; color:#aaa;">❤️ Actividades: ${char.activities}</div>
                <div style="display:grid; gap:8px;">`;
            char.buffs.forEach(buff => {
                html += `<div style="background:rgba(0, 46, 59, 0.6); padding:8px; border-radius:4px; border:1px solid rgba(79, 251, 252, 0.3);">
                    <div style="color:var(--p3r-cyan); font-weight:bold;">Nv ${buff.level}: ${buff.name}</div>
                    <div style="font-size:0.85em; color:#ddd;">${buff.effect}</div>
                </div>`;
            });
            html += `</div></div>`;
        });
        container.innerHTML = html;
    },

    renderSeeds: function(data, container) {
        let html = '<div style="background:#000; color:#fff; padding:10px; text-align:center; font-family:\'Impact\', sans-serif; font-size:1.5em; border:2px solid #fff; margin-bottom:20px; transform:skew(-2deg);">💀 WILL SEEDS & RINGS</div>';
        
        data.forEach(palace => {
            html += `<div class="data-card" style="background:#000; color:#fff; border:2px solid var(--p5r-red); margin-bottom:20px;">
                <div style="background:var(--p5r-red); color:#fff; padding:5px 10px; font-weight:bold; font-family:'Impact', sans-serif; font-size:1.2em;">${palace.palace}</div>
                <div style="padding:10px;">
                     <div style="margin-bottom:10px; border-bottom:1px dashed #555; padding-bottom:10px;">
                        <strong style="color:var(--p5r-gold);">💍 ${palace.ring}</strong>
                        <div style="font-size:0.9em; color:#ccc; margin-top:5px;">${palace.effect}</div>
                     </div>
                     <div style="font-size:0.85em;">
                        <div style="color:#aaa; margin-bottom:3px;">📍 Ubicaciones:</div>`;
            palace.seeds.forEach(seed => {
                html += `<div style="margin-left:10px; color:#fff; margin-bottom:2px;">• ${seed}</div>`;
            });
            html += `</div></div></div>`;
        });
        container.innerHTML = html;
    },

    renderLinkedEpisodes: function(data, container) {
        let html = '<h3 style="color:var(--p3r-cyan); border-bottom: 2px solid var(--p3r-cyan); padding-bottom:10px; text-transform:uppercase;">🔗 Episodios de Vínculo</h3>';
        
        data.forEach(char => {
            const isWarning = char.warning ? true : false;
            html += `<div class="data-card" style="border-left: 4px solid ${isWarning ? 'var(--alert-red)' : 'var(--p3r-cyan)'};">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                    <div>
                        <strong style="font-size:1.2em; color:#fff;">${char.character}</strong>
                        <span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; font-size:0.8em; margin-left:10px;">${char.arcana}</span>
                    </div>
                    <div style="font-size:0.8em; color:var(--p3r-cyan);">🎁 ${char.unlocks}</div>
                </div>
                ${isWarning ? `<div class="data-highlight" style="margin-bottom:15px;">⚠️ ${char.warning}</div>` : ''}
                
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">`;
            
            char.events.forEach(ev => {
                html += `<div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:5px; border:1px solid #333;">
                    <div style="color:var(--p3r-cyan); font-weight:bold;">Episodio ${ev.episode}</div>
                    <div style="font-size:0.9em; margin:5px 0;">📅 ${ev.date} - ${ev.availability}</div>
                    <div style="font-size:0.85em; color:#aaa; font-style:italic;">"${ev.note}"</div>
                </div>`;
            });

            html += `</div></div>`;
        });
        container.innerHTML = html;
    },

    renderTwilightFragments: function(data, container) {
        let html = '<h3 style="color:var(--p3r-cyan); border-bottom: 2px solid var(--p3r-cyan); padding-bottom:10px; text-transform:uppercase; text-shadow: 0 0 10px rgba(79, 251, 252, 0.5);">💎 Fragmentos Crepusculares</h3>';
        html += '<p style="font-size:0.9em; color:#aaa; margin-bottom:20px;">Ubicaciones en la ciudad (Town Map). Vitales para cofres y el reloj del Tártaro.</p>';
        
        html += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:15px;">';
        
        data.forEach(f => {
            html += `<div class="data-card" style="border-left: 4px solid var(--p3r-cyan); background: linear-gradient(135deg, rgba(0, 50, 70, 0.8) 0%, rgba(0, 20, 30, 0.9) 100%);">
                <div style="color:var(--p3r-cyan); font-weight:bold; font-size:1.1em; margin-bottom:5px;">${f.area}</div>
                <div style="color:#fff; font-weight:bold; margin-bottom:5px;">📍 ${f.location}</div>
                <div style="font-size:0.9em; color:#ccc; border-top:1px solid rgba(79, 251, 252, 0.2); padding-top:5px; margin-top:5px;">
                    ${f.detail}
                </div>
            </div>`;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },

    renderCrosswords: function(data, container) {
        let html = '<div style="text-align:center; background:#000; color:#fff; padding:15px; margin-bottom:20px; font-family:\'Impact\', sans-serif; font-size:1.5em; border:2px solid #fff; transform:rotate(-1deg);">🧩 CRUCIGRAMAS LEBLANC</div>';
        html += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">';
        
        data.forEach(cw => {
            html += `<div class="data-card" style="background:#fff; color:#000; border:2px solid #000; padding:10px;">
                <div style="font-size:0.9em; font-weight:bold; color:#cc0000; margin-bottom:5px;">#${cw.id}</div>
                <div style="font-style:italic; margin-bottom:10px;">"${cw.question}"</div>
                <div style="background:#000; color:#fcc200; padding:5px 10px; font-weight:bold; text-align:center; transform:skew(-5deg); border:1px solid #fcc200;">
                    ${cw.answer}
                </div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    renderJazz: function(data, container) {
        let html = `<div style="background:#220033; color:#fff; padding:20px; border:2px solid #fcc200;">
            <h2 style="color:#fcc200; text-align:center; font-family:'Georgia', serif; letter-spacing:3px;">🎷 JAZZ JIN</h2>
            <p style="text-align:center; font-style:italic;">Kichijoji - Noches</p>
            <div style="margin-top:20px;">
                <h4 style="color:#fcc200; border-bottom:1px solid #555;">Habilidades de Domingo (Exclusivas)</h4>
                <div style="display:grid; grid-template-columns: 1fr; gap:10px;">`;
        
        data.sunday_skills.forEach(skill => {
            html += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; border-bottom:1px solid #444;">
                <div style="font-weight:bold; color:#fff;">${skill.date}</div>
                <div style="color:#fcc200; font-weight:bold;">${skill.skill}</div>
                <div style="font-size:0.85em; color:#aaa; text-align:right;">${skill.effect}</div>
            </div>`;
        });
        
        html += `</div></div></div>`;
        container.innerHTML = html;
    },

    renderMementos: function(data, container) {
        let html = '<div style="background:#000; color:#fff; padding:10px; text-align:center; font-family:\'Impact\', sans-serif; font-size:2em; color:#cc0000; text-shadow:2px 2px 0 #fff; margin-bottom:20px;">MEMENTOS REQUESTS</div>';
        
        data.forEach(req => {
            const isRankS = req.rank === 'S';
            html += `<div class="data-card" style="background:${isRankS ? '#300' : '#111'}; border:1px solid #333; margin-bottom:15px; border-left:5px solid #cc0000;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #444; padding-bottom:5px;">
                    <strong style="color:#cc0000; font-size:1.2em;">${req.name}</strong>
                    <span style="background:#cc0000; color:#fff; padding:2px 8px; font-weight:bold;">Rank ${req.rank}</span>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.9em;">
                    <div>📅 <strong>Disponible:</strong> ${req.available}</div>
                    <div>📍 <strong>Lugar:</strong> ${req.location}</div>
                    <div>🎯 <strong>Objetivo:</strong> ${req.target}</div>
                    <div>🎁 <strong>Premio:</strong> ${req.reward}</div>
                </div>
                <div style="margin-top:10px; background:#222; padding:5px; font-size:0.85em; color:#aaa;">
                    💡 <strong>Condición:</strong> ${req.condition}
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    // --- RENDERIZADORES CLÁSICOS ---

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
        if(data.special_spreads) {
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
        }

        // Max S.Link Ultimates
        if(data.max_social_link_ultimates) {
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
        }
        
        container.innerHTML = html;
    },

    renderElizabethRequests: function(data, container) {
        const velvetBlue = '#0a0e29';
        const velvetGold = '#d4af37';
        const velvetText = '#e0e0e0';

        let html = `
        <div style="background: linear-gradient(180deg, #000020 0%, #1a237e 100%); border: 3px double ${velvetGold}; padding: 20px; border-radius: 8px; color: ${velvetText}; text-align: center; margin-bottom: 30px; box-shadow: 0 0 20px rgba(26, 35, 126, 0.5);">
            <h2 style="color: ${velvetGold}; font-family: 'Georgia', serif; letter-spacing: 4px; border-bottom: 1px solid ${velvetGold}; padding-bottom: 10px; margin-bottom: 5px; font-weight: normal; text-transform: uppercase;">Elizabeth's Requests</h2>
            <div style="font-size: 0.9em; font-style: italic; opacity: 0.8; font-family: serif;">"Tengo una petición para ti..."</div>
        </div>
        `;
        
        data.sort((a, b) => {
            if (a.deadline && !b.deadline) return -1;
            if (!a.deadline && b.deadline) return 1;
            return a.id - b.id;
        });

        data.forEach(req => {
            const hasDeadline = req.deadline !== null;
            
            html += `<div class="data-card" style="border: 1px solid ${velvetGold}; background: rgba(10, 14, 41, 0.95); color:${velvetText}; margin-bottom: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.8);">
                <div style="border-bottom: 1px solid ${velvetGold}; padding:8px; display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:1.1em; color:${velvetGold}; font-family: serif;">#${req.id} - ${req.task}</strong>
                    ${hasDeadline ? `<span style="background:#800000; color:#fff; padding:2px 8px; border:1px solid #ff4444; border-radius:2px; font-size:0.8em; font-family:sans-serif;">⏳ ${req.deadline}</span>` : ''}
                </div>
                
                <div style="padding:15px;">
                    <div style="margin-bottom: 10px; font-size: 0.95em;">
                        <span style="color:#aaa; font-style:italic;">Solución:</span> <span style="color:#fff;">${req.solution}</span>
                    </div>
                    <div style="background:rgba(212, 175, 55, 0.1); padding:5px 10px; border: 1px solid ${velvetGold}; display:inline-block; font-size:0.9em;">
                        🎁 Recompensa: <span style="color:${velvetGold}; font-weight:bold;">${req.reward}</span>
                    </div>
                </div>
            </div>`;
        });
        
        container.innerHTML = html;
    },

    renderTartarusBosses: function(data, container) {
        let html = '<h3 style="color:#ff2a2a; text-align:center; text-transform:uppercase; border-bottom: 2px solid #ff2a2a; padding-bottom:10px; letter-spacing:2px;">💀 GUARDIANES DE TARTARUS</h3>';
        
        data.forEach(boss => {
            html += `<div class="data-card" style="border-left: 4px solid #ff2a2a; background: linear-gradient(90deg, rgba(20,0,0,0.9) 0%, rgba(10,10,10,0.95) 100%); margin-bottom: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #400; padding-bottom:5px; margin-bottom:10px;">
                    <strong style="color:#ff6b6b; font-size:1.1em;">${boss.floor}</strong>
                    <span style="color:#fff; font-weight:bold;">${boss.boss}</span>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                    <div style="background:rgba(0,255,0,0.1); padding:5px; border-radius:4px; font-size:0.9em;">
                        <span style="color:#4caf50; font-weight:bold;">⚔️ Débil:</span> <br>${boss.weakness}
                    </div>
                    <div style="background:rgba(255,0,0,0.1); padding:5px; border-radius:4px; font-size:0.9em;">
                        <span style="color:#ff2a2a; font-weight:bold;">🛡️ Anula:</span> <br>${boss.nullify}
                    </div>
                </div>
                <div style="font-size:0.9em; color:#bbb; border-top:1px dashed #444; padding-top:5px;">
                    <span style="color:#ff2a2a;">💡 Estrategia:</span> ${boss.strategy}
                </div>
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
                            <strong style="color:#e60012">Grupo A:</strong><br>${r.question_a || (r.answers ? r.answers[0] : '')}
                        </div>
                        <div style="flex:1; background:#f0f0f0; padding:10px; border-radius:5px;">
                            <strong style="color:#005f73">Grupo B:</strong><br>${r.question_b || (r.answers ? r.answers[2] : '')}
                        </div>
                    </div>
                    <div style="background:#ffe600; color:#000; padding:10px; border:2px dashed #000; text-align:center; font-weight:bold; font-size:1.1rem;">
                        👉 Respuesta: ${r.answer || (r.answers ? r.answers.join(', ') : '')}
                    </div>
                    ${r.explanation ? `<div style="margin-top:5px; font-size:0.85em; color:#666; font-style:italic;">💡 Por qué: ${r.explanation}</div>` : ''}
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    renderLunch: function(data, container) {
        let html = '<h3 style="color:#fff; text-align:center; background:#ff8800; border:2px solid #000; padding:10px; transform:skew(-2deg); text-transform:uppercase;">🍱 Menú de Cocina (LunchBox)</h3>';
        data.forEach(item => {
            let favsHtml = item.favorites ? item.favorites.map(char => 
                `<span style="background:#fff; color:#ff8800; padding:2px 8px; border-radius:10px; font-size:0.8em; margin-right:5px; border:1px solid #ff8800;">${char}</span>`
            ).join('') : '';
            
            html += `<div class="data-card" style="border: 2px solid #ff8800; background: #fff; color:#000; margin-bottom: 20px; box-shadow: 5px 5px 0px rgba(255, 136, 0, 0.4);">
                <div style="background:#ff8800; color:#fff; padding:5px 10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.1em;">📅 ${item.date}</span>
                    <span style="font-size:0.9em; opacity:0.9">🍽️ ${item.dish}</span>
                </div>
                <div style="padding:15px;">
                    <div style="margin-bottom:15px;">
                        <div style="font-size:0.85em; color:#666; margin-bottom:5px; text-transform:uppercase; font-weight:bold;">Clave del éxito:</div>
                        <div style="font-size:1.2em; font-weight:bold; color:#d65c00; border-bottom: 2px dashed #ff8800; padding-bottom:5px;">
                            👉 ${item.correct_choice || item.correct_action}
                        </div>
                    </div>
                    ${favsHtml ? `<div><div style="font-size:0.85em; color:#666; margin-bottom:5px;">A quién le gusta:</div><div>${favsHtml}</div></div>` : ''}
                </div>
            </div>`;
        });
        container.innerHTML = html;
    },

    renderBooks: function(data, container) {
        let html = '<h3 style="color:#2e7d32; background:#e8f5e9; text-align:center; text-transform:uppercase; border: 2px solid #2e7d32; padding:10px; transform:skew(-2deg);">📖 GUÍA DE LECTURA (YOMENAIDO)</h3>';
        data.forEach(book => {
            let borderStyle = 'border-left: 5px solid #2e7d32;'; 
            let bgStyle = 'background: #fff; color:#000;';
            let badge = '';

            if (book.type === 'missable') {
                borderStyle = 'border: 2px solid #d32f2f; border-left-width: 8px;';
                bgStyle = 'background: #ffebee; color:#b71c1c;';
                badge = '<span style="background:#d32f2f; color:white; padding:2px 6px; font-size:0.7em; border-radius:4px; text-transform:uppercase; margin-left:5px;">⚠️ PERDIBLE</span>';
            } else if (book.type === 'vital') {
                borderStyle = 'border: 2px solid #fbc02d; border-left-width: 8px;';
                bgStyle = 'background: #fffde7; color:#f57f17;';
                badge = '<span style="background:#fbc02d; color:black; padding:2px 6px; font-size:0.7em; border-radius:4px; text-transform:uppercase; margin-left:5px;">⭐ ESENCIAL</span>';
            }

            html += `<div class="data-card" style="${borderStyle} ${bgStyle} margin-bottom: 15px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px; border-bottom: 1px dashed rgba(0,0,0,0.2); padding-bottom:5px;">
                    <strong style="font-size:1.1em;">${book.title}</strong>
                    <div style="text-align:right;">${badge}</div>
                </div>
                <div style="font-size:0.9em; margin-bottom:8px;">
                    📅 <strong>Disponible:</strong> ${book.available || book.date} <br>
                    📍 <strong>Origen:</strong> ${book.source || book.location} <br>
                    📘 <strong>Capítulos:</strong> ${book.chapters}
                </div>
                <div style="background:rgba(0,0,0,0.05); padding:8px; border-radius:4px; font-style:italic;">
                    ✨ Efecto: ${book.effect}
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
    },

    renderSideQuests: function(data, container) {
        let html = '<h3 style="color:#000; text-align:center; background:#ffe600; border:2px solid #000; padding:12px; transform:skew(-2deg); text-transform:uppercase; box-shadow: 5px 5px 0px #000; margin-bottom: 25px;">🦊 MISIONES SECUNDARIAS (SIDE QUESTS)</h3>';
        
        html += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">';
        
        data.forEach(q => {
            html += `<div class="data-card" style="border: 2px solid #000; background: #fff; color:#000; box-shadow: 5px 5px 0px rgba(0,0,0,0.8); display: flex; flex-direction: column; padding: 0; border-radius: 0;">
                <div style="background:#000; padding:10px 15px; font-weight:bold; font-size:1.1em; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#ffe600;">${q.title}</span>
                </div>
                
                <div style="padding:15px; display: flex; flex-direction: column; flex-grow: 1;">
                    <div style="display:flex; justify-content:space-between; font-size:0.85em; border-bottom:2px dashed #ccc; padding-bottom:8px; margin-bottom:10px;">
                        <span style="background:#eee; padding:2px 8px; border:1px solid #aaa; border-radius:10px; color:#000;">📅 <strong>${q.unlock_date}</strong></span>
                        <span style="color:#555;">📍 <strong>${q.location}</strong></span>
                    </div>
                    
                    <div style="font-size:0.95em; margin-bottom:5px;">
                        👤 <strong style="color:#000;">Cliente:</strong> ${q.client}
                    </div>
                    
                    <div style="font-size:0.9em; margin-bottom:12px; color:#d32f2f; font-weight:bold;">
                        ${q.requirements !== 'Ninguno' ? `⚠️ Req: ${q.requirements}` : '<span style="color:#4caf50;">✅ Sin requisitos previos</span>'}
                    </div>
                    
                    <div style="background:rgba(255, 230, 0, 0.15); color:#000; padding:10px; border-left:3px solid #ffe600; font-size:0.9em; font-style:italic; margin-bottom:15px; flex-grow: 1; line-height:1.4;">
                        ${q.description}
                    </div>
                    
                    <div style="background:#ffe600; color:#000; padding:8px; text-align:center; font-weight:bold; border: 2px dashed #000; font-size:0.95em; transform:skew(-2deg);">
                        🎁 ${q.reward}
                    </div>
                </div>
            </div>`;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
};

// Iniciar
document.addEventListener('DOMContentLoaded', () => app.init());