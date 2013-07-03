define(['views/View'], function(View){

  return View.extend({
    template: 'list.html',
    events: {
      'click .create-new': function(){
        this.trigger('create');
        return false;
      },
      'click .page-name': function(e){
        var id = this.$(e.currentTarget).attr('data-id');
        this.trigger('display', id);
        return false;
      }
    },
    render_: function(){
      this.renderList();
    },
    renderList: function(){
      var $list = this.$('.pages-list');
      $list.html("");
      if (this.model.length == 0){
        $list.append("Пока нет ни одной страницы");
        return;
      }
      var groups = this.model.groupBy(function(page){
        var chr = page.get('name')[0];
        return chr.toUpperCase();
      });
      _.each(_(groups).keys(), function(chr){
        $list.append('<p>'+chr+'</p>')
        var pages = groups[chr];
        _.each(pages, function(page){
          $list.append(_.template('<a class="page-name" data-id="${id}" href="/${id}">${name}</a><br/>', {
            name: page.get('name'),
            id: page.get('id')
          }))
        });
      })
    }
  });

});
