require(["Pages","views/PagesList", "views/PageEdit", "views/PageDisplay", "views/PageCreate"], function(Pages, PagesList, PageEdit, PageDisplay, PageCreate){

  var self, //instance of router
    $el = $('.container'),
    pages = new Pages();

  _.defer(function(){ //чтобы выполнить инициализацию переменных в начале, а не в конце файла
    self = new Router();
    var startOk = Backbone.history.start({ pushState: true });
    console.info((startOk ? "Starting at " : "Route not identified: ") + Backbone.history.fragment);
  });

  /**
   * Главный диспетчеризатор приложения. Все смены состояния приложения происходят через него.
   *
   * Вью друг о друге ничего не знают. Если необхимо перейти на другой вью, то генерируется событие, которое
   * обрабатывается роутером, Дальше роутер вызывает свой метод goto, чтобы перейти в новое состояние
   * и одновременно обновить адресную строку.
   *
   * Еще раз, главный инвариант приложения:
   * Все смены состояния приложения (замена одного вью другим) происходят через роутер.
   */
  var Router = Backbone.Router.extend({
    /**
     * Чтобы постоянно не писать {trigger:true}
     * Роутер активный.Обычный воркфлой таков:
     * 1. Создает вью.
     * 2. Подписывается на события вью.
     * 3. По событию закрытия вью, отписыается и удаляет вью.

     * или
     * Если событие вызывает смену вью, то в конечном счете оно должно обрабатываться роутером.
     *
     * @param route
     */
    goto: function(route){
      this.navigate(route, {trigger: true});
      console.info('Switch route to ' + route);
    },
    routes: {
      '': 'index',
      '/': 'index',
      'create': 'create',
      ':id': function(id){
        var page = pages.get(id);
        if (page != null){
          self.display(id);
        } else {
          self.create(id);
        }
      },
      ':id/edit': 'edit'
    },
    index: function(){
      var view = new PagesList({el: $el, model: pages}).render();
      view.on('create', function(){
        self.close(view, ['create', 'display']);
        self.goto('create');
      });
      view.on('display', function(id){
        self.close(view, ['create', 'display']);
        self.goto(id)
      });
    },
    create: function(id){
      var view = new PageCreate({el: $el, id: id}).render();
      view.on('page:created', function(page){
        if (pages.isValid(page)){
          pages.add(page);
          self.close(view, ['page:created', 'close']);
          self.goto('/');
        } else {
          view.renderErrors(page);
        }
      });
      view.on('close', function(){
        self.close(view, ['page:created', 'close']);
        self.goto('/');
      });
    },
    display: function(id){
      var view = new PageDisplay({el: $el, model: pages.get(id)}).render();
      view.on('edit', function(){
        self.close(view, ['edit']);
        self.goto(id + '/edit');
      });
      view.on('cancel', function(){
        self.close(view, ['edit', 'cancel']);
        self.goto('/');
      });
    },
    edit: function(id){
      var page = pages.get(id);
      if (!page){
        alert('Page ' + id + ' not found');
        self.goto('/');
      } else {
        var view = new PageEdit({el: $el, model: page}).render();
        view.on('page:updated', function(page){
          self.close(view, ['page:updated', 'close']);
          self.goto('/' + page.get('id'));
        });
        view.on('close', function(){
          self.close(view, ['page:updated', 'close']);
          self.goto('/');
        });
      }
    },
    close: function(view, events){
      _.each(events, function(event){
        view.off(event);
      });
      view.remove();
    }
  });




});