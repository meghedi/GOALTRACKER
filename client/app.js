function GetGoals() {
  $.get("http://localhost:3000/goals", function(data) {
    viewModel.goals(data);
  });
}

function ViewModel() {
  var self = this;
  self.goals = ko.observableArray();
  self.goalInputName = ko.observable();
  self.goalInputType = ko.observable();
  self.goalInputDeadline = ko.observable();
  self.isUpdate = ko.observable(false);
  self.updateId = ko.observable();
  self.selectedGoals = ko.observableArray();
  self.canEdit = ko.computed(function() {
    return self.selectedGoals().length > 0;
  });

  self.addGoal = function() {
    var name = $("#name").val();
    var type = $("#type").val();
    var deadline = $("#deadline").val();

    $.ajax({
      url: "http://localhost:3000/goals",
      type: "POST",
      data: JSON.stringify({
        name: name,
        type: type,
        deadline: deadline
      }),
      contentType: "application/json",
      success: function(data) {
        console.log("Goals Added...");
        self.goals.push({
          name: name,
          type: type,
          deadline: deadline
        });
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  };

  self.types = ko.observableArray([
    "Health & fitness",
    "Professionals",
    "Realtionships",
    "Self Help"
  ]);

  self.editSelected = function() {
    self.updateId = self.selectedGoals()[0]._id;
    var name = self.selectedGoals()[0].name;
    var type = self.selectedGoals()[0].type;
    var deadline = self.selectedGoals()[0].deadline;

    self.isUpdate(true);
    self.goalInputName(name);
    self.goalInputType(type);
    self.goalInputDeadline(deadline);
  };

  self.updateGoal = function() {
    var id = self.updateId;
    var name = $("#name").val();
    var type = $("#type").val();
    var deadline = $("#deadline").val();

    $.ajax({
      url: "http://localhost:3000/goals/" + id,
      type: "PUT",
      data: JSON.stringify({
        name: name,
        type: type,
        deadline: deadline
      }),
      contentType: "application/json",
      success: function(data) {
        console.log("Goal Updated...");
        self.goals.remove(function(item) {
          return item._id == id;
        });
        self.goals.push({
          name: name,
          type: type,
          deadline: deadline
        });
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  };

  self.deleteSelected = function() {
    $.each(self.selectedGoals(), function(index, value) {
      var id = self.selectedGoals()[index]._id;
      $.ajax({
        url: "http://localhost:3000/goals/" + id,
        type: "DELETE",
        async: true,
        timeout: 300000,
        success: function() {
          console.log("Goals removed");
          self.goals.removeAll(self.selectedGoals());
          self.selectedGoals.removeAll();
        },
        error: function(xhr, status, err) {
          console.log(err);
        }
      });
    });
  };
}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
