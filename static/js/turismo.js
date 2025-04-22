$(document).ready(function () {
    let images = [];
    let currentIndex = 0;

    $('.image-grid img').each(function (index) {
        images.push({
            src: $(this).attr('src'),
            alt: $(this).attr('alt')
        });

        $(this).on('click', function () {
            currentIndex = index;
            showLightbox();
        });
    });

    function showLightbox() {
        $('#lightbox').remove(); // Eliminar si ya existe

        const lightboxHtml = `
        <div id="lightbox">
          <img id="lightbox-img" src="${images[currentIndex].src}" alt="${images[currentIndex].alt}">
          <div class="controls">
            <button id="prev-btn">Anterior</button>
            <button id="close-btn">Cerrar</button>
            <button id="next-btn">Siguiente</button>
          </div>
        </div>
      `;

        $('body').append(lightboxHtml);

        $('#prev-btn').on('click', showPreviousImage);
        $('#next-btn').on('click', showNextImage);
        $('#close-btn').on('click', closeLightbox);
        $(document).on('keydown', handleKeyPress);

        $('#lightbox').on('click', function (e) {
            if ($(e.target).is('#lightbox')) closeLightbox();
        });
    }

    function showPreviousImage() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateImage();
    }

    function updateImage() {
        $('#lightbox-img').attr('src', images[currentIndex].src);
        $('#lightbox-img').attr('alt', images[currentIndex].alt);
    }

    function closeLightbox() {
        $('#lightbox').fadeOut(200, function () {
            $(this).remove();
        });
        $(document).off('keydown', handleKeyPress);
    }

    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') showPreviousImage();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'Escape') closeLightbox();
    }
});