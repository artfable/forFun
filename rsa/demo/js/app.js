/**
 * @author artfable
 * 22.02.16
 */
$(function() {
    'use strict';
    let rsa;

    let RsaModel = Backbone.Model.extend({
        generateKey: function() {
            rsa = new RSA();
            this.set({key: rsa.getFullKey()});
        }
    });

    /**
     * It will be good, to make own view to each panel, for not rerender all. But it only for rsa test, so maybe later)))
     * @type {void|*}
     */
    let view = new (Backbone.View.extend({
        el: '#app_container',
        template: _.template($('#template').html()),

        model: new RsaModel,

        events: {
            'click #generate_btn': 'generate',
            'change #full_key_chb': 'setFull',
            'click #enter_key_btn': 'enterKey',
            'click #encrypt button': 'encrypt',
            'click #decrypt button': 'decrypt'
        },

        generate: function(event) {
            let that = this;

            $('button').button('loading');
            _.delay(function() { // generating of key is rather long (and lock script), so we do it after off button
                that.model.generateKey();
                that.render();
            }, 50);
        },

        setFull: function(event) {
            if ($(event.target).is(':checked')) {
                $('#d_number').removeClass('hidden');
            } else {
                $('#d_number').addClass('hidden');
            }
        },

        enterKey: function() {
            let key = {
                e: $('#e_number').val(),
                n: $('#n_number').val()
            };
            if ($('#full_key_chb').is(':checked')) {
                key.d = $('#d_number').val();
            }
            this.model.set({key: key});
            this.render();
        },

        encrypt: function() {
            let text = $('#encrypt').find('textarea').val();
            // also can be too long, better block buttons
            $('#decrypt').find('textarea').val(rsa.encrypt(text));
        },

        decrypt: function() {
            let text = $('#decrypt').find('textarea').val();
            $('#encrypt').find('textarea').val(rsa.decrypt(text));
        },

        render: function() {
            this.$el.html(this.template({model: this.model.toJSON()}))
        }
    }));

    view.render();

});