var app = {
    /**
     * Main function
     */
    initialize: function () {
        this.setElements();
        this.bindEvents();
    },

    /**
     * Set elements to manipulate
     * @returns {app}
     */
    setElements: function () {
        this.items = $('.collection-item');
        this.clear = $('#clear-selected');
        this.openModal = $('#open-order-summary');
        this.modal = $('.modal');
        this.tabs = $('.tabs.type');

        return this;
    },

    /**
     * Call DOM events
     * @returns {app}
     */
    bindEvents: function () {
        this.items.bind('click', this.selectItem);
        this.clear.bind('click', this.settingClear);
        this.openModal.bind('click', this.addSelectedItems);

        //Config to modal
        this.modal.modal({
            complete: this.clearModal
        });

        //Config to tabs
        this.tabs.tabs({
            swipeable: true
        });

        return this;
    },

    /**
     * Callback event to selected item
     * @returns {app}
     */
    selectItem: function () {
        var badge = null;
        var name = $(this).find('span').eq(0).text();

        if ($(this).find('.badge').length == 0) {
            badge = $('<span>', {
                class: 'badge',
                text: '1'
            });

            badge.appendTo($(this));

            app.showToast(name + ' adicionado');
        }
        else {
            badge = $(this).find('.badge');

            badge.text(parseInt(badge.text()) + 1);
        }

        return this;
    },

    /**
     * Callback event to clear selected items
     * @returns {app}
     */
    settingClear: function () {
        $('.badge').remove();

        app.getSelectedArea().find('.chip').remove();

        app.showToast('Limpado com sucesso');

        return this;
    },

    /**
     * Clear selecion area
     * @returns {app}
     */
    clearModal: function () {
        app.getSelectedArea().find('.chip').remove();

        return this;
    },

    /**
     * Add selected items in the selection area
     * @returns {app}
     */
    addSelectedItems: function () {
        $('.collection-item .badge').each(function () {
            var badge = $(this);
            var name = badge.parent().find('span').eq(0).text();
            var qty = badge.text();

            app.getChip(name, qty).appendTo(app.getSelectedArea());
        });

        return this;
    },

    /**
     * Show toast based on text
     * @param text
     */
    showToast: function (text) {
        Materialize.toast(text, 800);
    },

    /**
     * Retrieve selected area
     * @returns {*|jQuery|HTMLElement}
     */
    getSelectedArea: function () {
        return $('#selected-items');
    },

    /**
     * Retrieve chip structure
     * @param name
     * @param qty
     * @returns {*|jQuery|HTMLElement}
     */
    getChip: function (name, qty) {
        var chip = $('<div>', {
            class: 'chip',
            text: name + " - " + qty,
            name: name,
            qty: qty
        });

        var close = $('<i>', {
            class: 'close material-icons',
            html: 'close'
        });

        close.appendTo(chip);

        return chip;
    }
};

app.initialize();