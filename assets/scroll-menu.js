class ScrollMenu {

    constructor(el) {
        this.DOM = {el: el};
        this.DOM.menuItems = [...this.DOM.el.querySelectorAll('.menu-item')];

        this.cloneItems();
        this.initScroll();
        this.initEvents();

        this.render();
    }

    initEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.cloneItems();
        this.initScroll();
    }

    cloneItems() {
        const itemHeight = this.DOM.menuItems[0].offsetHeight;
        const fitIn = Math.ceil(window.innerHeight / itemHeight);

        // Remove any
        this.DOM.el.querySelectorAll('._clone').forEach(clone => this.DOM.el.removeChild(clone));
        // Add clones
        let totalClones = 0;
        this.DOM.menuItems.filter((_, index) => (index < fitIn)).map(target => {
            const clone = target.cloneNode(true);
            clone.classList.add('_clone');
            this.DOM.el.appendChild(clone);
            ++totalClones;
        });

        // All clones height
        this.clonesHeight = totalClones * itemHeight;
        // Scrollable area height
        this.scrollHeight = this.DOM.el.scrollHeight;
    }

    initScroll() {
        // Scroll 1 pixel to allow upwards scrolling
        this.scrollPos = this.getScrollPos();
        if (this.scrollPos <= 0) {
            this.setScrollPos(1);
        }
    }

    getScrollPos() {
        return (this.DOM.el.pageYOffset || this.DOM.el.scrollTop) - (this.DOM.el.clientTop || 0);
    }

    setScrollPos(pos) {
        this.DOM.el.scrollTop = pos;
    }


    scrollUpdate() {
        this.scrollPos = this.getScrollPos();

        if ( this.clonesHeight + this.scrollPos >= this.scrollHeight ) {
            // Scroll to the top when you’ve reached the bottom
            this.setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
        }
        else if ( this.scrollPos <= 0 ) {
            // Scroll to the bottom when you reach the top
            this.setScrollPos(this.scrollHeight - this.clonesHeight);
        }
    }

    render() {
        this.scrollUpdate();
        requestAnimationFrame(() => this.render());
    }

}
