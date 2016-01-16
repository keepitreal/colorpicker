import Converters from './Converters';

export default class Colorpicker {
    constructor(el) {
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
    
    setColorRangeStops() {
        let gradient = 'linear-gradient(to bottom,';
        
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
    
    startSliderDrag(ev) {
        this.sliderDraggable = true;
        this.lastDragY = ev.screenY;
    }
    
    dragSlider(ev) {
        const spectrumRect = this.spectrumRect;
        const spectrumSliderRect = this.spectrumSlider.getBoundingClientRect();
        const sliderHalfHeight = spectrumSliderRect.height / 2;
        const yPos = ev.screenY;
        const dragBy = this.dragBy + yPos - this.lastDragY;
        const sliderTop = sliderHalfHeight + dragBy;
        const aboveSpectrum = sliderTop < 0;
        const belowSpectrum = sliderTop > spectrumRect.height;
        
        if (this.sliderDraggable && !aboveSpectrum && !belowSpectrum) {
            this.spectrumSlider.style.top = dragBy + 'px';
            this.dragBy = dragBy;
            this.lastDragY = yPos;
        }
    }
    
    endSliderDrag(ev) {
        if (this.sliderDraggable) {
            this.sliderDraggable = false;
        }
    }
}