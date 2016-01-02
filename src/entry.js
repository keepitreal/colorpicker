(function() {
    var el = document.getElementById('colorpicker');
    var gradient = el.querySelector('#colorpickGradient');
    var gradientRect = gradient.getBoundingClientRect();
    
    gradient.addEventListener('click', function(ev) {
       console.log(ev); 
    });
})();