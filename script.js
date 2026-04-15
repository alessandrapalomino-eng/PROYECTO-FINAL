document.addEventListener('DOMContentLoaded', () => {
    // Animación de entrada para los productos
    const products = document.querySelectorAll('.product-card');
    
    const revealProduct = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    };

    const productObserver = new IntersectionObserver(revealProduct, {
        root: null,
        threshold: 0.1
    });

    products.forEach(p => {
        p.style.opacity = "0";
        p.style.transform = "translateY(50px)";
        p.style.transition = "all 0.8s cubic-bezier(0.2, 1, 0.3, 1)";
        productObserver.observe(p);
    });

    // Interactividad en el botón de búsqueda
    const searchBtn = document.querySelector('.search-bar');
    searchBtn.addEventListener('click', () => {
        const query = prompt("¿Qué accesorio de Renzo Costa buscas hoy?");
        if(query) console.log(`Buscando: ${query}`);
    });
});