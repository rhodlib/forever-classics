import { useRef, useState, useEffect } from 'preact/hooks';
import '../styles/global.css';

export default function CocktailCarousel({ cocktails }) {
  const [modalIndex, setModalIndex] = useState(null);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [didInitialScroll, setDidInitialScroll] = useState(false);

  // Modal
  const closeModal = () => setModalIndex(null);

  // Swipe/drag logic (opcional, simple)
  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftStart = carouselRef.current.scrollLeft;
    carouselRef.current.classList.add('cursor-grabbing');
  };
  const onMouseUp = () => {
    isDragging = false;
    carouselRef.current.classList.remove('cursor-grabbing');
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  // Detectar la card central al hacer scroll
  useEffect(() => {
    const container = carouselRef.current;
    const handleScroll = () => {
      if (container.scrollLeft < 10) {
        setActiveIndex(0);
        return;
      }
      const items = Array.from(container.querySelectorAll('.carousel-item'));
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let minDiff = Infinity;
      let centerIdx = 0;
      const realItems = items.filter(item => !item.hasAttribute('aria-hidden'));
      realItems.forEach((item, idx) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const diff = Math.abs(containerCenter - itemCenter);
        if (diff < minDiff) {
          minDiff = diff;
          centerIdx = idx;
        }
      });
      setActiveIndex(centerIdx);
    };
    container.addEventListener('scroll', handleScroll);
    handleScroll();

    // Scroll inicial solo una vez
    if (!didInitialScroll) {
      // Desactiva el snap temporalmente
      container.style.scrollSnapType = 'none';
      const items = container.querySelectorAll('.carousel-item');
      if (items.length > 1) {
        const item = items[1]; // Primer cóctel (índice 1 por el ghost)
        const scrollTo = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
        container.scrollTo({ left: scrollTo, behavior: 'auto' });
      }
      // Reactiva el snap después de un tick
      setTimeout(() => {
        container.style.scrollSnapType = '';
        setDidInitialScroll(true);
      }, 50);
    }

    return () => container.removeEventListener('scroll', handleScroll);
  }, [didInitialScroll]);

  // Render
  return (
    <div class="w-full flex flex-col items-center">
      <div
        ref={carouselRef}
        id="carousel"
        class="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth no-scrollbar gap-6 w-full px-8 sm:px-12 py-10"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {/* Ghost item al inicio */}
        <div class="carousel-item snap-center shrink-0 w-[45vw] sm:w-[32vw] lg:w-[20vw]" aria-hidden="true"></div>
        {cocktails.map((c, i) => (
          <div
            class={`carousel-item snap-center shrink-0 w-[45vw] sm:w-[32vw] lg:w-[20vw] transition-transform duration-300 ease-in-out ${activeIndex === i ? 'scale-105 z-30 neon-border' : 'scale-95 opacity-60'}`}
            data-index={i}
            key={c.name}
          >
            <div class="bg-[#1c1c2b] rounded-2xl shadow-xl overflow-hidden h-[60vh] sm:h-[65vh] lg:h-[70vh] flex flex-col relative">
              {/* Badge recomendado */}
              {(c.name === 'Negroni' || c.name === 'Old Fashioned') && (
                <span class="absolute top-4 right-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-40 animate-pulse">
                  Recomendado
                </span>
              )}
              <img
                src={c.image}
                alt={c.name}
                class="w-full h-1/2 object-cover"
              />
              <div class="p-6 flex flex-col justify-center items-center h-1/2">
                <h2 class="text-2xl font-bold text-white mb-2">{c.name}</h2>
                <p class="text-gray-300 text-center mb-4">{c.description}</p>
                <button
                  class="px-6 py-3 bg-white text-black rounded-md text-sm cursor-pointer"
                  onClick={() => {
                    if (activeIndex !== i) {
                      // Centrar la card
                      const container = carouselRef.current;
                      const items = container.querySelectorAll('.carousel-item');
                      const item = items[i + 1]; // +1 por el ghost item inicial
                      const box = item.getBoundingClientRect();
                      const containerBox = container.getBoundingClientRect();
                      const scrollTo = item.offsetLeft - (container.offsetWidth / 2) + (box.width / 2);
                      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
                    } else {
                      setModalIndex(i);
                    }
                  }}
                >
                  Ver receta
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Ghost item al final (ancho extra para centrar el último) */}
        <div class="carousel-item snap-center shrink-0 w-[60vw] sm:w-[45vw] lg:w-[28vw]" aria-hidden="true"></div>
      </div>
      {/* Modal */}
      {modalIndex !== null && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in" tabIndex={-1} aria-modal="true" role="dialog">
          <div class="bg-[#1c1c2b] rounded-2xl shadow-2xl p-10 pt-20 max-w-lg w-full mx-4 text-white relative modal-content neon-border h-[90vh] flex flex-col justify-between" style={{ height: '90vh', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={closeModal}
              class="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full text-3xl neon shadow-lg hover:shadow-[0_0_16px_4px_#ff00cc] focus:shadow-[0_0_16px_4px_#ff00cc] focus:outline-none transition-all duration-150 bg-transparent cursor-pointer"
              aria-label="Cerrar"
              tabIndex={0}
            >
              <span class="sr-only">Cerrar</span>
              &times;
            </button>
            <img src={cocktails[modalIndex].image} alt={cocktails[modalIndex].name} class="w-full h-64 object-contain rounded-lg mb-4 bg-black" />
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">{cocktails[modalIndex].name}</h2>
                <p class="text-sm italic text-gray-400 mb-4">{cocktails[modalIndex].history}</p>
                <h3 class="text-xl font-bold mb-2">Receta</h3>
                <p class="mb-2">{cocktails[modalIndex].recipe}</p>
                <h4 class="text-lg font-semibold mb-1">Preparación</h4>
                <p class="mb-2">{cocktails[modalIndex].preparation}</p>
              </div>
            </div>
          </div>
          {/* Cerrar modal con click fuera */}
          <div class="fixed inset-0" onClick={closeModal} style="z-index:-1;"></div>
        </div>
      )}
    </div>
  );
} 