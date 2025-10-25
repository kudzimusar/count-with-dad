import { STICKERS, CONFETTI_COLORS } from './constants';

export function createSticker(num: number) {
  const sticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
  
  const stickerEl = document.createElement('div');
  stickerEl.className = 'fixed pointer-events-none z-10 bounce-in float text-5xl';
  stickerEl.textContent = sticker;
  stickerEl.style.left = `${Math.random() * 80 + 10}%`;
  stickerEl.style.top = `${Math.random() * 80 + 10}%`;
  
  document.body.appendChild(stickerEl);
  
  setTimeout(() => {
    stickerEl.remove();
  }, 3000);
}

export function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'fixed w-3 h-3 pointer-events-none z-[100]';
    confetti.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}
