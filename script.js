// Basic SPA navigation + product data + cart + tracking demo

const views = document.querySelectorAll('.page');
const menu = document.getElementById('sideMenu');
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const menuLinks = document.querySelectorAll('.menu-list a');
const yearSpan = document.getElementById('year');
const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');

yearSpan.textContent = new Date().getFullYear();

// sample products & pricing (based on provided pricing ranges)
const products = [
  { id: "p1", name: "Ecoyst Starter", weight: "250g", price: 129, desc: "Perfect for small indoor plants and trial buyers., image: "starter.jpeg" },
  { id: "p2", name: "Bolcony Booster", weight: "2x250g ", price: 249, desc: "Ideal for regular plant care and medium gardens." },
  { id: "p3", name: "Circular Gardener", weight: "4x250g (1kg)", price: 450, desc: "Convenient pouches for easy use and storage." },
  { id: "p4", name: "Waste Warrior Bulk", weight: "5kg", price: 2099, desc: "Bulk pack for community gardens and heavy users." }
];

// cart helpers
function loadCart(){
  try{
    return JSON.parse(localStorage.getItem('ecoyst_cart')||'[]');
  }catch(e){ return [];}
}
function saveCart(c){
  localStorage.setItem('ecoyst_cart', JSON.stringify(c));
  cartCount.textContent = c.reduce((s,i)=>s+i.qty,0);
}
let cart = loadCart();
saveCart(cart);

// render products
function renderProducts(){
  productGrid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="prod-img"><span style="color:#888">Image</span></div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-meta">${p.desc}</div>
      <div class="prod-meta">Weight: ${p.weight}</div>
      <div class="add-row">
        <div style="font-weight:700">₹${p.price}</div>
        <div>
          <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll('.add-cart').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    });
  });
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(i=>i.id===id);
  if(existing){
    existing.qty++;
  }else{
    cart.push({id:p.id, name:p.name, price:p.price, qty:1});
  }
  saveCart(cart);
  alert(`${p.name} added to cart`);
}

// SPA navigation
function showView(name){
  views.forEach(v=>v.classList.remove('active'));
  const el = document.getElementById(name);
  if(el) el.classList.add('active');
  // close side menu if open
  menu.classList.remove('open');
}

menuBtn.addEventListener('click', ()=> menu.classList.add('open'));
closeMenu.addEventListener('click', ()=> menu.classList.remove('open'));
menuLinks.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const view = a.dataset.view;
    showView(view);
  });
});

// learn more scroll to about product
document.getElementById('learnMore').addEventListener('click', ()=> showView('product'));

// insta buttons — open in new tab (hidden behind icon, not shown as text link)
document.getElementById('instaBtn').addEventListener('click', ()=> window.open('https://www.instagram.com/theecoyst?igsh=MWV6aDh4dzRjdG5jYg==','_blank'));
document.getElementById('instaBtn2').addEventListener('click', ()=> window.open('https://www.instagram.com/theecoyst?igsh=MWV6aDh4dzRjdG5jYg==','_blank'));

// Track order logic (demo). This does not call any server. It simulates tracking using the input.
const trackBtn = document.getElementById('trackBtn');
const orderInput = document.getElementById('orderInput');
const orderResult = document.getElementById('orderResult');
const tracker = document.getElementById('tracker');
const orderMeta = document.getElementById('orderMeta');

function resetTracker(){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
}

function fillTracker(stage){
  resetTracker();
  for(let i=1;i<=stage;i++){
    const el = tracker.querySelector(`.step[data-step="${i}"]`);
    if(el) el.classList.add('active');
  }
}

trackBtn.addEventListener('click', ()=>{
  const val = orderInput.value.trim();
  if(!val){ alert('Please enter an Order ID or phone number'); return; }
  // simulate: use a simple hash to determine stage
  const hash = Array.from(val).reduce((s,ch)=>s+ch.charCodeAt(0),0);
  const stage = (hash % 4) + 1; // 1..4
  orderResult.classList.remove('hidden');
  fillTracker(stage);
  // show meta
  const est = new Date(Date.now() + (4-stage)*24*60*60*1000);
  orderMeta.innerHTML = `
    <p><strong>Order ID:</strong> ${val}</p>
    <p><strong>Current Stage:</strong> ${['','Order Placed','Order Initiated','Preparing','Delivered'][stage]}</p>
    <p><strong>Estimated Delivery:</strong> ${est.toDateString()}</p>
  `;
});

// search & account placeholders
document.getElementById('searchBtn').addEventListener('click', ()=> alert('Search is coming soon'));
document.getElementById('accountBtn').addEventListener('click', ()=> alert('Account features coming soon'));

// close menu on outside click (optional)
document.addEventListener('click', (e)=>{
  if(!menu.contains(e.target) && !menuBtn.contains(e.target)) menu.classList.remove('open');
});

// initialize
renderProducts();



