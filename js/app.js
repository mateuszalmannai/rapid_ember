
App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'exermatic-data'
});

App.Walk = DS.Model.extend({
  dateWalked: DS.attr('date'),
  distanceWalked: DS.attr('number'),
  minutesTaken: DS.attr('number'),
  mood: DS.attr('string')
});

// Create a 'walks' route
App.Router.map(function () {
  this.resource('walks');
  });

/*
  We want the application to automatically load the 'walks' route
  when the application is accessed: to do this we can specify a
  custom index route and use the transitionTo() method on the router
  - We're using the Router's beforeModel hook which is called the first
    time it loads
  - The following method uses the beforeModel hook to force a route
    transition as the Router loads, we could also use the redirect
    hook
  - there are a lot of different router and controller hooks available
*/
App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('walks')
  }
});

/*
  - Make our model data available so that we can display it in the page
  - We do this by making a custom WalksRoute, which loads the model data
    and makes it available to the controller
  - the model hook is set to a function which returns a value:
    this.store.find('walk'), where 'walk' is our model name
  - Get a list of walks from the database and returns them
*/
App.WalksRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('walk')
  }
});


