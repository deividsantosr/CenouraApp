var app = {
    /**
     * Main function
     */
    initialize: function () {
        this.numOrder = 100000;

        this.build();
        this.bindEvents();
    },

    /**
     * Set elements to manipulate
     * @returns {app}
     */
    build: function () {
        this.tableNumber = {
            btn: $('#scan-qrcode'),
            input: $('#table-number')
        };
        this.items = $('.collection-item');
        this.clear = $('#clear-selected');
        this.openModal = $('#open-order-summary');
        this.btnOrder = $('#save-order');
        this.btnClose = $('#close-modal');
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
        this.btnOrder.bind('click', this.closeOrder);
        this.tableNumber.btn.bind('click', this.selectTableNumber);

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
    settingClear: function (showToast) {
        showToast = typeof showToast !== 'undefined' ? showToast : true;

        $('.badge').remove();

        app.getSelectedArea().find('.chip').remove();

        if (showToast) {
            app.showToast('Limpado com sucesso');
        }

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
     * Trigger to close modal
     * @returns {app}
     */
    closeModal: function () {
        this.btnClose.trigger('click');

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
     * Add table number by QRCode
     * @returns {app}
     */
    selectTableNumber: function () {
        cordova.plugins.barcodeScanner.scan(function (result) {
            app.tableNumber.input.val(result.text);
        }, function (error) {
            app.showToast(error);
        });

        return this;
    },

    /**
     * Close order to click on btnOrder
     * @returns {app}
     */
    closeOrder: function () {
        var table = app.getTableNumber();
        var summary = app.getSummary();

        app.saveOrder(table, summary);

        return this;
    },

    /**
     * Send order via API
     * @param table
     * @param info
     */
    saveOrder: function (table, info) {
        var data = {
            pedido: this.numOrder
        };

        if (!Number.isNaN(table)) {
            data.mesa = table;
        }

        if (info.length) {
            data.info = info;
        }

        $.ajax({
            method: 'GET',
            url: 'http://cozinhapp.sergiolopes.org/novo-pedido',
            data: data,
            success: function () {
                app.showToast('Pedido efetuado com sucesso!');

                app.settingClear(false);
                app.clearModal();
                app.closeModal();
            },
            error: function (data) {
                app.vibratorPattern();

                app.showToast('Erro ao efetuar o pedido (' + data.responseText + ')');
            },
            complete: function () {
                app.numOrder++;
            }
        });
    },

    /**
     * Show toast based on text
     * @param text
     */
    showToast: function (text) {
        Materialize.toast(text, 800);
    },

    /**
     * Vibrate pattern to device on app
     * @returns {app}
     */
    vibratorPattern: function () {
        navigator.vibrate([50, 100, 50]);

        return this;
    },

    /**
     * Retrieve selected area
     * @returns {*|jQuery|HTMLElement}
     */
    getSelectedArea: function () {
        return $('#selected-items');
    },

    /**
     * Retrieve table number
     * @returns {Number}
     */
    getTableNumber: function () {
        return parseInt(this.tableNumber.input.val());
    },

    /**
     * Retrieve summary text
     * @returns {string}
     */
    getSummary: function () {
        var summary = '';

        this.getSelectedArea().find('.chip').each(function () {
            summary += $(this).text() + '; ';
        });

        summary = summary.slice(0, -2);

        return summary;
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