document.addEventListener('DOMContentLoaded', function () {
  const carrusel = document.querySelector('.puntos-interes-carrusel .carrusel');
  const prevBtn = document.querySelector('.puntos-interes-carrusel .prev-btn');
  const nextBtn = document.querySelector('.puntos-interes-carrusel .next-btn');
  const items = document.querySelectorAll(".tarjeta");
  const overlay = document.getElementById("overlay");
  const imagenGrande = document.getElementById("imagenGrande");
  const close = document.getElementById("close");

  const imagenesPorNombre = {
    "Iglesia de Nuestra Señora del Rivero": "../static/img/nuestra_senora_del_rivero.jpg",
    "Iglesia de San Miguel": "../static/img/san-miguel-san-esteban-gormaz.webp",
    "Castillo de San Esteban de Gormaz": "../static/img/castillo_san_esteban_de_gormaz.jpg",
    "Puente de los 16 ojos": "../static/img/puente_16_ojos.jpg",
    "Arco de la Villa": "../static/img/arco_villa_SEdG.jpg",
    "Ecomuseo Molino de los Ojos": "../static/img/ecomuseo_de_los_ojos.webp",
    "Parque Temático del Románico": "../static/img/parque-tematico-romanico-san-esteban-gormaz.jpg",
    "Plaza Mayor": "../static/img/pza-mayor-san.esteban-gormaz.jpg",
    "Calle Mayor": "../static/img/calle_mayor_san_esteban_de_gormaz.jpg",
    "Bodegas Tradicionales": "../static/img/bodegas_tradicionales_san_esteban_de_gormaz.jpg",
    "Museo de San Esteban": "../static/img/museo_san_esteban.jpeg",
    "Parque Fluvial": "../static/img/parque_fluvial_SEdG.jpg",
    "Pozo Artesano": "../static/img/pozo_artesiano_SEdG.jpg",
    "Mirador de las Eras": "../static/img/parque_fluvial_SEdG.jpg",
    "Ruta de los Molinos": "../static/img/senda_molinos_SEdG.jpg",
    "Área de descanso El Plantío": "../static/img/area_descanso_plantio_SEdG.jpg",
    "Centro de Interpretación del Vino": "../static/img/centro_interpretacion_vino_SEdG.jpg",
    "Centro de Interpretación del Románico": "../static/img/centro_interpretacion_romanico_SEdG.jpeg",
    "Pasarela Fluvial": "../static/img/senda_fluvial_SEdG.jpeg",
    "Mirador del Cid": "../static/img/mirador_del_cid_SEdG.jpg",
    "Tienda Artesanal": "../static/img/tienda_artesanal_SEdG.jpg"
  };

  // Función para cargar los datos de la API
  async function cargarPuntosInteres() {
    try {
      const response = await fetch('http://localhost:5065/api/PuntoInteres');
      if (!response.ok) {
        throw new Error(`Error al obtener los viajes: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.contenido && data.contenido.length > 0) {
        mostrarPuntosInteres(data.contenido);
        iniciarAutoscroll();
      } else {
        carrusel.innerHTML = '<p>No hay puntos de interés disponibles</p>';
      }
    } catch (error) {
      console.error('Error al cargar los puntos de interés:', error);
      carrusel.innerHTML = '<p>Error al cargar los puntos de interés</p>';
    }
  }

  // Función para mostrar los puntos de interés en el carrusel
  function mostrarPuntosInteres(puntos) {
    carrusel.innerHTML = '';

    puntos.forEach(punto => {
      const categoria = obtenerNombreCategoria(punto.idCategoria);

      const tarjeta = document.createElement('div');
      tarjeta.className = 'tarjeta';
      tarjeta.innerHTML = `
          <span class="categoria">${categoria}</span>
          <h3>${punto.nombre}</h3>
          <div class="direccion">${punto.direccion}</div>
          <p class="descripcion">${punto.descripcion || 'Sin descripción disponible'}</p>
        `;
      tarjeta.setAttribute("data-src", imagenesPorNombre[punto.nombre]);

      carrusel.appendChild(tarjeta);
      tarjeta.addEventListener("click", function() {
        let imagenSRC = this.getAttribute("data-src");
        imagenGrande.src = imagenSRC;
        overlay.style.display = "flex";
      });
    });
  }

  // Función de ejemplo para obtener el nombre de la categoría (deberías adaptarla)
  function obtenerNombreCategoria(idCategoria) {
    const categorias = {
      1: "Cultural",
      2: "Aventura",
      3: "Gastronómico",
      4: "Vinos",
      5: "Deporte",
      6: "Tecnológico",
      7: "Bienestar",
      8: "Misterio",
      9: "Tradición",
      10: "Naturaleza"
    };
    return categorias[idCategoria] || 'Otro';
  }

  // Navegación del carrusel
  prevBtn.addEventListener('click', () => {
    carrusel.scrollBy({ left: -300, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carrusel.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // Autoscroll
  let intervaloAutoscroll;

  function iniciarAutoscroll() {
    intervaloAutoscroll = setInterval(() => {
      const scrollActual = carrusel.scrollLeft;
      const anchoTarjeta = 300 + 20; // Ancho + gap
      const maxScroll = carrusel.scrollWidth - carrusel.clientWidth;

      if (scrollActual >= maxScroll - 10) {
        // Si estamos al final, volver al inicio
        carrusel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Avanzar a la siguiente tarjeta
        carrusel.scrollBy({ left: anchoTarjeta, behavior: 'smooth' });
      }
    }, 5000); // Cambia cada 5 segundos
  }

  // Pausar autoscroll al interactuar
  carrusel.addEventListener('mouseenter', () => {
    clearInterval(intervaloAutoscroll);
  });

  carrusel.addEventListener('mouseleave', () => {
    iniciarAutoscroll();
  });

  close.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
    }
  });

  // Cargar los puntos de interés al iniciar
  cargarPuntosInteres();
});