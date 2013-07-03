define(function(){

  /**
   * Базовый класс вью.
   * Доставляет шаблон с сервера (не кэширует).
   * Данные локальные.
   */
  return Backbone.View.extend({
    template: '',
    data: function(){ //переопределить эту функцию для отрисовки конкретных данных
      return {};
    },
    initialize: function(){
      this._tmpl = $.get('/tmpl/' + this.template);
      this.init();
    },
    init: $.noop,
    render: function(){
      var self = this;
      self._tmpl.done(function(tmpl){
        self.$el.html(_.template(tmpl, self.data()));
        self.render_();
        window.document.title = self.$('.title').html();
      });
      return this;
    },
    render_: $.noop, // переопределить эту функцию, чтобы выполнить доп. работу после отрисовки вью
    remove: function(){
      this.$el.html('');
      this.undelegateEvents();
    },
    renderErrors: function(model){
      _.each(model.validation, function(obj){
        this.$('.' + obj.name + '.validation').html(obj.message);
      }, this);
    }
  });
});
