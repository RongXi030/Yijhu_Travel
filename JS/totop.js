document.addEventListener("DOMContentLoaded", function () {
    
    const toTopBtn = document.querySelector(".ToTop");

    window.addEventListener("scroll", function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            toTopBtn.classList.add("ToTopshow");
        } else {
            toTopBtn.classList.remove("ToTopshow");
        }
    });
    toTopBtn.addEventListener("click", function (e) {
        
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link'); 
    const offcanvasDiv = document.getElementById('offcanvasNavbar');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (offcanvasDiv && offcanvasDiv.classList.contains('show')) {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasDiv);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        });
    });

    const sideTabs = document.querySelectorAll('.list-group-item-action');
    
    sideTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
});