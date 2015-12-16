App = Ember.Application.create();

App.Router.map(function() {
  this.resource("walks", {path: "list-walks"}, function(){
    this.route("view");
  });
});