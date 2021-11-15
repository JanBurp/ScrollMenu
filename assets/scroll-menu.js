class ScrollMenu {

    DOM           = {};
    itemHeight    = 0;
    scrollHeight  = 0;
    clonesHeight  = 0;
    activeItem    = -1;
    scrollPos     = 0;
    prevScrollPos = 0;
    timer         = false;

    constructor(el) {
        this.DOM = {wrapper: el};
        this.DOM.el = this.DOM.wrapper.querySelector('ul');
        this.DOM.menuItems = [...this.DOM.el.querySelectorAll('.menu-item')];
        this.DOM.currentItem = this.DOM.el.querySelector('.current-menu-item');

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

    initEvents() {
        let self = this;
        this.timer = false;
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.cloneItems();
        this.initScroll();
    }

    prepareDOM() {
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
        this.DOM.scrollContainer.classList.add('_scrollcontainer');
        this.DOM.scrollContainer.addEventListener('click', () => {
            let url = self.DOM.wrapper.querySelector('.active-menu-item a').getAttribute('href');
            alert(url);
        });
        this.DOM.scroller = document.createElement("div");
        this.DOM.scroller.classList.add('_scroller');
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
        this.scrollHeight = this.clonesHeight*2; //this.DOM.el.scrollHeight;
        this.DOM.scroller.style.height = this.scrollHeight;
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


    scrollUpdate() {
        this.scrollPos = this.getScrollPos();

        // Scroll to the top when you’ve reached the bottom
        if ( this.scrollPos + this.clonesHeight >= this.scrollHeight ) {
            this.setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
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
        }, 3000);
    }

    resetWaitTimer() {
        clearTimeout(this.timer);
        this.timer = false;
    }

    scrollToActiveItem(self,smooth) {
        let behavior = (smooth!==false) ? 'smooth' : 'instant';
        let scrollTo = self.DOM.currentItem.offsetTop - (self.DOM.el.clientHeight / 2);
        if (scrollTo <= 0) {
            scrollTo += self.clonesHeight;
        }
        self.DOM.el.scrollTo({ top:scrollTo, behavior: behavior });
        self.DOM.scrollContainer.scrollTo({ top:scrollTo, behavior: behavior });
    }

    updateActiveItem() {
        let middleScroll = this.getScrollPos() + this.DOM.el.clientHeight/2;
        let newActiveItem = Math.floor(middleScroll / this.itemHeight) % this.DOM.menuItems.length;
        if (newActiveItem != this.activeItem) {
            this.activeItem = newActiveItem;
            // remove current active item
            let current = this.DOM.wrapper.querySelector('.active-menu-item');
            if (current) {
                this.DOM.wrapper.removeChild(current);
            }
            // clone active item
            const clone = this.DOM.menuItems[this.activeItem].cloneNode(true);
            clone.classList.add('active-menu-item');
            this.DOM.wrapper.appendChild(clone);
        }
    }

    render() {
        this.scrollUpdate();
        requestAnimationFrame(() => this.render());
    }

}
