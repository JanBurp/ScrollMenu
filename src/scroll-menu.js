class ScrollMenu {

    DOM           = {};
    itemHeight    = 0;
    scrollHeight  = 0;
    clonesHeight  = 0;
    activeItem    = -1;
    scrollPos     = 0;
    prevScrollPos = 0;
    timer         = false;
    autoScroll    = false;
    scrollSpeed   = 0;
    options       = {
        speed         : 10,
        wait          : 3000,
        currentClass  : 'current-menu-item',
        activeClass   : 'active-menu-item',
    };


    constructor(el,config) {

        if ( config!==null ) {
            this.options = {...this.options,...config};
        }

        this.DOM = {wrapper: el};
        this.DOM.el = this.DOM.wrapper.querySelector('ul');
        this.DOM.menuItems = [...this.DOM.el.querySelectorAll('li')];
        this.DOM.currentItem = this.DOM.el.querySelector('.' + this.options.currentClass);

        this.prepareDOM();

        let self = this;
        window.addEventListener("load", function () {
            self.cloneItems();
            self.initScroll();
            self.initEvents();
            self.render();
            self.scrollToActiveItem(self,false)
        });
    }


    prepareDOM() {
        // Unique ID as wrapper
        this.DOM.wrapper.id = 'scroll-menu-wrapper';

        // transparent blocks on top and bottom
        let top = document.createElement("div");
        top.classList.add('top');
        this.DOM.wrapper.appendChild(top);
        let bottom = document.createElement("div");
        bottom.classList.add('bottom');
        this.DOM.wrapper.appendChild(bottom);

        // items a unique class
        this.DOM.menuItems.forEach( (item, index) => item.classList.add('item-'+(index+1)) );

        // scroll block on top, so scrolling is possible
        let self = this;
        this.DOM.scrollContainer = document.createElement("div");
        this.DOM.scrollContainer.classList.add('scrollcontainer');
        this.DOM.scroller = document.createElement("div");
        this.DOM.scroller.classList.add('scroller');
        this.DOM.wrapper.appendChild(this.DOM.scrollContainer).appendChild(this.DOM.scroller);
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
        this.scrollHeight = this.clonesHeight*2;
        this.DOM.scroller.style.height = this.scrollHeight+"px";
    }

    initEvents() {
        let self = this;
        this.timer = false;
        window.addEventListener('resize', () => self.resize());
        this.DOM.scrollContainer.addEventListener('mousemove', () => self.mouseMoved(event));
        this.DOM.scrollContainer.addEventListener('mouseenter', () => self.startAutoScroll());
        this.DOM.scrollContainer.addEventListener('mouseleave', () => self.stopAutoScroll());
        this.DOM.scrollContainer.addEventListener('click', (event) => {
            let url = self.DOM.wrapper.querySelector('.'+ this.options.activeClass + ' a').getAttribute('href');
            location.href = url;
        });
    }

    resize() {
        this.cloneItems();
        this.initScroll();
    }

    initScroll() {
        // Scroll 1 pixel to allow upwards scrolling
        this.scrollPos = this.getScrollPos();
        this.prevScrollPos = this.scrollPos;
        if (this.scrollPos <= 0) {
            this.setScrollPos(1);
        }
    }

    getScrollPos() {
        let scrollPos = (this.DOM.scrollContainer.pageYOffset || this.DOM.scrollContainer.scrollTop) - (this.DOM.scrollContainer.clientTop || 0);
        this.DOM.el.scrollTo({ top:scrollPos, behavior: 'instant' });
        return scrollPos;
    }

    setScrollPos(pos) {
        this.DOM.el.scrollTop = pos;
        this.DOM.scrollContainer.scrollTop = pos;
    }

    mouseMoved(event) {
        let relativePosY = (event.clientY - this.DOM.el.getBoundingClientRect().top) - this.DOM.el.clientHeight/2;

        if (this.autoScroll) {
            if ( Math.abs(relativePosY)<26 ) {
                this.scrollSpeed = 0;
            }
            else {
                this.scrollSpeed = relativePosY / (this.DOM.el.clientHeight/2)
            }
        }

        if ( (relativePosY > -this.itemHeight ) && (relativePosY < this.itemHeight ) ) {
            this.DOM.wrapper.querySelector('.' + this.options.activeClass).classList.add('hover');
        }
        else {
            this.DOM.wrapper.querySelector('.' + this.options.activeClass).classList.remove('hover');
        }
    }

    startAutoScroll() {
        this.autoScroll = true;
    }

    stopAutoScroll() {
        this.autoScroll = false;
    }

    scrollUpdate() {
        if (this.autoScroll) {
            let pos = this.getScrollPos();
            let diff = this.scrollSpeed * this.options.speed;
            pos = (pos*100 + diff*100) / 100; // prevent JS Maths rounding errors
            this.setScrollPos(pos);
        }

        this.scrollPos = this.getScrollPos();

        // Scroll to the top when you???ve reached the bottom
        if ( this.scrollPos + this.clonesHeight >= this.scrollHeight ) {
            this.setScrollPos(1);
        }
        // Scroll to the bottom when you reach the top
        else if ( this.scrollPos <= 0 ) {
            this.setScrollPos(this.scrollHeight - this.clonesHeight);
        }

        // Scroll back to current item when scrolling stoppped
        if ( this.prevScrollPos==this.scrollPos) {
            if ( this.timer===false ) {
                this.startWaitTimer();
            }
        }
        else {
            this.resetWaitTimer();
        }
        this.prevScrollPos = this.scrollPos;
        this.updateActiveItem();
    }

    startWaitTimer() {
        let self = this;
        this.timer = setTimeout(function(){
            self.scrollToActiveItem(self);
        }, this.options.wait);
    }

    resetWaitTimer() {
        clearTimeout(this.timer);
        this.timer = false;
    }

    scrollToActiveItem(self,smooth) {
        if (self.DOM.currentItem) {
            let behavior = (smooth!==false) ? 'smooth' : 'instant';
            let scrollTo = self.DOM.currentItem.offsetTop - (self.DOM.el.clientHeight / 2);
            let currentScroll = self.getScrollPos();
            if ( Math.abs(scrollTo - currentScroll) > 1 ) {
                if (scrollTo <= 0) {
                    scrollTo += self.clonesHeight;
                }
                self.DOM.el.scrollTo({ top:scrollTo, behavior: behavior });
                self.DOM.scrollContainer.scrollTo({ top:scrollTo, behavior: behavior });
            }
        }
    }

    updateActiveItem() {
        let middleScroll = this.getScrollPos() + this.DOM.el.clientHeight/2;
        let newActiveItem = Math.floor(middleScroll / this.itemHeight) % this.DOM.menuItems.length;
        if (newActiveItem != this.activeItem) {
            this.activeItem = newActiveItem;
            // remove current active item
            let current = this.DOM.wrapper.querySelector('.' + this.options.activeClass);
            if (current) {
                this.DOM.wrapper.removeChild(current);
            }
            // clone active item
            if ( typeof(this.DOM.menuItems[this.activeItem]) !== 'undefined' ) {
                const clone = this.DOM.menuItems[this.activeItem].cloneNode(true);
                clone.classList.add(this.options.activeClass);
                this.DOM.wrapper.appendChild(clone);
            }
        }
    }

    render() {
        this.scrollUpdate();
        requestAnimationFrame(() => this.render());
    }

}
