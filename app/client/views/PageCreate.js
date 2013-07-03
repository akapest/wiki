define(['Page', 'views/PageEdit'], function(Page, PageEdit){

  return PageEdit.extend({
    init: function(){
      this.edit = false;
      this.model = new Page({id: this.options.id});
    }
  });
});
