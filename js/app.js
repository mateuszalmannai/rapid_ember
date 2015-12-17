App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'exermatic-data'
});

// Model
App.Walk = DS.Model.extend({
  dateWalked: DS.attr('date'),
  distanceWalked: DS.attr('number'),
  minutesTaken: DS.attr('number'),
  mood: DS.attr('string'),

  // divide distance by time and convert to hours
  kmPerHour: function(){
    return 60 * this.get('distanceWalked') / this.get('minutesTaken');
  }.property('distanceWalked', 'minutesTaken')

});

/*
 - Create a 'walks' route
 - Nest add route inside walks route, this way we keep our list
 of walks down the left-hand side as a common interface

 */
App.Router.map(function () {
  this.resource('walks', function () {
    this.route('add');
    this.route('walk', {path: '/:id'});
  });
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
  beforeModel: function () {
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
  model: function () {
    return this.store.find('walk')
  }
});

/*
 - the store.createRecord() function creates a new record in memory
 - the deactivate hook is called when we leave the route
 - this uses the controllerFor() method of the route to get the controller
 - and it checks the isDirty property of the model, if this is true then
 the model has not been saved and we can delete it
 - this will prevent it cluttering up the list of walks later on
 */
App.WalksAddRoute = Ember.Route.extend({
  model: function () {
    return this.store.createRecord('walk');
  },
  deactivate: function () {
    var walk = this.controllerFor('walks.add').get('content');

    if (walk.get('isDirty')) {
      walk.deleteRecord();
    }

  }
});


/*
 - add walksAdd controller to perform basic data validation
 - we're using an Object controller which extends the standard controller and
 let's us refer to the model properties directly in the template
 - the actions object is where we handle events triggered from within our template
 */
App.WalksAddController = Ember.ObjectController.extend({
  error: "",
  actions: {
    addWalk: function () {
      var walk = this.get('content');
      if (typeof walk.get('dateWalked') === 'undefined' ||
        typeof walk.get('distanceWalked') === 'undefined' ||
        typeof walk.get('minutesTaken') === 'undefined' ||
        typeof walk.get('mood') === 'undefined') {
        this.set('error', 'Please populate all the fields');
        return;
      }

      // ensure the data is in the correct format
      walk.set('dateWalked', new Date(walk.get('dateWalked')));
      walk.save();

      // go look at the new walk
      this.set('error', '');
      this.transitionToRoute('walks.walk', walk);
    }
  }
})
;
