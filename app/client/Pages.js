define(function(){

  return Backbone.Collection.extend({
    comparator: function(page){
      return page.get('name');
    },
    isValid: function(page){
      if (this.findWhere({id: page.get('id')})){
        page.validation.push({name:'id', message: 'Адрес уже занят'});
        return false;
      }
      if (page.get('id') == 'create'){
        page.validation.push({name:'id', message: 'Недопустимый адрес'});
        return false;
      }
      return true;
    }

  });
});
