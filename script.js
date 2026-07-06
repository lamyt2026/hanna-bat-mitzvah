const targetDate = new Date(2026, 7, 22, 20, 0, 0);

function updateCountdown() {
  const el = document.querySelector('#countdown');
  if (!el) return;

  const diff = targetDate.getTime() - new Date().getTime();

  if (diff <= 0) {
    el.innerHTML = '<div><strong>¡Hoy!</strong><span>LLEGÓ EL GRAN DÍA</span></div>';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  el.innerHTML =
    '<div><strong>' + days + '</strong><span>DÍAS</span></div>' +
    '<div><strong>' + hours + '</strong><span>HORAS</span></div>' +
    '<div><strong>' + minutes + '</strong><span>MIN</span></div>' +
    '<div><strong>' + seconds + '</strong><span>SEG</span></div>';
}

document.addEventListener('DOMContentLoaded', function () {
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
