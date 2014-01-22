VictimsCollection = new Meteor.Collection("victims");
QuestionsCollection = new Meteor.Collection("questions");

var reset = function() {
  var victims = VictimsCollection.find().fetch();
  var questions = QuestionsCollection.find().fetch();
  _.each(victims, function(item) {
      VictimsCollection.remove({'_id': item._id});
  });
  _.each(questions, function(item) {
      QuestionsCollection.remove({'_id': item._id});
  });

  var victimsName = ['Steven', 'Thibault', 'Cédric', 'Pierrick', 'Paul', 'Laurent'];
  _.each(victimsName, function(item, index) {
    var victimId = VictimsCollection.insert({name: item});
    for(var i=0; i<5; i++) {
      QuestionsCollection.insert({victimId: victimId, status: true});
    }
  });
}

// CLIENT
if (Meteor.isClient) {
  Template.victims_questions.helpers({
    victims: function() {
      return VictimsCollection.find().fetch();
    }
  });

  Template.victim.helpers({
    questions: function() {
      return QuestionsCollection.find({victimId: this._id}).fetch();
    }
  });

  Template.question.events({
    'click' : function (event) {
      QuestionsCollection.update(this._id, {$set: {status: !this.status}});
    }
  });
}

// SERVER
if (Meteor.isServer) {
    Meteor.startup(function () {
      reset();
    });
}
