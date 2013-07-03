define(function(){

  _.templateSettings.interpolate = /\$\{(.+?)\}/g;   // ${такой} стиль переменных в шаблонах

  var notValidChars = /[^a-zA-Zа-яА-Я0-9_\-\)\(\s]/g;

  var linkTemplate = _.template('<a href="${href}">${name}</a>');

  return Backbone.Model.extend({
    validate: function(){
      this.validation = [];
      this.checkToBeNotEmpty('id', 'Адрес страницы');
      this.checkToBeNotEmpty('name', 'Название страницы');
      this.validateId();
      return this.validation.length > 0;
    },
    link: function(){
      return '/' + this.get('name');
    },
    checkToBeNotEmpty: function(prop, name){
      if (this.get(prop) == '' || this.get(prop) == null){
        var message = name + ' не может быть пустым';
        this.validation.push({name:prop, message: message});
      }
    },
    validateId: function(){
      var id = this.get('id');
      var match = id.match(notValidChars);
      if (match && match.length > 0){
        var message = "Недопустимые символы: " + _.uniq(match).join(' ,');
        this.validation.push({name:'id', message: message});
      }
    },
    compile: function(){
      var body = this.get('body') || '';
      body = body.replace(/==(.*?)==/g, '<h2 class="small">$1</h2>');
      body = body.replace(/=(.*?)=/g, '<h1 class="small">$1</h1>');
      body = body.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      body = body.replace(/\/\/(.*?)\/\//g, '<i>$1</i>');
      body = body.replace(/__(.*?)__/g, '<u>$1</u>');
      body = body.replace(/\[\[(.+?)\]\]/g, function(match, group){
        var data = {};
        if (group.indexOf('|') > 0){
          var arr = group.split('|');
          data = {name: arr[1], href: arr[0]};
        } else {
          data = {name:group, href:group};
        }
        if (data.href.indexOf('http') != 0){
          data.href = '/' + data.href;
        }
        return linkTemplate(data);
      });
      this.set({compiled: body});
    }

  }, {
    linkFromName: function(name){
      return name.replace(notValidChars, '_');
    }
  });

});
