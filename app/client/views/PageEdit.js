define(['Page', 'views/View'], function(Page, View){

  return View.extend({
    template: 'edit.html',
    init: function(){
      this.edit = true;
    },
    events: {
      'click .action': function(){
        try{
          var data = {
            id: this.$id.val(),
            name: this.$name.val(),
            body: this.$body.val()
          };
          this.model.set(data);
          if (this.model.isValid()){
            this.trigger(this.edit? 'page:updated': 'page:created', this.model);
          } else {
            this.renderErrors(this.model);
          }
        } catch (e){
          console.error(e.message);
        }
        return false;
      },
      'blur .name': function(){
        if (this.$id.val() == ''){
          this.$id.val(Page.linkFromName(this.$name.val()));
        }
      },
      'click .cancel': function(){
        this.trigger('close');
        return false;
      }
    },
    render_: function(){
      this.$id = this.$('.id.input');
      this.$name = this.$('.name.input');
      this.$body = this.$('.body.input');
      this.$action = this.$('.action.btn');
      this.$title = this.$('.title');

      this.$id.val(this.model.get('id'));
      this.$name.val(this.model.get('name'));
      this.$body.val(this.model.get('body'));
      this.$action.html(this.edit? 'Сохранить': 'Создать');

      if (this.edit || this.model.get('id')){
        this.$id.attr('disabled', 'disabled');
      }
      if (this.edit){
        this.$title.html(this.model.get('name') + ': Редактирование');
      }
    }
  });
});
