(function() {
    function Colorpick(el) {
        this.el = document.getElementById(el);
        
        // The selected color gradient
        this.gradient = this.el.querySelector('#colorpickGradient');
        this.gradientRect = this.gradient.getBoundingClientRect();
        
        // The spectrum from which to select any color
        this.spectrum = this.el.querySelector('#colorpickSpectrum');
        this.spectrumRect = this.spectrum.getBoundingClientRect();
        
        // The slider control that shows what color is chosen from the spectrum
        this.spectrumSlider = this.el.querySelector('#colorpickSlider');
        this.sliderDraggable = false;
        this.lastDragY = 0;
        this.dragBy = 0;
        this.sliderPosition = 0;
        
        // The preview pane that shows the selected color
        this.colorPreview = this.el.querySelector('#colorpickPreview');
        
        // Array of colors shown on the spectrum
        this.colorRangeStops = [
            {r: 255, g: 0, b: 0},
            {r: 255, g: 0, b: 128},
            {r: 255, g: 0, b: 255},
            {r: 128, g: 0, b: 255},
            {r: 0, g: 0, b: 255},
            {r: 0, g: 128, b: 255},
            {r: 0, g: 255, b: 255},
            {r: 0, g: 255, b: 128},
            {r: 0, g: 255, b: 0},
            {r: 128, g: 255, b: 0},
            {r: 255, g: 255, b: 0},
            {r: 255, g: 128, b: 0},
            {r: 255, g: 0, b: 0}
        ];
        
        // Set up DOM events
        //this.gradient.addEventListener('click', this.selectColor.bind(this));
        this.spectrumSlider.addEventListener('mousedown', this.startSliderDrag.bind(this));
        this.spectrumSlider.addEventListener('mouseup', this.endSliderDrag.bind(this));
        this.spectrumSlider.addEventListener('mousemove', this.dragSlider.bind(this));
        this.el.addEventListener('mouseup', this.endSliderDrag.bind(this));
        
        this.setColorRangeStops();
    }
    
    Colorpick.prototype.setColorRangeStops = function() {
        var gradient = 'linear-gradient(to bottom,';
        
        this.colorRangeStops.forEach((color, index) => {
            gradient += 'rgb('
            gradient += color.r + ',';
            gradient += color.g + ',';
            gradient += color.b + ')';
            
            if (index !== this.colorRangeStops.length - 1) {
                gradient += ',';
            }
            
        });
        
        gradient += ')';
        this.spectrum.style.background = gradient;
    }
    
    Colorpick.prototype.startSliderDrag = function(ev) {
        this.sliderDraggable = true;
        this.lastDragY = ev.screenY;
    }
    
    Colorpick.prototype.dragSlider = function(ev) {
        var spectrumRect = this.spectrumRect;
        var spectrumSliderRect = this.spectrumSlider.getBoundingClientRect();
        var sliderHalfHeight = spectrumSliderRect.height / 2;
        var yPos = ev.screenY;
        var dragBy = this.dragBy + yPos - this.lastDragY;
        var sliderTop = sliderHalfHeight + dragBy;
        var aboveSpectrum = sliderTop < 0;
        var belowSpectrum = sliderTop > spectrumRect.height;
        
        if (this.sliderDraggable && !aboveSpectrum && !belowSpectrum) {
            this.spectrumSlider.style.top = dragBy + 'px';
            this.dragBy = dragBy;
            this.lastDragY = yPos;
            this.sliderPosition = sliderTop;
        }
    }
    
    Colorpick.prototype.endSliderDrag = function(ev) {
        if (this.sliderDraggable) {
            this.sliderDraggable = false;
            this.selectColorFromSpectrum();
        }
    }
    
    Colorpick.prototype.selectColorFromSpectrum = function() {
        var colorRangeStops = this.colorRangeStops;
        var precision = 100;
        var ratio = Math.round((this.sliderPosition / this.spectrumRect.height) * (colorRangeStops.length * precision)) / precision;
        var color1 = colorRangeStops[Math.floor(ratio) - 1];
        var color2 = colorRangeStops[Math.ceil(ratio) - 1];
        var selectedColor = this.computeColorDifference(color1, color2, Math.ceil(ratio) - ratio);
        
        this.setColor(selectedColor);
    }
    
    Colorpick.prototype.computeColorDifference = function(color1, color2, ratio) {
        return {
            r: this.computeSingleDifference(color1.r, color2.r, ratio),
            g: this.computeSingleDifference(color1.g, color2.g, ratio),
            b: this.computeSingleDifference(color1.b, color2.b, ratio)
        }
    }
    
    Colorpick.prototype.computeSingleDifference = function(color1, color2, ratio) {
        var multiplicand = color1 > color2 ? -1 : 1;
        return Math.round(color1 + (multiplicand * (Math.abs(color1 - color2) * ratio)));
    }
    
    Colorpick.prototype.setColor = function(rgb) {
        this.colorPreview.style.background = this.objToRGBString(rgb);
    }
    
    Colorpick.prototype.objToRGBString = function(rgb) {
        var keys = Object.keys(rgb);
        return 'rgb(' + keys.map(function(key) {
            return rgb[key];
        }).join(',') + ')';
    }
    
    var colorpicker = new Colorpick('colorpicker');
})();