const products = [
  {
    id: 1,
    name: 'Top Satin Fucsia',
    cat: 'tops',
    price: 890,
    label: 'TOP',
    bg: '#f6c9d5',
    tags: ['elegante', 'fucsia'],
    points: { color: 8, style: 9 }
  },
  {
    id: 2,
    name: 'Remera Basic Negra',
    cat: 'tops',
    price: 590,
    label: 'REMERA',
    bg: '#ded8d3',
    tags: ['urbano', 'neutro'],
    points: { color: 7, style: 7 }
  },
  {
    id: 3,
    name: 'Jean Wide Azul',
    cat: 'bottoms',
    price: 1290,
    label: 'JEAN',
    bg: '#d0d9ea',
    tags: ['urbano', 'denim'],
    points: { color: 8, style: 8 }
  },
  {
    id: 4,
    name: 'Falda Plateada',
    cat: 'bottoms',
    price: 1120,
    label: 'FALDA',
    bg: '#dddce3',
    tags: ['fiesta', 'plateado'],
    points: { color: 9, style: 10 }
  },
  {
    id: 5,
    name: 'Zapatillas Cloud',
    cat: 'shoes',
    price: 1490,
    label: 'ZAPAS',
    bg: '#ece7df',
    tags: ['urbano', 'comodín'],
    points: { color: 8, style: 7 }
  },
  {
    id: 6,
    name: 'Botas Night',
    cat: 'shoes',
    price: 1590,
    label: 'BOTAS',
    bg: '#d8ccc4',
    tags: ['elegante', 'negro'],
    points: { color: 7, style: 9 }
  },
  {
    id: 7,
    name: 'Campera Cropped',
    cat: 'tops',
    price: 1390,
    label: 'CAMPERA',
    bg: '#ded4cb',
    tags: ['urbano', 'neutro'],
    points: { color: 7, style: 9 }
  },
  {
    id: 8,
    name: 'Pantalón Cargo',
    cat: 'bottoms',
    price: 1190,
    label: 'CARGO',
    bg: '#d2c7b1',
    tags: ['urbano', 'cargo'],
    points: { color: 8, style: 8 }
  }
];

const photos = [{"url": "https://upload.wikimedia.org/wikipedia/commons/8/86/Smiling_woman_pink_shirt.jpg", "page": "https://commons.wikimedia.org/wiki/File:Smiling_woman_pink_shirt.jpg", "author": "Joshua McKnight (Pexels)", "license": "CC0 1.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/8/81/Camiseta-negra.jpg", "page": "https://commons.wikimedia.org/wiki/File:Camiseta-negra.jpg", "author": "Camisetas", "license": "CC BY 3.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/9/92/Denimjeans2.JPG", "page": "https://commons.wikimedia.org/wiki/File:Denimjeans2.JPG", "author": "Manda.L.Isch; Petru Dimitriu", "license": "CC BY-SA 4.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Silver_painted_skirt.jpg", "page": "https://commons.wikimedia.org/wiki/File:Silver_painted_skirt.jpg", "author": "Andrea Cornell", "license": "CC BY-SA 2.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/1/17/White_sneakers.jpg", "page": "https://commons.wikimedia.org/wiki/File:White_sneakers.jpg", "author": "Melania Sokolova (Toronto)", "license": "CC BY-SA 4.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Black_high-heeled_boots_in_synthetic_leather_2.jpg", "page": "https://commons.wikimedia.org/wiki/File:Black_high-heeled_boots_in_synthetic_leather_2.jpg", "author": "W.carter", "license": "CC BY-SA 4.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Chamois_leather_jacket_%28cropped%29.jpg", "page": "https://commons.wikimedia.org/wiki/File:Chamois_leather_jacket_%28cropped%29.jpg", "author": "Nikolay Komarov", "license": "CC BY-SA 4.0"}, {"url": "https://upload.wikimedia.org/wikipedia/commons/4/45/Khaki_Cargo_Pants_Front.jpg", "page": "https://commons.wikimedia.org/wiki/File:Khaki_Cargo_Pants_Front.jpg", "author": "Cici water", "license": "CC BY-SA 4.0"}];
function photo(product, cls='') {
  const item=photos[product.id-1];
  return `<img class="${cls}" src="img/${product.id}.svg" data-photo="${item.url}" alt="${product.name} (imagen de referencia)" decoding="async" loading="lazy">`;
}
function loadPhotos(){
 document.querySelectorAll('img[data-photo]').forEach(img=>{
  const url=img.dataset.photo; delete img.dataset.photo;
  if(!navigator.onLine) return;
  const probe=new Image(); probe.onload=()=>{img.src=url}; probe.src=url;
 });
}
function readRecord(){try{return Number(localStorage.getItem('atelierRecord'))||0}catch{return 0}}
function storeRecord(value){try{localStorage.setItem('atelierRecord',value)}catch{}}
let cart = [];
let favorites = new Set();
let currentFilter = 'all';

const $ = selector => {
  return document.querySelector(selector);
};

function money(number) {
  return '$' + number.toLocaleString('es-UY');
}

function scrollToId(id) {
  document
    .getElementById(id)
    .scrollIntoView({
      behavior: 'smooth'
    });
}

function renderProducts() {
  const grid = $('#productGrid');

  const list = products.filter(
    product =>
      currentFilter === 'all' ||
      product.cat === currentFilter || (currentFilter === "favorites" && favorites.has(product.id))
  );

  grid.innerHTML = list.map(product => `
    <article class="card">

      <div
        class="product-img"
        style="background:${product.bg}">

        ${photo(product)}

        <button
          aria-label="Alternar favorito" aria-pressed="${favorites.has(product.id)}" class="fav ${favorites.has(product.id) ? 'active' : ''}"
          onclick="toggleFav(${product.id})">

          ${favorites.has(product.id) ? '♥' : '♡'}

        </button>

      </div>

      <div class="info">

        <div class="name">
          ${product.name}
        </div>

        <div class="meta">
          <span>${product.tags[0]}</span>
          <span>${product.tags[1]}</span>
        </div>

        <div class="price">
          ${money(product.price)}
        </div>

        <button
          class="add"
          onclick="addToCart(${product.id})">

          Agregar al carrito

        </button>

      </div>

    </article>
  `).join('') || '<p class="empty">No hay prendas en esta categoría.</p>';
  loadPhotos();
}

function filterProducts(category, button) {
  currentFilter = category;

  document
    .querySelectorAll('.chip')
    .forEach(item => item.classList.remove('active'));

  button.classList.add('active');

  renderProducts();
}

function toggleFav(id) {
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }

  renderProducts();
  updateStats();

  showToast(
    favorites.has(id)
      ? 'Guardado en favoritos'
      : 'Quitado de favoritos'
  );
}

function addToCart(id) {
  const found = cart.find(
    item => item.id === id
  );

  if (found) {
    found.qty++;
  } else {
    cart.push({
      id: id,
      qty: 1
    });
  }

  updateCart();
  showToast('Agregado al carrito');
}

function changeQty(id, difference) {
  const item = cart.find(
    item => item.id === id
  );

  if (!item) {
    return;
  }

  item.qty += difference;

  if (item.qty <= 0) {
    cart = cart.filter(
      item => item.id !== id
    );
  }

  updateCart();
}

function updateCart() {
  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  $('#cartBadge').textContent = count;

  $('#cartItems').innerHTML = cart.length

    ? cart.map(item => {

        const product = products.find(
          product => product.id === item.id
        );

        return `
          <div class="cart-row">

            <div
              class="cart-art"
              style="background:${product.bg}">

              ${photo(product)}

            </div>

            <div>

              <strong>
                ${product.name}
              </strong>

              <div class="meta">
                ${money(product.price)}
              </div>

              <div class="qty">

                <button
                  onclick="changeQty(${product.id},-1)">
                  -
                </button>

                <span>
                  ${item.qty}
                </span>

                <button
                  onclick="changeQty(${product.id},1)">
                  +
                </button>

              </div>

            </div>

            <strong>
              ${money(product.price * item.qty)}
            </strong>

          </div>
        `;

      }).join('')

    : `
      <div
        style="
          text-align:center;
          color:var(--muted);
          padding:40px 10px;
        ">

        Tu carrito está vacío

      </div>
    `;

  const total = cart.reduce(
    (sum, item) => {

      const product = products.find(
        product => product.id === item.id
      );

      return sum + product.price * item.qty;

    },
    0
  );

  $('#cartTotal').textContent = money(total);

  updateStats();
  loadPhotos();
}

function toggleCart() {
  $('#drawer').classList.toggle('open');
}

function closeCartFromBg(event) {
  if (event.target.id === 'drawer') {
    toggleCart();
  }
}

function showToast(message) {
  const toast = $('#toast');

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(
    () => toast.classList.remove('show'),
    1400
  );
}

function updateStats() {
  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  $('#statsTitle').textContent =
    `${favorites.size} favorito${favorites.size === 1 ? '' : 's'} - ${count} producto${count === 1 ? '' : 's'}`;
}

function fakeCheckout() {
  if (!cart.length) {
    showToast(
      'Agregá algo al carrito primero'
    );

    return;
  }

  showToast(
    'Demo: pedido preparado'
  );

  setTimeout(() => {

    toggleCart();

    cart = [];

    updateCart();

  }, 650);
}

function resetDemo() {

  cart = [];

  favorites.clear();

  gameState = {
    tops: null,
    bottoms: null,
    shoes: null
  };

  renderProducts();

  updateCart();

  renderGame();

  $('#score').textContent = '0 / 30 pts';

  $('#outfitText').textContent =
    'Elegí tres prendas para empezar.';

  $('#outfitPreview').textContent =
    'Elegí tus prendas';

  showToast(
    'Experiencia reiniciada'
  );
}

let gameState = {
  tops: null,
  bottoms: null,
  shoes: null
};

const gameGroups = {

  tops: products.filter(
    product => product.cat === 'tops'
  ),

  bottoms: products.filter(
    product => product.cat === 'bottoms'
  ),

  shoes: products.filter(
    product => product.cat === 'shoes'
  )

};

function renderGame() {

  const wrapper = $('#gameOptions');

  wrapper.innerHTML =
    Object.entries(gameGroups)

      .map(([category, array]) => `

        <div
          style="
            width:100%;
            margin-bottom:7px;
          "
        >

          <div
            style="
              font-size:12px;
              text-transform:uppercase;
              letter-spacing:.1em;
              font-weight:900;
              color:var(--muted);
              margin-bottom:6px;
            "
          >

            ${
              category === 'tops'
                ? 'Arriba'
                : category === 'bottoms'
                ? 'Abajo'
                : 'Calzado'
            }

          </div>

          <div class="challenge">

            ${
              array.map(product => `

                <button
                  class="${gameState[category] === product.id ? 'selected' : ''}"
                  onclick="pickGame('${category}',${product.id})"
                >

                  ${product.name}

                </button>

              `).join('')
            }

          </div>

        </div>

      `)
      .join('');
}

const challenges = [
 {name:'Urbano',desc:'Armá un look cómodo para todos los días.',best:[2,3,5]},
 {name:'Noche de fiesta',desc:'Buscá un look elegante con brillo.',best:[1,4,6]},
 {name:'Exploración',desc:'Elegí prendas prácticas para salir a caminar.',best:[7,8,5]}
];
let challengeIndex=0;
function updateChallenge(){
 const ch=challenges[challengeIndex];
 $('#challengeName').textContent=ch.name; $('#challengeDesc').textContent=ch.desc;
 $('#record').textContent=readRecord()+' pts';
}
function nextChallenge(){
 challengeIndex=(challengeIndex+1)%challenges.length;
 gameState={tops:null,bottoms:null,shoes:null}; updateChallenge(); updateOutfit();
}
function pickGame(category,id){gameState[category]=id;updateOutfit()}
function updateOutfit(){
 const chosen=Object.values(gameState).filter(Boolean).map(id=>products.find(p=>p.id===id));
 const target=challenges[challengeIndex].best;
 const score=chosen.reduce((sum,p)=>sum+(target.includes(p.id)?10:3),0);
 $('#score').textContent=score+' / 30 pts';
 $('#outfitPreview').innerHTML=chosen.length?chosen.map(p=>`<div>${photo(p)}<small>${p.name}</small></div>`).join(''):'<p>Elegí una prenda de cada categoría.</p>';
 if(chosen.length<3) $('#outfitText').textContent=`${chosen.length}/3 prendas seleccionadas`;
 else {
  if(score>readRecord())storeRecord(score);
  $('#outfitText').textContent=score>=25?'¡Desafío logrado! Look perfecto.':'Probá otras combinaciones para llegar a 25 puntos.';
  updateChallenge();
 }
 renderGame();loadPhotos();
}

renderProducts();
renderGame();
updateCart();
updateChallenge();
updateOutfit();