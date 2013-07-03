define(['Page', 'views/View'], function(Page, View){

  return View.extend({
    template: 'display.html',
    events: {
      'click .edit': function(){
        this.trigger('edit', this.model.get('id'));
      }
    },
    data: function(){
      this.model.compile();
      return this.model.attributes;
    }
  });
});