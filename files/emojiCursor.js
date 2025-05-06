(function emojiCursor() {
  const possibleEmoji = [...new Set(["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "😎", "🤓", "🧐", "🤩", "😏", "😒", "😞", "😔", "😟", "🙁", "☹️", "😣", "😖", "😫", "😩", "😤", "😠", "😡", "🤬", "😈", "👿", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬"])];
  let width = window.innerWidth;
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: width / 2 };
  let particles = [];
  let scheduledAnimationFrame = false;

  function init() {
    addStyles();
    bindEvents();
    loop();
  }

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .emoji-cursor-particle {
        position: fixed;
        top: 0;
        display: block;
        pointer-events: none;
        z-index: 10000000;
        font-size: 24px;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }

  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchstart', onTouchMove);
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        scheduleParticleAdd(e.touches[i].clientX, e.touches[i].clientY);
      }
    }
  }

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    scheduleParticleAdd(cursor.x, cursor.y);
  }

  function scheduleParticleAdd(x, y) {
    if (!scheduledAnimationFrame) {
      scheduledAnimationFrame = true;
      requestAnimationFrame(() => {
        addParticle(x, y, possibleEmoji[Math.floor(Math.random() * possibleEmoji.length)]);
        scheduledAnimationFrame = false;
      });
    }
  }

  function addParticle(x, y, character) {
    const particle = new Particle();
    particle.init(x, y, character);
    particles.push(particle);
  }

  function updateParticles() {
    particles = particles.filter(particle => {
      particle.update();
      if (particle.lifeSpan < 0) {
        particle.die();
        return false;
      }
      return true;
    });
  }

  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }

  function Particle() {
    this.lifeSpan = 120; // 120 frames

    this.init = function(x, y, character) {
      this.velocity = {
        x: (Math.random() - 0.5) * 0.5, // -0.25 ~ 0.25
        y: 1
      };
      this.position = { x: x - 10, y: y - 20 };
      this.element = document.createElement('span');
      this.element.className = 'emoji-cursor-particle';
      this.element.textContent = character;
      document.body.appendChild(this.element);
    };

    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;
      const scale = this.lifeSpan / 120;
      this.element.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0) scale(${scale})`;
    };

    this.die = function() {
      this.element.remove();
    };
  }

  init();
})();
