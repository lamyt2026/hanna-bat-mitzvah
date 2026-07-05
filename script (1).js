const targetDate = new Date('2026-08-22T20:00:00-03:00');

// Pegar acá la URL de Google Apps Script cuando esté creada.
// Ejemplo: const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXX/exec';
const GOOGLE_SCRIPT_URL = '';

function goTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  const el = document.getElementById('countdown');

  if (diff <= 0) {
    el.innerHTML = '<div><strong>¡Hoy!</strong><span>LLEGÓ EL GRAN DÍA</span></div>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  el.innerHTML = `
    <div><strong>${days}</strong><span>DÍAS</span></div>
    <div><strong>${hours}</strong><span>HORAS</span></div>
    <div><strong>${minutes}</strong><span>MIN</span></div>
    <div><strong>${seconds}</strong><span>SEG</span></div>
  `;
}

function progressBar() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  document.getElementById('progress').style.width = scrolled + '%';
}

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) el.classList.add('visible');
  });
}

const cantidadSelect = document.querySelector('select[name="cantidad"]');
const menu2Label = document.getElementById('menu2Label');
const menu2Select = document.querySelector('select[name="menu2"]');

cantidadSelect.addEventListener('change', () => {
  if (cantidadSelect.value === '2') {
    menu2Label.style.display = 'block';
    menu2Select.required = true;
  } else {
    menu2Label.style.display = 'none';
    menu2Select.required = false;
    menu2Select.value = '';
  }
});

setInterval(updateCountdown, 1000);
updateCountdown();
progressBar();
revealOnScroll();

window.addEventListener('scroll', () => {
  progressBar();
  revealOnScroll();
});

document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const responseBox = document.getElementById('respuesta');
  const data = Object.fromEntries(new FormData(form).entries());
  data.fechaEnvio = new Date().toISOString();

  responseBox.className = 'response ok';
  responseBox.textContent = 'Enviando confirmación...';

  if (!GOOGLE_SCRIPT_URL) {
    console.log('Respuesta RSVP:', data);
    localStorage.setItem('ultimaConfirmacionHanna', JSON.stringify(data));
    responseBox.textContent = '¡Gracias! Esta es una versión de prueba. Cuando conectemos Google Sheets, la respuesta quedará guardada automáticamente.';
    form.reset();
    menu2Label.style.display = 'none';
    menu2Select.required = false;
    return;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    responseBox.className = 'response ok';
    responseBox.textContent = '¡Gracias! Tu respuesta fue registrada correctamente.';
    form.reset();
    menu2Label.style.display = 'none';
    menu2Select.required = false;
  } catch (error) {
    responseBox.className = 'response error';
    responseBox.textContent = 'No pudimos registrar la respuesta. Probá nuevamente o escribinos por WhatsApp.';
  }
});
