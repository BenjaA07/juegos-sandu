// ==========================================
// MI GRANJA
// Juego educativo sobre cuidado de animales
// ==========================================

const animalsData = [
    {
        id: "vaca",
        name: "Vaca",
        icon: "🐄",
        description: "Le gusta comer pasto y descansar.",
        health: 82,
        happiness: 80
    },
    {
        id: "oveja",
        name: "Oveja",
        icon: "🐑",
        description: "Necesita alimento, agua y un lugar limpio.",
        health: 88,
        happiness: 85
    },
    {
        id: "caballo",
        name: "Caballo",
        icon: "🐎",
        description: "Necesita ejercicio, agua y buena alimentación.",
        health: 75,
        happiness: 78
    },
    {
        id: "gallina",
        name: "Gallina",
        icon: "🐔",
        description: "Necesita un gallinero seguro y alimento.",
        health: 90,
        happiness: 86
    }
];

const tips = [
    "Los animales necesitan agua limpia y fresca todos los días.",
    "Un ambiente limpio ayuda a prevenir enfermedades.",
    "Una buena alimentación mantiene fuertes a los animales.",
    "Observá a tus animales todos los días para detectar cambios.",
    "Los animales también necesitan descanso y tranquilidad.",
    "Proporcionar sombra ayuda a los animales durante los días calurosos.",
    "El cuidado responsable incluye mantener limpios los espacios.",
    "Cada especie tiene necesidades diferentes."
];

const defaultGame = {
    points: 0,
    coins: 50,
    level: 1,
    day: 1,
    food: 100,
    water: 100,
    cleanliness: 100,
    wellbeing: 100,
    bonus: false,
    care: {},
    animals: JSON.parse(JSON.stringify(animalsData)),
    tasks: {
        feed: false,
        water: false,
        clean: false
    }
};

let game = loadGame();


// ==========================================
// GUARDADO
// ==========================================

function loadGame() {
    let saved; try { saved = localStorage.getItem("miGranjaSaveV2"); } catch {}

    if (!saved) {
        return JSON.parse(JSON.stringify(defaultGame));
    }

    try {
        const parsed=JSON.parse(saved); if(!Array.isArray(parsed.animals)||!parsed.tasks) throw Error(); return parsed;
    } catch {
        return JSON.parse(JSON.stringify(defaultGame));
    }
}

function saveGame() {
    try { localStorage.setItem("miGranjaSaveV2", JSON.stringify(game)); } catch {}
}


// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const animalsContainer =
    document.getElementById("animalsContainer");

const tasksContainer =
    document.getElementById("tasksContainer");

const pointsElement =
    document.getElementById("points");

const coinsElement =
    document.getElementById("coins");

const levelElement =
    document.getElementById("level");

const dayElement =
    document.getElementById("day");

const dayMessageElement =
    document.getElementById("dayMessage");

const foodElement =
    document.getElementById("food");

const waterElement =
    document.getElementById("water");

const cleanlinessElement =
    document.getElementById("cleanliness");

const wellbeingElement =
    document.getElementById("wellbeing");

const tipText =
    document.getElementById("tipText");


// ==========================================
// RENDER GENERAL
// ==========================================

function render() {

    renderStats();
    renderAnimals();
    renderTasks();
    renderFarmInfo();
    const done=Object.values(game.tasks).filter(Boolean).length;
    document.getElementById("dailyCount").textContent=`${done}/3 tareas`;
    document.getElementById("dailyBar").style.width=`${done/3*100}%`;

    saveGame();
}


// ==========================================
// ESTADÍSTICAS
// ==========================================

function renderStats() {

    pointsElement.textContent = game.points;
    coinsElement.textContent = game.coins;
    levelElement.textContent = game.level;

    dayElement.textContent = `Día ${game.day}`;

    updateDayMessage();
}


// ==========================================
// MENSAJE DEL DÍA
// ==========================================

function updateDayMessage() {

    const messages = [
        "¡Comenzá cuidando a tus animales!",
        "Hoy es un buen día para revisar los corrales.",
        "Tus animales cuentan con vos.",
        "¡No olvides revisar el agua!",
        "Una granja limpia es una granja saludable.",
        "¡Tus animales necesitan atención!",
        "El cuidado diario hace la diferencia."
    ];

    dayMessageElement.textContent =
        messages[(game.day - 1) % messages.length];
}


// ==========================================
// ANIMALES
// ==========================================

function renderAnimals() {

    animalsContainer.innerHTML = "";

    game.animals.forEach(animal => {

        const card = document.createElement("article");

        card.className = "animal-card";

        card.innerHTML = `
            <div class="animal-icon">
                ${animal.icon}
            </div>

            <h3 class="animal-name">
                ${animal.name}
            </h3>

            <p class="animal-description">
                ${animal.description}
            </p>

            <div class="status">

                <div class="status-line">
                    <span>❤️ Salud</span>
                    <strong>${animal.health}%</strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar health-bar"
                        style="width:${animal.health}%"
                    ></div>
                </div>

            </div>

            <div class="status">

                <div class="status-line">
                    <span>😊 Bienestar</span>
                    <strong>${animal.happiness}%</strong>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar happiness-bar"
                        style="width:${animal.happiness}%"
                    ></div>
                </div>

            </div>

            <div class="animal-actions">

                <button onclick="feedAnimal('${animal.id}')" ${game.care[animal.id]?.feed ? "disabled" : ""}>
                    ${game.care[animal.id]?.feed ? "✓ Alimentado" : "🌾 Alimentar"}
                </button>

                <button onclick="giveWater('${animal.id}')" ${game.care[animal.id]?.water ? "disabled" : ""}>
                    ${game.care[animal.id]?.water ? "✓ Hidratado" : "💧 Dar agua"}
                </button>

                <button onclick="petAnimal('${animal.id}')" ${game.care[animal.id]?.pet ? "disabled" : ""}>
                    ${game.care[animal.id]?.pet ? "✓ Cuidado" : "❤️ Cuidar"}
                </button>

                <button onclick="showAnimalInfo('${animal.id}')">
                    ℹ️ Info
                </button>

            </div>
        `;

        animalsContainer.appendChild(card);
    });
}


// ==========================================
// ALIMENTAR ANIMAL
// ==========================================

function notice(text){const el=document.getElementById('farmToast');el.textContent=text;el.classList.add('show');clearTimeout(window.farmTimer);window.farmTimer=setTimeout(()=>el.classList.remove('show'),2400)}
function doCare(id,type){
 const a=findAnimal(id);if(!a)return;
 const care=game.care[id] ||= {};if(care[type])return;
 const resource=type==='feed'?'food':type==='water'?'water':null;
 if(resource && game[resource]<5){notice('No hay suficientes recursos. Visitá la tienda.');return}
 if(resource){game[resource]-=5;a.health=clamp(a.health+(type==='feed'?8:5));game.coins++;}
 a.happiness=clamp(a.happiness+(type==='pet'?8:5));care[type]=true;
 if(resource)game.tasks[type]=game.animals.every(an=>game.care[an.id]?.[type]);
 addPoints(type==='pet'?3:5);notice(`${a.name}: cuidado realizado. +${type==='pet'?3:5} puntos`);checkAllTasks();render();
}
function feedAnimal(id){doCare(id,'feed')}
function giveWater(id){doCare(id,'water')}
function petAnimal(id){doCare(id,'pet')}
function buySupply(type){
 const cost=type==='food'?8:6;
 if(game[type]>=100){notice('El depósito ya está lleno.');return}
 if(game.coins<cost){notice('No tenés suficientes monedas.');return}
 game.coins-=cost;game[type]=Math.min(100,game[type]+25);render();notice('Recursos repuestos.');
}
// ==========================================
// INFORMACIÓN
// ==========================================

function showAnimalInfo(id) {

    const animal = findAnimal(id);

    if (!animal) return;

    const information = {

        vaca:
            "Las vacas necesitan alimentación adecuada, agua limpia, sombra y un espacio seguro para descansar.",

        oveja:
            "Las ovejas necesitan alimento, agua, refugio y un ambiente limpio y tranquilo.",

        caballo:
            "Los caballos necesitan alimento equilibrado, agua, ejercicio, descanso y un lugar seguro.",

        gallina:
            "Las gallinas necesitan alimento, agua, protección frente a depredadores y un gallinero limpio."
    };

    showModal(
        animal.icon,
        `Cuidados de la ${animal.name.toLowerCase()}`,
        information[animal.id]
    );
}


// ==========================================
// TAREAS
// ==========================================

function renderTasks() {

    const tasks = [

        {
            id: "feed",
            icon: "🌾",
            title: "Alimentar animales",
            description: "Alimentar a los cuatro animales."
        },

        {
            id: "water",
            icon: "💧",
            title: "Revisar el agua",
            description: "Dar agua a los cuatro animales."
        },

        {
            id: "clean",
            icon: "🧹",
            title: "Limpiar el corral",
            description: "Mantener limpio el espacio de los animales."
        }

    ];

    tasksContainer.innerHTML = "";

    tasks.forEach(task => {

        const completed = game.tasks[task.id];

        const element = document.createElement("div");

        element.className =
            `task ${completed ? "completed" : ""}`;

        element.innerHTML = `

            <div class="task-icon">
                ${task.icon}
            </div>

            <div class="task-content">

                <strong>
                    ${task.title}
                </strong>

                <small>
                    ${task.description}
                </small>

            </div>

            <button
                class="task-check"
                onclick="completeTask('${task.id}')" ${task.id!=="clean" || completed ? "disabled" : ""} aria-label="${task.title}"
            >
                ${completed ? "✓" : task.id === "clean" ? "🧹" : "·"}
            </button>
        `;

        tasksContainer.appendChild(element);
    });
}


// ==========================================
// COMPLETAR TAREA
// ==========================================

function completeTask(id) {

    if (id !== "clean" || game.tasks[id]) {
        return;
    }

    if (id === "clean") {

        game.cleanliness = 100;

        game.animals.forEach(animal => {
            animal.health = clamp(animal.health + 5);
            animal.happiness = clamp(animal.happiness + 3);
        });

        showModal(
            "🧹",
            "¡Corral limpio!",
            "Limpiaste el espacio de los animales. Un ambiente limpio ayuda a mantenerlos saludables."
        );
    }

    if (id === "feed") {

        showModal(
            "🌾",
            "Tarea completada",
            "Tus animales recibieron alimento."
        );
    }

    if (id === "water") {

        showModal(
            "💧",
            "Tarea completada",
            "Revisaste el agua de los animales."
        );
    }

    game.tasks[id] = true;

    addPoints(10);
    game.coins += 3;

    render();

    checkAllTasks();
}


// ==========================================
// TODAS LAS TAREAS
// ==========================================

function checkAllTasks() {

    const allCompleted =
        Object.values(game.tasks).every(value => value === true);

    if (!allCompleted || game.bonus) return;
    game.bonus = true;

    game.points += 20;
    game.coins += 10;

    showModal(
        "🏆",
        "¡Día completado!",
        "Completaste todas las tareas de hoy. Recibiste un bono de 20 puntos y 10 monedas."
    );

    checkLevel();
    render();
}


// ==========================================
// SIGUIENTE DÍA
// ==========================================

document
    .getElementById("nextDayBtn")
    .addEventListener("click", nextDay);


function nextDay() {

    if(!Object.values(game.tasks).every(Boolean) && !confirm("Todavía quedan tareas pendientes. ¿Pasar al siguiente día?") )return;
    game.day++;

    // Consumo diario
    game.food = Math.max(0, game.food - 8);
    game.water = Math.max(0, game.water - 8);

    // Los animales pierden un poco de bienestar
    game.animals.forEach(animal => {

        animal.health = clamp(animal.health - randomNumber(4, 9));

        animal.happiness =
            clamp(animal.happiness - randomNumber(4, 9));

    });

    // La limpieza disminuye
    game.cleanliness =
        clamp(game.cleanliness - randomNumber(5, 12));

    // Si la limpieza está baja, afecta a la salud
    if (game.cleanliness < 50) {

        game.animals.forEach(animal => {
            animal.health = clamp(animal.health - 4);
        });
    }

    // Si falta alimento
    if (game.food === 0) {

        game.animals.forEach(animal => {
            animal.health = clamp(animal.health - 8);
            animal.happiness = clamp(animal.happiness - 6);
        });
    }

    // Si falta agua
    if (game.water === 0) {

        game.animals.forEach(animal => {
            animal.health = clamp(animal.health - 10);
            animal.happiness = clamp(animal.happiness - 8);
        });
    }

    // Nuevas tareas
    game.care = {};
    game.bonus = false;
    game.tasks = {
        feed: false,
        water: false,
        clean: false
    };

    // Recursos que recibe el jugador
    game.food = Math.min(100, game.food + 8);
    game.water = Math.min(100, game.water + 8);

    // Nuevo consejo
    changeTip();

    checkLevel();

    showModal(
        "🌅",
        `Comenzó el día ${game.day}`,
        "Revisá a tus animales y completá las nuevas tareas."
    );

    render();
}


// ==========================================
// NIVEL
// ==========================================

function checkLevel() {

    const newLevel =
        Math.floor(game.points / 100) + 1;

    if (newLevel > game.level) {

        game.level = newLevel;

        game.coins += 15;

        showModal(
            "🎉",
            `¡Subiste al nivel ${game.level}!`,
            "Tu granja está creciendo gracias a tus buenos cuidados."
        );
    }
}


// ==========================================
// PUNTOS
// ==========================================

function addPoints(amount) {

    game.points += amount;

    checkLevel();
}


// ==========================================
// UTILIDADES
// ==========================================

function findAnimal(id) {

    return game.animals.find(
        animal => animal.id === id
    );
}


function clamp(value) {

    return Math.max(
        0,
        Math.min(100, value)
    );
}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// ==========================================
// CONSEJOS
// ==========================================

function changeTip() {

    const randomIndex =
        Math.floor(Math.random() * tips.length);

    tipText.textContent =
        tips[randomIndex];
}


// ==========================================
// INFORMACIÓN DE LA GRANJA
// ==========================================

function renderFarmInfo() {

    foodElement.textContent =
        game.food;

    waterElement.textContent =
        game.water;

    cleanlinessElement.textContent =
        `${game.cleanliness}%`;

    const totalHealth =
        game.animals.reduce(
            (total, animal) =>
                total + animal.health,
            0
        );

    const totalHappiness =
        game.animals.reduce(
            (total, animal) =>
                total + animal.happiness,
            0
        );

    const averageHealth =
        Math.round(
            totalHealth / game.animals.length
        );

    const averageHappiness =
        Math.round(
            totalHappiness / game.animals.length
        );

    const averageWellbeing =
        Math.round(
            (averageHealth +
                averageHappiness +
                game.cleanliness) / 3
        );

    wellbeingElement.textContent =
        `${averageWellbeing}%`;
}


// ==========================================
// MODAL
// ==========================================

const modal =
    document.getElementById("modal");

const modalIcon =
    document.getElementById("modalIcon");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const closeModal =
    document.getElementById("closeModal");

const modalButton =
    document.getElementById("modalButton");


function showModal(icon, title, text) {

    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalText.textContent = text;

    modal.classList.remove("hidden");
}


function hideModal() {

    modal.classList.add("hidden");
}


closeModal.addEventListener(
    "click",
    hideModal
);

modalButton.addEventListener(
    "click",
    hideModal
);

modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {
            hideModal();
        }

    }
);


// ==========================================
// REINICIAR PARTIDA
// ==========================================

document
    .getElementById("resetBtn")
    .addEventListener("click", () => {

        const confirmation =
            confirm(
                "¿Seguro que querés reiniciar toda la partida?"
            );

        if (!confirmation) return;

        game =
            JSON.parse(
                JSON.stringify(defaultGame)
            );

        saveGame();
        changeTip();
        render();

        showModal(
            "🌱",
            "Nueva partida",
            "Tu granja volvió a empezar. ¡A cuidar a los animales!"
        );
    });


// ==========================================
// INICIO
// ==========================================

changeTip();
render();
