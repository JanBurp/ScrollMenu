class ScrollMenu {

    constructor(el) {
        this.DOM = {wrapper: el};
        this.DOM.el = this.DOM.wrapper.querySelector('ul');
        this.DOM.menuItems = [...this.DOM.el.querySelectorAll('.menu-item')];

        this.prepareDOM();
        this.cloneItems();
        this.initScroll();
        this.initEvents();

        this.render();
    }

    prepareDOM() {
        // transparent blocks on top and bottom
        var top = document.createElement("div");
        top.classList.add('top');
        this.DOM.wrapper.appendChild(top);
        var bottom = document.createElement("div");
        bottom.classList.add('bottom');
        this.DOM.wrapper.appendChild(bottom);

        // items a unique class
        this.DOM.menuItems.forEach( (item, index) => item.classList.add('item-'+(index+1)) );
    }

    initEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.cloneItems();
        this.initScroll();
    }

    cloneItems() {
        this.itemHeight = this.DOM.menuItems[0].offsetHeight;
        const fitIn = Math.ceil(window.innerHeight / this.itemHeight);

        // Remove current clones
        this.DOM.el.querySelectorAll('._clone').forEach(clone => this.DOM.el.removeChild(clone));

        // Add new clones
        let totalClones = 0;
        this.DOM.menuItems.filter((_, index) => (index < fitIn)).map(target => {
            const clone = target.cloneNode(true);
            clone.classList.add('_clone');
            this.DOM.el.appendChild(clone);
            totalClones++;
        });

        // All clones height
        this.clonesHeight = totalClones * this.itemHeight;
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

        // Scroll to the top when you’ve reached the bottom
        if ( this.clonesHeight + this.scrollPos >= this.scrollHeight ) {
            this.setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
        }
        // Scroll to the bottom when you reach the top
        else if ( this.scrollPos <= 0 ) {
            this.setScrollPos(this.scrollHeight - this.clonesHeight);
        }

        this.updateActiveItem();
    }

    updateActiveItem() {
        let middleScroll = this.getScrollPos() + this.DOM.el.clientHeight / 2;
        this.activeItem = Math.floor(middleScroll / this.itemHeight) % this.DOM.menuItems.length + 1;
        // remove current item class
        this.DOM.el.querySelectorAll('.active-menu-item').forEach(item => item.classList.remove('active-menu-item'));
        // set new current item class
        this.DOM.el.querySelectorAll('li.item-'+this.activeItem).forEach( item => item.classList.add('active-menu-item'));
    }

    render() {
        this.scrollUpdate();
        requestAnimationFrame(() => this.render());
    }

}
