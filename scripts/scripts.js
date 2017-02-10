'use strict';

/**
 * @ngdoc overview
 * @name powerHouseApp
 * @description
 * # powerHouseApp
 *
 * Main module of the application.
 */
angular
  .module('powerHouseApp', [
    'ngMaterial',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',
    'material.components.expansionPanels'
  ])
  .config(["$routeProvider", "localStorageServiceProvider", "$mdThemingProvider", "$mdInkRippleProvider", function ($routeProvider, localStorageServiceProvider, $mdThemingProvider, $mdInkRippleProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/program-list', {
        templateUrl: 'views/programList.html',
        controller: 'programListCtrl',
        controllerAs: 'programList'
      })
      .when('/add-program', {
        templateUrl: 'views/addProgram.html',
        controller: 'addProgramCtrl',
        controllerAs: 'addProgram'
      })
      .when('/add-program-type', {
        templateUrl: 'views/addProgramType.html',
        controller: 'addProgramTypeCtrl',
        controllerAs: 'addProgramType'
      })
      .when('/program-type-list', {
        templateUrl: 'views/programTypeList.html',
        controller: 'ProgramTypeListCtrl',
        controllerAs: 'programTypeList'
      })
      .when('/program-type-information/:id', {
        templateUrl: 'views/programTypeInformation.html',
        controller: 'ProgramTypeInformationCtrl',
        controllerAs: 'programTypeInformation'
      })
      .when('/program-information/:id', {
        templateUrl: 'views/programInformation.html',
        controller: 'ProgramInformationCtrl',
        controllerAs: 'programInformation'
      })
      .when('/edit-program/:id', {
        templateUrl: 'views/editProgram.html',
        controller: 'EditProgramCtrl',
        controllerAs: 'editProgram'
      })
      .when('/edit-program-type/:id', {
        templateUrl: 'views/editProgramType.html',
        controller: 'EditProgramTypeCtrl',
        controllerAs: 'editProgramType'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .otherwise({
        redirectTo: '/'
      });

      localStorageServiceProvider.setPrefix('PowerHouse');

      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('deep-orange');

      $mdInkRippleProvider
        .disableInkRipple();
  }]);
'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:NavigationBar
 * @description
 * # NavigationBar
 */
angular.module('powerHouseApp')
  .directive('navigationBar', function () {
    return {
      templateUrl: 'scripts/directives/navigationBar/navigationBarView.html',
      restrict: 'E',
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramType
 * @description
 * # addProgramType
 */
angular.module('powerHouseApp')
  .directive('addProgramType', ['addProgramTypeService', function (addProgramTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeView.html',
      restrict: 'E',
      scope: {
        programTypeName: '=',
        exercises: '=',
        weeks: '=',
        addFunction: '=',
        removeFunction: '=',
        invalidFunction: '='
      },
      link: function postLink(scope) {

        addProgramTypeService.weeks = scope.weeks;
        addProgramTypeService.exercises = scope.exercises;

        scope.$watchCollection(function(){
          return scope.exercises;
        }, function(newValue, oldValue){
          addProgramTypeService.exercises = scope.exercises;
          // Exercise removed
          if(newValue.length < oldValue.length){
            scope.weeks = addProgramTypeService.exerciseRemoved(scope.exercises, scope.weeks);
          }
        });

        scope.$watch(function(){
          return addProgramTypeService.weeks;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.weeks = newValue;
          }
        }, true);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('dashboardCtrl', ['$scope', 'dashboardService', function ($scope, dashboardService) {

    // Completed Program Data
    $scope.completedHeaderText = dashboardService.completedHeaderText;
    $scope.completedHighlightText = dashboardService.completedHighlightText;
    $scope.completedHighlightColor = dashboardService.completedHighlightColor;
    $scope.completeSubheadText = dashboardService.completeSubheadText;
    
    // Active Program Data
    $scope.activeHeaderText = dashboardService.activeHeaderText;
    $scope.activeHighlightText = dashboardService.activeHighlightText;
    $scope.activeHighlightColor = dashboardService.activeHighlightColor;
    $scope.activeSubheadText = dashboardService.activeSubheadText;

    // Quick Complete
    $scope.quickCompleteProgram = dashboardService.quickCompleteProgram;

    $scope.$watch(function(){
      return dashboardService.getCompletedPrograms();
    }, function(){
      $scope.completedHighlightText = dashboardService.completedHighlightText;
    });

    $scope.$watch(function(){
      return dashboardService.getActivePrograms();
    }, function(){
      $scope.activeHighlightText = dashboardService.activeHighlightText;
    });

    $scope.$watch(function(){
      return dashboardService.getQuickCompleteProgram();
    }, function(){
      $scope.quickCompleteProgram = dashboardService.quickCompleteProgram;
    }, true);

  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ProgramlistCtrl
 * @description
 * # ProgramlistCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('programListCtrl', [function () {

  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:AddprogramCtrl
 * @description
 * # AddprogramCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('addProgramCtrl', ['$scope', '$location', 'addProgramService', function ($scope, $location, addProgramService) {
        $scope.programName = '';
        $scope.programType = '';
        $scope.increment = '';
        $scope.exercises = [];

        $scope.addFunction = function(programName, programType, increment, exercises){
          addProgramService.addProgram(programName, programType, increment, exercises);
          $location.path('program-list');
        };

        $scope.removeFunction = function(){
          $scope.programName = '';
          $scope.programType = '';
          $scope.increment = '';
          $scope.exercises = [];
        };

        $scope.invalidFunction = function(programName, programType, increment, exercises){
          return addProgramService.invalid(programName, programType, increment, exercises);
        };

        $scope.$watch(function(){
          return $scope.programType;
        },
        function(newValue, oldValue){
          if(newValue !== oldValue && newValue !== ''){
            $scope.exercises = addProgramService.getExercises($scope.programType);
          }
        });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:AddprogramtypeCtrl
 * @description
 * # AddprogramtypeCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('addProgramTypeCtrl', ['$scope', '$location', 'addProgramTypeService', 'toastService', function ($scope, $location, addProgramTypeService, toastService) {

    $scope.programTypeName = '';
    $scope.exercises = [];
    $scope.weeks = [];

    $scope.addFunction = function(programTypeName, exercises, weeks){
      addProgramTypeService.addProgramType(programTypeName, exercises, weeks);
      $location.path('program-type-list');
    };

    $scope.removeFunction = function(){
      var tempProgramTypeName = angular.copy($scope.programTypeName);
      var tempExercises = angular.copy($scope.exercises);
      var tempWeeks = angular.copy($scope.weeks);
      toastService.showUndoToast('Program type removed', function(){
        $scope.programTypeName = tempProgramTypeName;
        $scope.exercises = tempExercises;
        $scope.weeks = tempWeeks;
      });

      $scope.programTypeName = '';
      $scope.exercises = [];
      $scope.weeks = [];
    };

    $scope.invalidFunction = function(programName, exercises, weeks){
      return addProgramTypeService.isInvalid(programName, exercises, weeks);
    };

    $scope.$watchCollection(function(){
      return $scope.exercises;
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        addProgramTypeService.exercises = newValue;
      }
    });


  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ProgramtypelistCtrl
 * @description
 * # ProgramtypelistCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ProgramTypeListCtrl', function () {
    
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeService
 * @description
 * # programTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeService', ['utilService', 'storageService', 'keyHandlerService', 'toastService', 'defaultProgramTypeService', function (utilService, storageService, keyHandlerService, toastService, defaultProgramTypeService) {
    
    var contract = {
      programTypes: []
    };

    var init = function(){
      contract.programTypes = defaultProgramTypeService.getDefaultProgramTypes().concat(getProgramTypesFromStorage());
    };

    contract.addProgramType = function(programTypeName, exercises, weeks){
      var programType = generateProgramType(programTypeName, exercises, weeks);
      contract.programTypes.push(programType);
      // contract.programTypes.push(generateProgramType(programTypeName, exercises, weeks));
      storeProgramTypes();
    };

    contract.removeProgramType = function(programType){
      var tempProgramTypes = angular.copy(contract.programTypes);
      toastService.showUndoToast('Program type removed', function(){
        contract.programTypes = tempProgramTypes;  
      });

      contract.programTypes = utilService.removeFromArray(contract.programTypes, programType);
      storeProgramTypes();
    };

    contract.getProgramTypes = function(){
      return contract.programTypes;
    };

    contract.nameTaken = function(programTypeName){
      for(var i = 0; i < contract.programTypes.length; i++){
        if(utilService.isDefined(contract.programTypes[i].programTypeName) && contract.programTypes[i].programTypeName === programTypeName){
          return true;
        }
      }
      return false;
    };

    contract.getProgramType = function(id){
      return contract.programTypes.find(function(programType){
        if(programType.id === parseInt(id)){
          return programType;
        }
      });
    };

    contract.containsProgramType = function(programTypes, programType){
      return (programTypes.findIndex(function(pType){
        return pType.id === programType.id;
      }) !== -1);
    };

    contract.validProgramType = function(programType){
      return (utilService.isDefined(programType) && utilService.isDefined(programType.id) && 
      utilService.isDefined(programType.totalNumberOfSets) && utilService.isDefined(programType.programTypeName) && 
      utilService.isDefined(programType.exercises) && utilService.isDefined(programType.weeks));
    };

    var storeProgramTypes = function(){
      storageService.storeValue(keyHandlerService.keys.programType, getNonDefaultProgramTypes(contract.programTypes));
    };

    var getNonDefaultProgramTypes = function(programTypes){
      return programTypes.filter(function(programType){
        return (utilService.isUndefined(programType.default) || programType.default === false);
      });
    };

    var getProgramTypesFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.programType, []);
    };

    var generateProgramType = function(programTypeName, exercises, weeks){
      return {
        id: utilService.getUniqueId(contract.programTypes),
        totalNumberOfSets: calculateNumberOfSets(weeks),
        programTypeName: programTypeName,
        exercises: exercises,
        weeks: weeks,
        default: false
      };
    };

    var calculateNumberOfSets = function(weeks){
      var totalSets = 0;

      weeks.forEach(function(week){
        week.days.forEach(function(day){
          day.sets.forEach(function(set){
            if(utilService.isDefined(set.numberOfSets) && utilService.isNumber(set.numberOfSets)){
              totalSets += set.numberOfSets;
            }
          });
        });
      });

      return totalSets;
    };

    init();
    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeName
 * @description
 * # addProgramTypeName
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeName', ['addProgramTypeNameService', function (addProgramTypeNameService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeNameView.html',
      restrict: 'E',
      scope: {
        programTypeName: '='
      },
      link: function postLink(scope) {
        scope.helpAddProgramTypeUrl = addProgramTypeNameService.helpAddProgramTypeUrl;

        scope.$watch(function(){
          return scope.programTypeName;
        }, function(newValue, oldValue){
          if(newValue !== oldValue && scope.programTypeName === ''){
            scope.programTypeDetailsForm.$setUntouched();
          }
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.exerciseTypeService
 * @description
 * # exerciseTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('exerciseTypeService', ['utilService', function (utilService) {
    
    var contract = {};
    
    var exerciseTypes = [
      { id: 0, name: 'Weighted' },
      { id: 1, name: 'Non-weighted' },
      { id: 2, name: 'Cardio' }
    ];

    contract.getExerciseTypes = function(){
      return exerciseTypes;
    };

    contract.getExerciseTypeById = function(id){
      if(utilService.isNumber(id)){
        var fId = utilService.getNumber(id);
        return exerciseTypes.find(function(exerciseType){
          return exerciseType.id === fId;
        });
      }
    };

    contract.getExerciseTypeByName = function(name){
      return exerciseTypes.find(function(exerciseType){
        return exerciseType.name.toLowerCase() === name.toString().toLowerCase();
      });
    };

    contract.exercisesSame = function(exerciseOne, exerciseTwo){
      return (exerciseOne.id === exerciseTwo.id && exerciseOne.name === exerciseTwo.name && exerciseOne.exerciseType.id === exerciseTwo.exerciseType.id);
    };

    contract.containsExercise = function(exercises, exercise){
      for(var i = 0; i < exercises.length; i++){
        if(exercises[i].id === exercise.id){
          return true;
        }
      }
      return false;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.utilService
 * @description
 * # utilService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('utilService', function () {
      var contract = {};

      contract.isDefined = function(value){
        return (angular.isDefined(value) && value !== null);
      };

      contract.isUndefined = function(value){
        return !contract.isDefined(value);
      };

      contract.isNumber = function(value){
        // Ensure our value is defined
        if(contract.isUndefined(value)){
          return false;
        }
        return !isNaN(value);
      };

      contract.getNumber = function(value){
        if(!contract.isNumber(value)){
          return -1;
        }
        return parseFloat(value);
      };

      contract.getUniqueId = function(values){
        var id = 0;
        values.map(function(value){
          // Check if the value is >= to the current highest id
          if(value.hasOwnProperty('id') && value.id >= id){
            id = (value.id + 1);
          }
        });
        return id;
      };

      contract.removeFromArray = function(array, value){
        // Find index
        var index = array.indexOf(value);

        if(index !== -1){
          array.splice(index, 1);
        }
        return array;
      };

      contract.round = function(number, dp, increments){
        return (Math.round(((contract.getNumber(number)) / contract.getNumber(increments))) * contract.getNumber(increments)).toFixed(contract.getNumber(dp));
      };

      return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeExercise
 * @description
 * # addProgramTypeExercise
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeExercise', ['addProgramTypeExerciseService', 'exerciseTypeService', function (addProgramTypeExerciseService, exerciseTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeExerciseView.html',
      restrict: 'E',
      scope: {
        programTypeExercises: '='
      },
      link: function postLink(scope) {

        scope.helpAddProgramTypeExerciseTypeUrl = addProgramTypeExerciseService.helpAddProgramTypeExerciseTypeUrl;

        scope.exerciseTypes = exerciseTypeService.getExerciseTypes();

        scope.$watchCollection(function(){
          return addProgramTypeExerciseService.exercises;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeExercises = addProgramTypeExerciseService.exercises;
          }
        });

        scope.addExercise = function(){
          scope.programTypeExercises = addProgramTypeExerciseService.addExercise(scope.programTypeExercises);
        };

        scope.confirmExercise = function(exercise){
          exercise.confirmed = true;
        };

        scope.removeExercise = function(exercise){
          scope.programTypeExercises = addProgramTypeExerciseService.removeExercise(scope.programTypeExercises, exercise);
        };

        scope.editExercise = function(exercise){
          exercise.confirmed = false;
        };

        scope.isInvalid = function(exercise){
          return addProgramTypeExerciseService.isInvalid(scope.programTypeExercises, exercise);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeExerciseService.hasConfirmed(scope.programTypeExercises);
        };

      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeNameService
 * @description
 * # addProgramTypeNameService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeNameService', [function () {
    var contract = {
      helpAddProgramTypeUrl: 'scripts/directives/addProgramType/helpAddProgramTypeTemplate.html'
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeExerciseService
 * @description
 * # addProgramTypeExerciseService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeExerciseService', ['utilService', 'toastService', 'addProgramTypeService', function (utilService, toastService, addProgramTypeService) {
    
    var contract = {
      helpAddProgramTypeExerciseTypeUrl: 'scripts/directives/addProgramType/helpAddProgramTypeExerciseTypeTemplate.html',
      exercises: []
    };

    contract.addExercise = function(exercisesArray){
      exercisesArray.push(generateExercise(utilService.getUniqueId(exercisesArray)));
      return exercisesArray;
    };

    contract.removeExercise = function(exercisesArray, exercise){
      var tempExercisesArray = angular.copy(exercisesArray);
      toastService.showUndoToast('Exercise removed', function(){
        contract.exercises = tempExercisesArray;
        addProgramTypeService.exerciseRemoveUndone();
      });

      return utilService.removeFromArray(exercisesArray, exercise);
    };

    contract.isInvalid = function(exerciseArray, exercise){
      // Check that the name is not already taken
      // Check that an exercise type is selected
      return (exerciseTypeInvalid(exercise) || exerciseNameInvalid(exerciseArray, exercise));
    };

    contract.hasConfirmed = function(exerciseArray){
      for(var i = 0; i < exerciseArray.length; i++){
        if(exerciseArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    var exerciseTypeInvalid = function(exercise){
      return (utilService.isUndefined(exercise.exerciseType) || exercise.exerciseType === {} || 
        !exercise.exerciseType.hasOwnProperty('id') || !exercise.exerciseType.hasOwnProperty('name'));
    };

    var exerciseNameInvalid = function(exerciseArray, exercise){
      if(utilService.isUndefined(exercise.name) || exercise.name === ''){
        return true;
      }

      for(var i = 0; i < exerciseArray.length; i++){
        if(exercise.name === exerciseArray[i].name && exercise.id !== exerciseArray[i].id){
          return true;
        }
      }

      return false;
    };

    var generateExercise = function(id){
      return {
        id: id,
        name: '',
        exerciseType: {},
        description: '',
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addRemove
 * @description
 * # addRemove
 */
angular.module('powerHouseApp')
  .directive('addRemove', function () {
    return {
      templateUrl: 'scripts/directives/addRemove/addRemoveView.html',
      restrict: 'E',
      scope: {
        addFunction: '&',
        removeFunction: '&',
        invalidFunction: '&',
        name: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeWeek
 * @description
 * # addProgramTypeWeek
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeWeek', ['addProgramTypeWeekService', function (addProgramTypeWeekService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeWeekView.html',
      restrict: 'E',
      scope: {
        programTypeWeeks: '=',
      },
      link: function postLink(scope) {

        scope.$watchCollection(function(){
          return addProgramTypeWeekService.weeks;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeWeeks = addProgramTypeWeekService.weeks;
          }
        });

        scope.addWeek = function(){
          scope.programTypeWeeks = addProgramTypeWeekService.addWeek(scope.programTypeWeeks);
        };

        scope.editWeek = function(week){
          week.confirmed = false;
        };

        scope.confirmWeek = function(week){
          week.confirmed = true;
        };

        scope.removeWeek = function(week){
          scope.programTypeWeeks = addProgramTypeWeekService.removeWeek(scope.programTypeWeeks, week);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeWeekService.hasConfirmed(scope.programTypeWeeks);
        };

        scope.isInvalid = function(week){
          return addProgramTypeWeekService.isInvalid(scope.programTypeWeeks, week);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeWeekService
 * @description
 * # addProgramTypeWeekService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeWeekService', ['utilService', 'toastService', function (utilService, toastService) {
    var contract = {
      weeks: []
    };

    contract.addWeek = function(weekArray){
      weekArray.push(generateWeek(utilService.getUniqueId(weekArray)));
      return weekArray;
    };

    contract.removeWeek = function(weeksArray, week){
      var tempWeeksArray = angular.copy(weeksArray);
      toastService.showUndoToast('Week removed', function(){
        contract.weeks = tempWeeksArray;
      });

      return utilService.removeFromArray(weeksArray, week);
    };

    contract.isInvalid = function(weekArray, week){
      return (isNameInvalid(weekArray, week) || isDaysInvalid(week));
    };

    contract.hasConfirmed = function(weeksArray){
      for(var i = 0; i < weeksArray.length; i++){
        if(weeksArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    var isNameInvalid = function(weekArray, week){
      return (utilService.isUndefined(week.name) || week.name === '' || isNameTaken(weekArray, week));
    };

    var isNameTaken = function(weekArray, week){
      for(var i = 0; i < weekArray.length; i++){
        if(weekArray[i].name === week.name && weekArray[i].id !== week.id){
          return true;
        }
      }
      return false;
    };

    var isDaysInvalid = function(week){
      return (utilService.isUndefined(week.days) || week.days.length <= 0 || week.days.length > 7);
    };

    var generateWeek = function(id){
      return {
        id: id, 
        name: '',
        days: [],
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeDay
 * @description
 * # addProgramTypeDay
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeDay', ['addProgramTypeDayService', function (addProgramTypeDayService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeDayView.html',
      restrict: 'E',
      scope: {
        programTypeDays: '='
      },
      link: function postLink(scope) {
        
        scope.$watchCollection(function(){
          return addProgramTypeDayService.days;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeDays = addProgramTypeDayService.days;
          }
        });
        
        scope.addDay = function(){
          scope.programTypeDays = addProgramTypeDayService.addDay(scope.programTypeDays);
        };

        scope.editDay = function(day){
          day.confirmed = false;
        };

        scope.confirmDay = function(day){
          day.confirmed = true;
        };

        scope.removeDay = function(day){
          scope.programTypeDays = addProgramTypeDayService.removeDay(scope.programTypeDays, day);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeDayService.hasConfirmed(scope.programTypeDays);
        };

        scope.isInvalid = function(day){
          return addProgramTypeDayService.isInvalid(scope.programTypeDays, day);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeDayService
 * @description
 * # addProgramTypeDayService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeDayService', ['utilService', 'toastService', function (utilService, toastService) {
    var contract = {
      days: []
    };

    contract.addDay = function(dayArray){
      dayArray.push(generateDay(utilService.getUniqueId(dayArray)));
      return dayArray;
    };

    contract.removeDay = function(daysArray, day){
      var tempDaysArray = angular.copy(daysArray);
      toastService.showUndoToast('Day removed', function(){
        contract.days = tempDaysArray;
      });

      return utilService.removeFromArray(daysArray, day);
    };

    contract.isInvalid = function(dayArray, day){
      return (isNameInvalid(dayArray, day) || isSetInvalid(day));
    };

    contract.hasConfirmed = function(dayArray){
      for(var i = 0; i < dayArray.length; i++){
        if(dayArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    var isNameInvalid = function(dayArray, day){
      // Check if name is not empty
      return (utilService.isUndefined(day.name) || day.name === '' || nameTaken(dayArray, day));
    };

    var nameTaken = function(dayArray, day){
      for(var i = 0; i < dayArray.length; i++){
        if(dayArray[i].name === day.name && dayArray[i].id !== day.id){
          return true;
        }
      }
      return false;
    };

    var isSetInvalid = function(day){
      return (utilService.isUndefined(day.sets) || day.sets.length <= 0);
    };

    var generateDay = function(id){
      return {
        id: id,
        name: '',
        sets: [],
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSet
 * @description
 * # addProgramTypeSet
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSet', ['addProgramTypeSetService', 'addProgramTypeService', function (addProgramTypeSetService, addProgramTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeSetView.html',
      restrict: 'E',
      scope: {
        programTypeSets: '=',
      },
      link: function postLink(scope) {

        scope.helpAddProgramTypeIncrementUrl = addProgramTypeSetService.helpAddProgramTypeIncrementUrl;
        scope.helpAddProgramTypeOneRepMaxUrl = addProgramTypeSetService.helpAddProgramTypeOneRepMaxUrl;

        scope.exercises = addProgramTypeService.exercises;

        scope.$watchCollection(function(){
          return addProgramTypeSetService.sets;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeSets = addProgramTypeSetService.sets;
          }
        });

        scope.addSet = function(){
          scope.programTypeSets = addProgramTypeSetService.addSet(scope.programTypeSets);
        };

        scope.editSet = function(set){
          set.confirmed = false;
        };

        scope.confirmSet = function(set){
          set.confirmed = true;
          // Add the duration if needed
          if(set.exercise.exerciseType.id === 2){
            scope.programTypeSets = addProgramTypeSetService.formatCardio(scope.programTypeSets, set);        
          }
        };

        scope.removeSet = function(set){
          scope.programTypeSets = addProgramTypeSetService.removeSet(scope.programTypeSets, set);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeSetService.hasConfirmed(scope.programTypeSets);
        };

        scope.isInvalid = function(set){
          return addProgramTypeSetService.isInvalid(scope.programTypeSets, set);
        };

        scope.formatTime = function(minutes, seconds){
          addProgramTypeSetService.formatTime(minutes, seconds);
        };

        scope.removeNonComplete = function(exercise){
          return addProgramTypeSetService.removeNonComplete(exercise);
        };
      }
    };
  }]);
'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeSetService
 * @description
 * # addProgramTypeSetService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeSetService', ['utilService', 'toastService', function (utilService, toastService) {
    var contract = {
      helpAddProgramTypeIncrementUrl: 'scripts/directives/addProgramType/helpAddProgramTypeIncrementTemplate.html',
      helpAddProgramTypeOneRepMaxUrl: 'scripts/directives/addProgramType/helpAddProgramTypeOneRepMaxTemplate.html',
      sets: []
    };

    contract.addSet = function(setArray){
      setArray.push(generateSet(utilService.getUniqueId(setArray)));
      return setArray;
    };

    contract.removeSet = function(setsArray, set){
      var tempSetsArray = angular.copy(setsArray);
      toastService.showUndoToast('Set removed', function(){
        contract.sets = tempSetsArray;
      });

      return utilService.removeFromArray(setsArray, set);
    };

    contract.isInvalid = function(setArray, set){
      // Check that an exercise is selected
      var exerciseInvalid = isExerciseInvalid(set.exercise);
      if(exerciseInvalid){
        return true;
      }

      var exerciseTypes = {
        0: function(set){
          return !(set.hasOwnProperty('numberOfSets') && set.hasOwnProperty('numberOfReps') && set.hasOwnProperty('oneRepMaxPercent') &&
            set.hasOwnProperty('incrementMultiplier')) || !(utilService.isDefined(set.numberOfSets) && set.numberOfSets > 0 && set.numberOfSets % 1 === 0 && utilService.isDefined(set.numberOfReps) && 
            set.numberOfReps > 0 && set.numberOfReps % 1 === 0 && utilService.isDefined(set.oneRepMaxPercent) && set.oneRepMaxPercent >= 0 && set.oneRepMaxPercent <= 100 && 
            utilService.isDefined(set.incrementMultiplier));
        },
        1: function(set){
          return !(set.hasOwnProperty('numberOfSets') && set.hasOwnProperty('numberOfReps')) || 
            !(utilService.isDefined(set.numberOfSets) && set.numberOfSets > 0 && set.numberOfSets % 1 === 0 && utilService.isDefined(set.numberOfReps) && set.numberOfReps > 0 && set.numberOfReps % 1 === 0);
        },
        2: function(set){
          return !(set.hasOwnProperty('minutes') && set.hasOwnProperty('seconds')) || !(set.minutes >= 0 && set.seconds >= 0 && set.seconds < 60);
        }
      };

      return exerciseTypes[set.exercise.exerciseType.id](set);
    };

    contract.hasConfirmed = function(setArray){
      for(var i = 0; i < setArray.length; i++){
        if(setArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    contract.formatCardio = function(programTypeSets, set){
      var fProgramTypeSets = programTypeSets;

      fProgramTypeSets = addDuration(programTypeSets, set);
      fProgramTypeSets = addRepsAndSets(programTypeSets, set);

      return fProgramTypeSets;
    };

    contract.formatTime = function(minutes, seconds){
      var rString = '';
      rString += minutes;
      rString += ':';

      if(seconds < 10){
        rString += '0' + seconds;
      }
      else if(seconds !== undefined){
        rString += seconds;
      }
      else{
        rString += '00';
      }

      return rString;
    };

    contract.removeNonComplete = function(exercise){
      return exercise.confirmed;
    };

    var addDuration = function(programTypeSets, set){
      var updatedArray = programTypeSets;
      // Find the index
      var index = programTypeSets.indexOf(set);
      if(index !== -1){
         var updatedSet = set;
         updatedSet.duration = contract.formatTime(set.minutes, set.seconds);
         updatedArray[index] = updatedSet;
      }
      return updatedArray;
    };

    var addRepsAndSets = function(programTypeSets, set){
      var updatedArray = programTypeSets;
      // Find the index
      var index = programTypeSets.indexOf(set);
      if(index !== -1){
         var updatedSet = set;

         updatedSet.numberOfSets = 1;
         updatedSet.numberOfReps = 1;

         updatedArray[index] = updatedSet;
      }
      return updatedArray;
    };

    var isExerciseInvalid = function(exercise){
      return !(utilService.isDefined(exercise) && utilService.isDefined(exercise.exerciseType) && 
      exercise.exerciseType.hasOwnProperty('id') && exercise.exerciseType.hasOwnProperty('name'));
    };

    var generateSet = function(id){
      return {
        id: id,
        exercise: {},
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeService
 * @description
 * # addProgramTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeService', ['utilService', 'programTypeService', 'exerciseTypeService', function (utilService, programTypeService, exerciseTypeService) {
    
    var contract = {
      exercises: [],
      weeks: [],
      previousWeeks: []
    };
    
    contract.addProgramType = function(programTypeName, exercises, weeks){
      programTypeService.addProgramType(programTypeName, exercises, weeks);
    } ;

    contract.isInvalid = function(programName, exercises, weeks){
      return (isNameInvalid(programName) || isExerciseInvalid(exercises) || isWeeksInvalid(weeks));
    };

    contract.exerciseRemoved = function(exercises, weeks){
      var rWeeks = weeks;
      contract.previousWeeks = angular.copy(weeks);

      weeks.forEach(function(week){
        week.days.forEach(function(day){
          for(var i = 0; i < day.sets.length; i++){
            var set = day.sets[i];
            if(exerciseTypeService.containsExercise(exercises, set.exercise) === false){
              day.sets = utilService.removeFromArray(day.sets, set);
            }
          }
        });
      });

      return rWeeks;
    };

    contract.exerciseRemoveUndone = function(){
      contract.weeks = contract.previousWeeks;
    };

    var isNameInvalid = function(programName){
      return (utilService.isUndefined(programName) || programName === '' || programTypeService.nameTaken(programName));
    };

    var isExerciseInvalid = function(exercises){
      return (utilService.isUndefined(exercises) || exercises.length <= 0);
    };

    var isWeeksInvalid = function(weeks){
      return (utilService.isUndefined(weeks) || weeks.length <= 0);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.storageService
 * @description
 * # storageService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('storageService', ['utilService', 'localStorageService', function (utilService, localStorageService) {
    var contract = {};

    contract.storeValue = function(key, value){
      localStorageService.set(key, value);
    };

    contract.getValue = function(key){
      return localStorageService.get(key);
    };

    contract.getValueOrDefault = function(key, dValue){
      var value = localStorageService.get(key);
      if(utilService.isDefined(value)){
        return value;
      }
      return dValue;    
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.keyHandlerService
 * @description
 * # keyHandlerService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('keyHandlerService', function () {
    var contract = {};

    contract.keys = {
      programType: 'PROGRAM_TYPE',
      program: 'PROGRAM',
      recentlyActive: 'RECENTLY_ACTIVE',
      unit: 'WEIGHT_UNIT'
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:viewProgramType
 * @description
 * # viewProgramType
 */
angular.module('powerHouseApp')
  .directive('programTypeList', ['$location', 'programTypeListService', 'programTypeService', function ($location, programTypeListService, programTypeService) {
    return {
      templateUrl: 'scripts/directives/programTypeList/ProgramTypeListView.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.programTypes = programTypeListService.formatProgramTypes(programTypeService.getProgramTypes());
        scope.emptyMessage = programTypeListService.emptyMessage;
        scope.emptyLink = programTypeListService.emptyLink;
        scope.emptyButtonText = programTypeListService.emptyButtonText;

        scope.editFunction = function(programType){
          $location.path('edit-program-type/' + programType.id);
        };

        scope.removeFunction = function(programType){
          programTypeService.removeProgramType(programType.programType);
        };

        scope.$watchCollection(function(){
          return programTypeService.getProgramTypes();
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypes = programTypeListService.formatProgramTypes(programTypeService.getProgramTypes());
          }
        });

      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:list
 * @description
 * # list
 */
angular.module('powerHouseApp')
  .directive('list', function () {
    return {
      templateUrl: 'scripts/directives/list/listView.html',
      restrict: 'E',
      scope: {
        editFunction: '=',
        removeFunction: '=',
        values: '=',
        emptyMessage: '=',
        emptyLink: '=',
        emptyButtonText: '=',
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeListService
 * @description
 * # programTypeListService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeListService', [function () {
    var contract = {
      emptyMessage: 'Start by adding a program type.',
      emptyLink: 'add-program-type',
      emptyButtonText: 'Add Program Type'
    };

    contract.formatProgramTypes = function(programTypes){
      return programTypes.map(function(programType){
        return formatProgramType(programType);
      });
    };

    var formatProgramType = function(programType){
        return {
          programType: programType,
          id: programType.id,
          text: programType.programTypeName,
          secondText: 'Total Weeks: ' + programType.weeks.length,
          thirdText: 'Total Sets: ' + programType.totalNumberOfSets,
          href: '#/program-type-information/' + programType.id,
          removable: !programType.default
        };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ProgramtypeinformationCtrl
 * @description
 * # ProgramtypeinformationCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ProgramTypeInformationCtrl', ['$scope', '$routeParams', '$location', 'programTypeInformationService', 'programTypeService', function ($scope, $routeParams, $location, programTypeInformationService, programTypeService) {

    $scope.programType = programTypeService.getProgramType($routeParams.id);

    $scope.editFunction = function(programType){
      $location.path('edit-program-type/' + programType.id);
    };

    $scope.removeFunction = function(programType){
      programTypeService.removeProgramType(programType);
      $location.path('program-type-list');
    };
    
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:PrograminformationCtrl
 * @description
 * # PrograminformationCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ProgramInformationCtrl', ['$scope', '$routeParams', 'programService', '$location', 'unitService', function ($scope, $routeParams, programService, $location, unitService) {
    $scope.program = programService.getProgram($routeParams.id);

    $scope.unit = unitService.getCurrentUnit();

    $scope.editFunction = function(program){
      $location.path('edit-program/' + program.id);
    };

    $scope.removeFunction = function(program){
      programService.removeProgram(program);
      $location.path('program-list');
    };

    $scope.calculatePercentageComplete = function(){
      $scope.program = programService.updateProgramComplete($scope.program);
    };

  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeInformationService
 * @description
 * # programTypeInformationService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeInformationService', function () {
    var contract = {};

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgram
 * @description
 * # addProgram
 */
angular.module('powerHouseApp')
  .directive('addProgram', [function () {
    return {
      templateUrl: 'scripts/directives/addProgram/addProgramView.html',
      restrict: 'E',
      scope: {
        programName: '=',
        programType: '=',
        increment: '=',
        exercises: '=',
        addFunction: '=',
        removeFunction: '=',
        invalidFunction: '='
      },
      link: function postLink() {

      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:programList
 * @description
 * # programList
 */
angular.module('powerHouseApp')
  .directive('programList', ['$location', 'programListService', 'programService', function ($location, programListService, programService) {
    return {
      templateUrl: 'scripts/directives/programList/programListView.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.programs = programListService.formatPrograms(programService.getPrograms());
        scope.emptyMessage = programListService.emptyMessage;
        scope.emptyLink = programListService.emptyLink;
        scope.emptyButtonText = programListService.emptyButtonText;

        scope.editFunction = function(program){
          $location.path('edit-program/' + program.id);
        };

        scope.removeFunction = function(program){
          programService.removeProgram(program.program);
        };

        scope.$watchCollection(function(){
          return programService.getPrograms();
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programs = programListService.formatPrograms(programService.getPrograms());
          }
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramHeader
 * @description
 * # addProgramHeader
 */
angular.module('powerHouseApp')
  .directive('addProgramHeader', ['addProgramHeaderService', 'unitService', function (addProgramHeaderService, unitService) {
    return {
      templateUrl: 'scripts/directives/addProgram/addProgramHeaderView.html',
      restrict: 'E',
      scope: {
        programName: '=',
        programType: '=',
        increment: '='
      },
      link: function postLink(scope) {
        scope.programTypes = addProgramHeaderService.getProgramTypes(scope.programType);
        scope.unit = unitService.getCurrentUnit();

        scope.helpAddProgramUrl = addProgramHeaderService.helpAddProgramUrl;
        scope.helpAddProgramProgramIncrementUrl = addProgramHeaderService.helpAddProgramProgramIncrementUrl;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramHeaderService
 * @description
 * # addProgramHeaderService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramHeaderService', ['addProgramService', 'programTypeService', function (addProgramService, programTypeService) {
    var contract = {
      helpAddProgramUrl: 'scripts/directives/addProgram/helpAddProgramTemplate.html',
      helpAddProgramProgramIncrementUrl: 'scripts/directives/addProgram/helpAddProgramProgramIncrementTemplate.html'
    };

    contract.getProgramTypes = function(programType){
      var programTypes = angular.copy(programTypeService.getProgramTypes());
      if(programTypeService.validProgramType(programType) && programTypeService.containsProgramType(programTypes, programType) === false){
        programTypes.push(programType);
      }
      return programTypes;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramExerciseService
 * @description
 * # addProgramExerciseService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramExerciseService', function () {
    var contract = {
      helpAddProgramOneRepMaxUrl: 'scripts/directives/addProgram/helpAddProgramOneRepMaxTemplate.html'
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramExercise
 * @description
 * # addProgramExercise
 */
angular.module('powerHouseApp')
  .directive('addProgramExercise', ['addProgramExerciseService', function (addProgramExerciseService) {
    return {
      templateUrl: 'scripts/directives/addProgram/addProgramExerciseView.html',
      restrict: 'E',
      scope: {
        exercises: '='
      },
      link: function postLink(scope) {
        scope.helpAddProgramOneRepMaxUrl = addProgramExerciseService.helpAddProgramOneRepMaxUrl;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programService
 * @description
 * # programService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programService', ['utilService', 'storageService', 'keyHandlerService', 'toastService', 'recentlyActiveService', 'unitService', 'programConversionService', 
    function (utilService, storageService, keyHandlerService, toastService, recentlyActiveService, unitService, programConversionService) {
    var contract = {
      programs: [],
    };

    var init = function(){
      contract.programs = getProgramsFromStorage();
      contract.convertPrograms();
      if(recentlyActiveService.currentlyActive() === false){
        recentlyActiveService.updateRecentlyActive(recentlyActiveService.nextActive(contract.getActivePrograms()));
      }
    };

    contract.convertPrograms = function(){
      contract.programs = programConversionService.convertPrograms(contract.programs);
      storePrograms();
    };

    contract.addProgram = function(programName, programType, increment, exercises){
      var program = generateProgram(utilService.getUniqueId(contract.programs), programName, programType, increment, exercises);
      contract.programs.push(program);
      contract.convertPrograms();
      recentlyActiveService.updateRecentlyActive(program);
      storePrograms();
    };

    contract.editProgram = function(oldProgram, id, programName, programType, increment, exercises){
      removeProgramWithoutToast(oldProgram);
      var program = mapProgramCompletion(oldProgram, generateProgram(id, programName, programType, increment, exercises));
      contract.programs.push(program);
      contract.updateProgramComplete(program);
      recentlyActiveService.updateRecentlyActive(program);
      storePrograms();
    };

    contract.removeProgram = function(program){
      var tempPrograms = angular.copy(contract.programs);

      toastService.showUndoToast('Program removed', function(){        
        contract.programs = tempPrograms;
        recentlyActiveService.undoRemove();
        storePrograms();
      });

      recentlyActiveService.removeProgram(program);
      removeProgram(program);
    };

    contract.getPrograms = function(){
      return contract.programs;
    };

    contract.getProgram = function(id){
      var index = findProgramIndex({id: id});
      return contract.programs[index];
    };

    contract.nameTaken = function(programName){
      for(var i = 0; i < contract.programs.length; i++){
        if(utilService.isDefined(contract.programs[i].name) && contract.programs[i].name === programName){
          return true;
        }
      }
      return false;
    };

    contract.updateProgram = function(program){
      var index = findProgramIndex(program);
      contract.programs[index] = program;

      if(program.complete === false){
        recentlyActiveService.updateRecentlyActive(program);
      }
      else {
        recentlyActiveService.updateRecentlyActive(recentlyActiveService.nextActive(contract.getActivePrograms()));
      }

      storePrograms();
      return program;
    };

    contract.updateProgramComplete = function(program){
      var updatedProgram = program;

      var completedSets = 0;

      updatedProgram.weeks.forEach(function(week){
        week.days.forEach(function(day){
          day.sets.forEach(function(set){
            if(set.complete === true){
              completedSets += set.numberOfSets;
            }
          });
        });
      });

      updatedProgram.percentComplete = calculatePercentage(program.programType.totalNumberOfSets, completedSets);
      updatedProgram.complete = completeProgram(program.programType.totalNumberOfSets, completedSets);

      return contract.updateProgram(updatedProgram);
    };
    
    contract.getCompletedPrograms = function(){
      return contract.programs.filter(function(program){
        return program.complete === true;
      });
    };

    contract.getActivePrograms = function(){
      return contract.programs.filter(function(program){
        return (program.complete === false || utilService.isUndefined(program.complete));
      });
    };
    
    var completeProgram = function(totalSets, completedSets){
      return (totalSets === completedSets);
    };

    var removeProgram = function(program){
      contract.programs = utilService.removeFromArray(contract.programs, program);
      storePrograms();
    };

    var removeProgramWithoutToast = function(program){
      removeProgram(program);
    };

    var mapProgramCompletion = function(oldProgram, newProgram){
      var program = newProgram;

      if(program.programType.id === oldProgram.programType.id){
        oldProgram.weeks.forEach(function(week, wIndex){
          week.days.forEach(function(day, dIndex){
            day.sets.forEach(function(set, sIndex){
              if(set.complete === true){
                program.weeks[wIndex].days[dIndex].sets[sIndex].complete = true;
              }
            });
          });
        });
      }

      return program;
    };

    var calculatePercentage = function(total, complete){
      return ((complete / total) * 100);
    };

    var findProgramIndex = function(program){
      return contract.programs.findIndex(function(p){
        return utilService.getNumber(program.id) === utilService.getNumber(p.id);
      });
    };

    var generateProgram = function(id, programName, programType, increment, exercises){
      return {
        id: id,
        unit: unitService.getCurrentUnit().name,
        name: programName,
        weeks: generateWeeks(programType, increment, exercises),
        percentComplete: 0,
        programType: programType,
        increment: increment,
        exercises: exercises,
        default: false,
        complete: false
      };
    };

    var generateWeeks = function(programType, increment, exercises){
      return programType.weeks.map(function(week){
        return {
          id: week.id,
          name: week.name,
          days: generateDays(week, increment, exercises)
        };
      });
    };

    var generateDays = function(week, increment, exercises){
      return week.days.map(function(day){
        return {
          id: day.id,
          name: day.name,
          sets: generateSets(day, increment, exercises)
        };
      });
    };

    var generateSets = function(day, increment, exercises){
      return day.sets.map(function(set){
        if(set.exercise.exerciseType.id === 0){
          set.weight = generateWeight((set.oneRepMaxPercent * 0.01), set.incrementMultiplier, increment, set.exercise.id, exercises);
        }
        set.complete = false;
        return set;
      });
    };

    var generateWeight = function(oneRepMaxPercent, incrementMultiplier, increment, exerciseId, exercises){
      // (ORMP * exerciseORM) + increment
      return utilService.round((oneRepMaxPercent * findOneRepMax(exerciseId, exercises)) + (utilService.getNumber(increment) * incrementMultiplier), 1, 2.5);
    };

    var findOneRepMax = function(exerciseId, exercises){
      for(var i = 0; i < exercises.length; i++){
        if(exercises[i].id === exerciseId){
          return utilService.getNumber(exercises[i].oneRepMax);
        }
      }
      return -1;
    };

    var getProgramsFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.program, []);
    };

    var storePrograms = function(){
      storageService.storeValue(keyHandlerService.keys.program, contract.programs);
    };

    init();
    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programListService
 * @description
 * # programListService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programListService', ['unitService', function (unitService) {
    var contract = {
      emptyMessage: 'Start by adding a program.',
      emptyLink: 'add-program',
      emptyButtonText: 'Add Program'
    };

    contract.formatPrograms = function(programs){
      return programs.map(function(program){
        return formatProgram(program);
      });
    };

    var formatProgram = function(program){
      return {
        program: program,
        id: program.id,
        text: program.name,
        secondText: 'Total Weeks: ' + program.weeks.length,
        thirdText: 'Increment: ' + program.increment + unitService.getCurrentUnit().textName,
        percentage: program.percentComplete,
        href: '#/program-information/' + program.id,
        removable: !program.default
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programInformationService
 * @description
 * # programInformationService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programInformationService', function () {
    var contract = {};

    return contract;
  });

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:EditprogramCtrl
 * @description
 * # EditprogramCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('EditProgramCtrl', ['$scope', '$routeParams', '$location', 'programService', 'addProgramService', 'utilService', function ($scope, $routeParams, $location, programService, addProgramService, utilService) {

    $scope.program = programService.getProgram($routeParams.id);

    $scope.programName = angular.copy($scope.program.name);
    $scope.programType = angular.copy($scope.program.programType);
    $scope.increment = angular.copy(utilService.getNumber($scope.program.increment));
    $scope.exercises = angular.copy(addProgramService.getExercisesWithORM($scope.programType, $scope.program));

    $scope.addFunction = function(programName, programType, increment, exercises){
      addProgramService.editProgram($scope.program, $scope.program.id, programName, programType, increment, exercises);
      $location.path('program-list');
    };

    $scope.removeFunction = function(){
      $location.path('program-information/'+ $scope.program.id);
    };

    $scope.invalidFunction = function(programName, programType, increment, exercises){
      return addProgramService.invalidAllowDuplicateNames(programName, programType, increment, exercises);
    };

    $scope.$watch(function(){
      return $scope.programType;
    },
    function(newValue, oldValue){
      if(newValue !== oldValue && newValue !== ''){
        $scope.exercises = addProgramService.getExercisesWithORM($scope.programType, $scope.program);
      }
    });

  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramService
 * @description
 * # addProgramService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramService', ['utilService', 'programService', 'exerciseTypeService', 'unitService', function (utilService, programService, exerciseTypeService, unitService) {
    var contract = {};

    contract.addProgram = function(programName, programType, increment, exercises){
      programService.addProgram(programName, programType, increment, formatExercises(programType.exercises, exercises));
    };

    contract.editProgram = function(program, id, programName, programType, increment, exercises){
      programService.editProgram(program, id, programName, programType, increment, formatExercises(programType.exercises, exercises));
    };

    contract.invalid = function(programName, programType, increment, exercises){
      return (programNameInvalid(programName) || programNameDuplicateInvalid(programName) || 
      programTypeInvalid(programType) || programIncrementInvalid(increment) || programExercisesInvalid(exercises));
    };

    contract.invalidAllowDuplicateNames = function(programName, programType, increment, exercises){
      return (programNameInvalid(programName) || programTypeInvalid(programType) || 
      programIncrementInvalid(increment) || programExercisesInvalid(exercises));
    };

    contract.getExercises = function(programType){
      // Return all the required one rep max exercises
      var rArray = [];

      programType.exercises.forEach(function(exercise){
        if(exercise.exerciseType.id === 0){
          rArray.push(exercise);
        }
      });

      return rArray;
    };

    contract.getExercisesWithORM = function(programType, program){
      var programTypeExercises = contract.getExercises(programType);
      var programExercises = contract.getExercises(program);

      for(var i = 0; i < programTypeExercises.length; i++){
        for(var y = 0; y < programExercises.length; y++){
          if(exerciseTypeService.exercisesSame(programTypeExercises[i], programExercises[y])){
            programTypeExercises[i].oneRepMax = programExercises[y].oneRepMax;
            break;
          }
        }        
      }

      return programTypeExercises;
    };

    var formatExercises = function(originalExercises, newExercises){
      var fExercises = originalExercises;

      var findIndex = function(array, id){
        return array.findIndex(function(value){
          return value.id === id;
        });
      };

      for(var i = 0; i < newExercises.length; i++){
        fExercises[findIndex(fExercises, newExercises[i].id)] = newExercises[i];
      }

      return fExercises; 
    };

    var programNameInvalid = function(programName){
      var invalid = false;

      if(programName === '' || utilService.isUndefined(programName)){
        invalid = true;
      }

      return invalid;
    };

    var programNameDuplicateInvalid = function(programName){
      var invalid = false;

      if(programService.nameTaken(programName)){
        invalid = true;
      }

      return invalid;
    };

    var programTypeInvalid = function(programType){
      var invalid = false;

      if(programType === '' || utilService.isUndefined(programType)){
        invalid = true;
      }

      return invalid;
    };

    var programIncrementInvalid = function(increment){
      var invalid = false;

      if(utilService.isNumber(increment) === false){
        invalid = true;
      }
      else if(increment < 0){
        invalid = true;
      }
      else if(increment !== 0 && increment % unitService.getCurrentUnit().interval !== 0){
        invalid = true;
      }

      return invalid;
    };

    var programExercisesInvalid = function(exercises){
      var invalid = false;

      if(exercises.length <= 0){
        invalid = true;
      }
      
      for(var i = 0; i < exercises.length; i++){
        var exercise = exercises[i];
        if(utilService.isUndefined(exercise.oneRepMax) || exercise.oneRepMax < 1){
          invalid = true;
          break;
        }
      }

      return invalid;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:EditprogramtypeCtrl
 * @description
 * # EditprogramtypeCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('EditProgramTypeCtrl', ['$scope', '$routeParams', '$location', 'programTypeService', 'addProgramTypeService', function ($scope, $routeParams, $location, programTypeService, addProgramTypeService) {
    $scope.programType = programTypeService.getProgramType($routeParams.id);

    $scope.programTypeName = angular.copy($scope.programType.programTypeName);
    $scope.exercises = angular.copy($scope.programType.exercises);
    $scope.weeks = angular.copy($scope.programType.weeks);

    $scope.addFunction = function(programTypeName, exercises, weeks){
      addProgramTypeService.addProgramType(programTypeName, exercises, weeks);
      $location.path('program-type-list');
    };

    $scope.removeFunction = function(){
      $location.path('program-type-information/'+ $scope.programType.id);
    };

    $scope.invalidFunction = function(programName, exercises, weeks){
      return addProgramTypeService.isInvalid(programName, exercises, weeks);
    };

    $scope.$watchCollection(function(){
      return $scope.exercises;
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        addProgramTypeService.exercises = newValue;
      }
    });

  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:messageCard
 * @description
 * # messageCard
 */
angular.module('powerHouseApp')
  .directive('messageCard', ['$location', function ($location) {
    return {
      templateUrl: 'scripts/directives/messageCard/messageCardView.html',
      restrict: 'E',
      scope: {
        message: '=',
        buttonText: '=',
        link: '='
      },
      link: function postLink(scope) {
        scope.buttonClicked = function(){
          $location.path(scope.link);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.toastService
 * @description
 * # toastService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('toastService', ['$mdToast', function ($mdToast) {
    var contract = {};

    var position = 'bottom';

    contract.showUndoToast = function(text, undoFunction){
      $mdToast.show(getToastObject(text, position)).then(function(response){
        if (response === 'ok'){
          undoFunction();
        }
      });
    };

    var getToastObject = function(text, position){
      return $mdToast.simple()
        .textContent(text)
        .action('UNDO')
        .highlightAction(true)
        .position(position);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.defaultProgramTypeService
 * @description
 * # defaultProgramTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('defaultProgramTypeService', function () {
    var contract = {};

    var defaultProgramTypes = [
      {  
        'id':0,
        'totalNumberOfSets':78,
        'programTypeName':'5 by 5',
        'exercises':[  
            {  
              'id':0,
              'name':'Squat',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Bench Press',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Barbell Row',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Overhead Press',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':4,
              'name':'Deadlift',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Week One',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':0
                        },
                        {  
                          'id':1,
                          'exercise':{  
                              'id':1,
                              'name':'Bench Press',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':0
                        },
                        {  
                          'id':2,
                          'exercise':{  
                              'id':2,
                              'name':'Barbell Row',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':0
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':1
                        },
                        {  
                          'id':1,
                          'exercise':{  
                              'id':3,
                              'name':'Overhead Press',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':0
                        },
                        {  
                          'id':2,
                          'exercise':{  
                              'id':4,
                              'name':'Deadlift',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':1,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':0
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':2
                        },
                        {  
                          'id':1,
                          'exercise':{  
                              'id':1,
                              'name':'Bench Press',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':1
                        },
                        {  
                          'id':2,
                          'exercise':{  
                              'id':2,
                              'name':'Barbell Row',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Week Two',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':3
                        },
                        {  
                          'id':1,
                          'exercise':{  
                              'id':3,
                              'name':'Overhead Press',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':1
                        },
                        {  
                          'id':2,
                          'exercise':{  
                              'id':4,
                              'name':'Deadlift',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':1,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':2
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':4
                        },
                        {  
                          'id':1,
                          'exercise':{  
                              'id':1,
                              'name':'Bench Press',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':2
                        },
                        {  
                          'id':2,
                          'exercise':{  
                              'id':2,
                              'name':'Barbell Row',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':2
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':5
                        },
                        {  
                          'id':1,
                          'exercise':{  
                              'id':3,
                              'name':'Overhead Press',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':5,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':2
                        },
                        {  
                          'id':2,
                          'exercise':{  
                              'id':4,
                              'name':'Deadlift',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted'
                              },
                              'description':'',
                              'confirmed':true
                          },
                          'confirmed':true,
                          'numberOfSets':1,
                          'numberOfReps':5,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':4
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            }
        ],
        'default':true
      },
      {  
        'id':1,
        'totalNumberOfSets':93,
        'programTypeName':'Smolov Junior',
        'exercises':[  
            {  
              'id':0,
              'name':'Squat',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted',
              },
              'description':'',
              'confirmed':true,
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Week One',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':6,
                          'numberOfReps':6,
                          'oneRepMaxPercent':70,
                          'incrementMultiplier':0
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':7,
                          'numberOfReps':5,
                          'oneRepMaxPercent':75,
                          'incrementMultiplier':0
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':8,
                          'numberOfReps':4,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':0
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':10,
                          'numberOfReps':3,
                          'oneRepMaxPercent':85,
                          'incrementMultiplier':0
                        }
                    ],
                    'confirmed':true,
                  }
              ],
              'confirmed':true,
            },
            {  
              'id':1,
              'name':'Week Two',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':6,
                          'numberOfReps':6,
                          'oneRepMaxPercent':70,
                          'incrementMultiplier':1
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':7,
                          'numberOfReps':5,
                          'oneRepMaxPercent':75,
                          'incrementMultiplier':1
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':8,
                          'numberOfReps':4,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':1
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':10,
                          'numberOfReps':3,
                          'oneRepMaxPercent':85,
                          'incrementMultiplier':1
                        }
                    ],
                    'confirmed':true,
                  }
              ],
              'confirmed':true,
            },
            {  
              'id':2,
              'name':'Week Three',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':6,
                          'numberOfReps':6,
                          'oneRepMaxPercent':70,
                          'incrementMultiplier':2
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':7,
                          'numberOfReps':5,
                          'oneRepMaxPercent':75,
                          'incrementMultiplier':2
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':8,
                          'numberOfReps':4,
                          'oneRepMaxPercent':80,
                          'incrementMultiplier':2
                        }
                    ],
                    'confirmed':true,
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercise':{  
                              'id':0,
                              'name':'Squat',
                              'exerciseType':{  
                                'id':0,
                                'name':'Weighted',
                              },
                              'description':'',
                              'confirmed':true,
                          },
                          'confirmed':true,
                          'numberOfSets':10,
                          'numberOfReps':3,
                          'oneRepMaxPercent':85,
                          'incrementMultiplier':2
                        }
                    ],
                    'confirmed':true,
                  }
              ],
              'confirmed':true,
            }
        ],
        'default':true
      }
    ];


    contract.getDefaultProgramTypes = function(){
      return defaultProgramTypes;
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.unitService
 * @description
 * # unitService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('unitService', ['utilService', 'storageService', 'keyHandlerService', function (utilService, storageService, keyHandlerService) {
    var contract = {
      currentUnit: 'kilograms',
      unitMap: {
        'kilograms': {
          name: 'kilograms',
          textName: 'kgs',
          interval: 2.5,
          conversion: 2.20462,
          conversionInterval: 5
        },
        'pounds': {
          name: 'pounds',
          textName: 'lbs',
          interval: 5,
          conversion: 0.453592,
          conversionInterval: 2.5
        }
      }
    };

    var init = function(){
      contract.currentUnit = getUnitFromStorage();
    };

    contract.changeUnit = function(key){
      contract.currentUnit = key;
      storeUnit();
    };

    contract.getUnits = function(){
      return Object.keys(contract.unitMap).map(function(unit){
        return contract.unitMap[unit];
      });
    };

    contract.getCurrentUnit = function(){
      return contract.unitMap[contract.currentUnit];
    };

    contract.convert = function(key, weight){
      var unit = contract.unitMap[key];
      return utilService.round(weight * unit.conversion, 1, unit.conversionInterval);
    };

    var getUnitFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.unit, 'kilograms');
    };

    var storeUnit = function(){
      storageService.storeValue(keyHandlerService.keys.unit, contract.currentUnit);
    };

    init();

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.dashboardService
 * @description
 * # dashboardService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('dashboardService', ['programService', 'recentlyActiveService', function (programService, recentlyActiveService) {
    var contract = {
      completedHeaderText: 'Programs',
      completedHighlightText: programService.getCompletedPrograms().length,
      completedHighlightColor: 'green-500',
      completeSubheadText: 'complete',
      
      activeHeaderText: 'Programs',
      activeHighlightText: programService.getActivePrograms().length,
      activeHighlightColor: 'deep-orange-500',
      activeSubheadText: 'active',
      
      quickCompleteProgram: recentlyActiveService.getRecentlyActive()
    };

    contract.getCompletedPrograms = function(){
      var completedPrograms = programService.getCompletedPrograms().length;

      if(changed(contract.completedHighlightText, completedPrograms)){
        contract.completedHighlightText = completedPrograms;
      }

      return completedPrograms;
    };

    contract.getActivePrograms = function(){
      var activePrograms = programService.getActivePrograms().length;

      if(changed(contract.activeHighlightText, activePrograms)){
        contract.activeHighlightText = activePrograms;
      }

      return activePrograms;
    };

    contract.getQuickCompleteProgram = function(){
      var quickCompleteProgram = recentlyActiveService.getRecentlyActive();

      if(contract.quickCompleteProgram !== quickCompleteProgram){
        contract.quickCompleteProgram = quickCompleteProgram;
      }

      return quickCompleteProgram;
    };

    var changed = function(value1, value2){
      return value1 !== value2;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:highlightCard
 * @description
 * # highlightCard
 */
angular.module('powerHouseApp')
  .directive('highlightCard', function () {
    return {
      templateUrl: 'scripts/directives/highlightCard/highlightCardView.html',
      restrict: 'E',
      scope: {
        headerText: '=',
        highlightText: '=',
        highlightColor: '=',
        subheadText: '='
      },
      link: function postLink() {
        
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:quickComplete
 * @description
 * # quickComplete
 */
angular.module('powerHouseApp')
  .directive('quickComplete', ['utilService', 'quickCompleteService', '$location', function (utilService, quickCompleteService, $location) {
    return {
      templateUrl: 'scripts/directives/quickComplete/quickCompleteView.html',
      restrict: 'E',
      scope: {
        quickCompleteProgram: '='
      },
      link: function postLink(scope) {

        scope.helpTemplateUrl = quickCompleteService.helpTemplateUrl;
        scope.buttonText = 'Programs';

        scope.defined = function(){
          return quickCompleteService.defined(scope.quickCompleteProgram);
        };

        scope.calculatePercentageComplete = function(){
          quickCompleteService.updateProgramComplete(scope.quickCompleteProgram);
        };

        scope.buttonClicked = function(){
          $location.path('program-list');
        };

        scope.$watch(function(){
          return scope.quickCompleteProgram;
        }, function(){
          if(scope.defined(scope.quickCompleteProgram) === true){
            var data = quickCompleteService.getNextSetData(scope.quickCompleteProgram);
            scope.week = data.week;
            scope.day = data.day;
            scope.set = data.set;
            scope.exercise = data.exercise;
            scope.setInformation = data.setInformation;
          }
        }, true);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.quickCompleteService
 * @description
 * # quickCompleteService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('quickCompleteService', ['utilService', 'unitService', 'programService', function (utilService, unitService, programService) {
    var contract = {
      helpTemplateUrl: 'scripts/directives/quickComplete/quickCompleteHelpTemplate.html',
    };

    contract.defined = function(quickCompleteProgram){
      return (utilService.isDefined(quickCompleteProgram) && !angular.equals(quickCompleteProgram, {}));
    };

    contract.getNextSetData = function(quickCompleteProgram){
      var nextSet = findNextSet(quickCompleteProgram);
      return {
        week: nextSet.week,
        day: nextSet.day,
        set: nextSet.set,
        exercise: nextSet.set.exercise.name,
        setInformation: nextSet.set.numberOfSets + ' sets by ' + nextSet.set.numberOfReps + ' reps at ' + nextSet.set.weight + unitService.getCurrentUnit().textName
      };
    };

    contract.updateProgramComplete = function(program){
      programService.updateProgramComplete(program);
    };

    var findNextSet = function(program){
      for(var i = 0; i < program.weeks.length; i++){
        var week = program.weeks[i];
        for(var y = 0; y < week.days.length; y++){
          var day = week.days[y];
          for(var z = 0; z < day.sets.length; z++){
            var set = day.sets[z];
            if(set.complete === false){
              return {                
                week: week,
                day: day,
                set: set
              };
            }
          }
        }
      }
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.recentlyActiveService
 * @description
 * # recentlyActiveService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('recentlyActiveService', ['utilService', 'storageService', 'keyHandlerService', function (utilService, storageService, keyHandlerService) {
    var contract = {
      recentlyActive: {},
      removedProgram: {}
    };

    var init = function(){
      contract.recentlyActive = getRecentlyActiveFromStorage();
    };

    contract.getRecentlyActive = function(){
      return contract.recentlyActive;
    };

    contract.updateRecentlyActive = function(recentlyActive){
      var mostRecent = {};

      // Not Complete
      if(defined(recentlyActive) && recentlyActive.complete === false){
        mostRecent = recentlyActive;
      }

      contract.recentlyActive = mostRecent;
      storeRecentlyActive();
    };

    contract.undoRemove = function(){
      contract.recentlyActive = contract.removedProgram;
      contract.removedProgram = {};
    };

    contract.removeProgram = function(program){
      if(contract.recentlyActive.id === program.id){
        contract.removedProgram = program;
        contract.updateRecentlyActive({});
      }
    };

    contract.nextActive = function(programs){
      if(programs.length === 0){
        return {};
      }
      // Can later make this more intelligent to tell which one of the
      // active programs was the next most active
      return programs[0];
    };

    contract.currentlyActive = function(){
      return defined(contract.recentlyActive);
    };

    var defined = function(recentlyActive){
      return (utilService.isDefined(recentlyActive) && !angular.equals(recentlyActive, {}));
    };

    var getRecentlyActiveFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.recentlyActive, {});
    };

    var storeRecentlyActive = function(){
      storageService.storeValue(keyHandlerService.keys.recentlyActive, contract.recentlyActive);
    };

    init();

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.helpService
 * @description
 * # helpService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('helpService', ['$mdDialog', function ($mdDialog) {
    var contract = {};

    contract.display = function(templateUrl){
      $mdDialog.show({
        controller: 'dialogController',
        templateUrl: templateUrl,
        ariaLabel: 'Help Dialog',
        clickOutsideToClose: true
      });
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:help
 * @description
 * # help
 */
angular.module('powerHouseApp')
  .directive('help', ['helpService', function (helpService) {
    return {
      templateUrl: 'scripts/directives/help/helpView.html',
      restrict: 'E',
      scope: {
        templateUrl: '='
      },
      link: function postLink(scope) {
        scope.display = function(){
          helpService.display(scope.templateUrl);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:DialogcontrollerCtrl
 * @description
 * # DialogcontrollerCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('dialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    $scope.ariaLabel = 'Dialog';
    $scope.hideDialog = function(){
      $mdDialog.hide();
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:bottomNavigationBar
 * @description
 * # bottomNavigationBar
 */
angular.module('powerHouseApp')
  .directive('bottomNavigationBar', function () {
    return {
      templateUrl: 'scripts/directives/bottomNavigationBar/bottomNavigationBarView.html',
      restrict: 'E',
      link: function postLink() {
        
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('SettingsCtrl', function () {
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:weightUnitSetting
 * @description
 * # weightUnitSetting
 */
angular.module('powerHouseApp')
  .directive('weightUnitSetting', ['weightUnitSettingService', function (weightUnitSettingService) {
    return {
      templateUrl: 'scripts/directives/weightUnitSetting/weightUnitSettingView.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.units = weightUnitSettingService.getUnits();
        scope.currentUnit = weightUnitSettingService.getCurrentUnit();

        scope.$watch(function(){
          return scope.currentUnit.name;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            weightUnitSettingService.changeUnit(scope.currentUnit);
          }
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.weightUnitSettingService
 * @description
 * # weightUnitSettingService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('weightUnitSettingService', ['unitService', 'programService', function (unitService, programService) {
    var contract = {};

    contract.changeUnit = function(unit){
      unitService.changeUnit(unit.name);
      programService.convertPrograms();
    };

    contract.getUnits = function(){
      return angular.copy(unitService.getUnits());
    };

    contract.getCurrentUnit = function(){
      return angular.copy(unitService.getCurrentUnit());
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programConversionService
 * @description
 * # programConversionService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programConversionService', ['utilService', 'unitService', function (utilService, unitService) {
    var contract = {};

    contract.convertPrograms = function(programs){
      return programs.map(function(program){
        return convertProgram(program);
      });
    };

    var convertProgram = function(program){
      var unit = unitService.getCurrentUnit();

      var convertedProgram = angular.copy(program);

      if(convertedProgram.unit !== unit.name){
        convertedProgram.increment = convertIncrement(convertedProgram.unit, convertedProgram.increment);
        convertedProgram.exercises = convertExercises(convertedProgram.unit, convertedProgram.exercises);
        convertedProgram.weeks = convertWeeks(convertedProgram.unit, convertedProgram.weeks);
        convertedProgram.unit = unit.name;
      }

      return convertedProgram;
    };

    var convertIncrement = function(key, increment){
      return unitService.convert(key, increment);
    };

    var convertExercises = function(key, exercises){
      return exercises.map(function(exercise){
        exercise.oneRepMax = unitService.convert(key, exercise.oneRepMax);
        return exercise;
      });
    };

    var convertWeeks = function(key, weeks){
      return weeks.map(function(week){
        week.days = week.days.map(function(day){
          day.sets = day.sets.map(function(set){
            set.weight = unitService.convert(key, set.weight);
            return set;
          });
          return day;
        });
        return week;
      }); 
    };

    return contract;
  }]);

angular.module('powerHouseApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('index.html',
    "<!doctype html> <html> <head> <meta charset=\"utf-8\"> <title></title> <meta name=\"description\" content=\"\"> <meta name=\"viewport\" content=\"width=device-width\"> <!-- Place favicon.ico and apple-touch-icon.png in the root directory --> <!-- build:css(.) styles/vendor.css --> <!-- bower:css --> <link rel=\"stylesheet\" href=\"bower_components/angular-material/angular-material.css\"> <link rel=\"stylesheet\" href=\"bower_components/angular-material-expansion-panel/dist/md-expansion-panel.css\"> <!-- endbower --> <!-- endbuild --> <!-- build:css(.tmp) styles/main.css --> <link rel=\"stylesheet\" href=\"styles/main.css\"> <!-- endbuild --> </head> <body ng-app=\"powerHouseApp\"> <!--[if lte IE 8]>\r" +
    "\n" +
    "      <p class=\"browsehappy\">You are using an <strong>outdated</strong> browser. Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.</p>\r" +
    "\n" +
    "    <![endif]--> <!-- Add your site or application content here --> <div layout=\"column\" layout-fill> <navigation-bar></navigation-bar> <md-content flex=\"grow\"> <div ng-cloak ng-view></div> </md-content> <bottom-navigation-bar></bottom-navigation-bar> </div> <!-- Google Analytics: change UA-XXXXX-X to be your site's ID --> <script>!function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){\r" +
    "\n" +
    "       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),\r" +
    "\n" +
    "       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)\r" +
    "\n" +
    "       }(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\r" +
    "\n" +
    "\r" +
    "\n" +
    "       ga('create', 'UA-XXXXX-X');\r" +
    "\n" +
    "       ga('send', 'pageview');</script> <!-- build:js(.) scripts/vendor.js --> <!-- bower:js --> <script src=\"bower_components/angular/angular.js\"></script> <script src=\"bower_components/angular-animate/angular-animate.js\"></script> <script src=\"bower_components/angular-aria/angular-aria.js\"></script> <script src=\"bower_components/angular-cookies/angular-cookies.js\"></script> <script src=\"bower_components/angular-messages/angular-messages.js\"></script> <script src=\"bower_components/angular-resource/angular-resource.js\"></script> <script src=\"bower_components/angular-route/angular-route.js\"></script> <script src=\"bower_components/angular-sanitize/angular-sanitize.js\"></script> <script src=\"bower_components/angular-touch/angular-touch.js\"></script> <script src=\"bower_components/angular-material/angular-material.js\"></script> <script src=\"bower_components/angular-local-storage/dist/angular-local-storage.js\"></script> <script src=\"bower_components/angular-material-expansion-panel/dist/md-expansion-panel.js\"></script> <!-- endbower --> <!-- endbuild --> <!-- build:js({.tmp,app}) scripts/scripts.js --> <script src=\"scripts/app.js\"></script> <script src=\"scripts/directives/navigationBar/navigationBar.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramType.js\"></script> <script src=\"scripts/controllers/dashboard.js\"></script> <script src=\"scripts/controllers/programList.js\"></script> <script src=\"scripts/controllers/addProgram.js\"></script> <script src=\"scripts/controllers/addProgramType.js\"></script> <script src=\"scripts/controllers/programTypeList.js\"></script> <script src=\"scripts/services/programTypeService.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeName.js\"></script> <script src=\"scripts/services/exerciseTypeService.js\"></script> <script src=\"scripts/services/utilService.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeExercise.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeNameService.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeExerciseService.js\"></script> <script src=\"scripts/directives/addRemove/addRemove.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeWeek.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeWeekService.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeDay.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeDayService.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeSet.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramTypeSetService.js\"></script> <script src=\"scripts/services/addProgramTypeService.js\"></script> <script src=\"scripts/services/storageService.js\"></script> <script src=\"scripts/services/keyHandlerService.js\"></script> <script src=\"scripts/directives/programTypeList/programTypeList.js\"></script> <script src=\"scripts/directives/list/list.js\"></script> <script src=\"scripts/directives/programTypeList/programTypeListService.js\"></script> <script src=\"scripts/controllers/programTypeInformation.js\"></script> <script src=\"scripts/controllers/programInformation.js\"></script> <script src=\"scripts/services/programTypeInformationService.js\"></script> <script src=\"scripts/directives/addProgram/addProgram.js\"></script> <script src=\"scripts/directives/programList/programList.js\"></script> <script src=\"scripts/directives/addProgram/addProgramHeader.js\"></script> <script src=\"scripts/directives/addProgram/addProgramHeaderService.js\"></script> <script src=\"scripts/directives/addProgram/addProgramExerciseService.js\"></script> <script src=\"scripts/directives/addProgram/addProgramExercise.js\"></script> <script src=\"scripts/services/programService.js\"></script> <script src=\"scripts/directives/programList/programListService.js\"></script> <script src=\"scripts/services/programInformationService.js\"></script> <script src=\"scripts/controllers/editProgram.js\"></script> <script src=\"scripts/services/addProgramService.js\"></script> <script src=\"scripts/controllers/editProgramType.js\"></script> <script src=\"scripts/directives/messageCard/messageCard.js\"></script> <script src=\"scripts/services/toastService.js\"></script> <script src=\"scripts/services/defaultProgramTypeService.js\"></script> <script src=\"scripts/services/unitService.js\"></script> <script src=\"scripts/services/dashboardService.js\"></script> <script src=\"scripts/directives/highlightCard/highlightCard.js\"></script> <script src=\"scripts/directives/quickComplete/quickComplete.js\"></script> <script src=\"scripts/directives/quickComplete/quickCompleteService.js\"></script> <script src=\"scripts/services/recentlyActiveService.js\"></script> <script src=\"scripts/directives/help/helpService.js\"></script> <script src=\"scripts/directives/help/help.js\"></script> <script src=\"scripts/controllers/dialogController.js\"></script> <script src=\"scripts/directives/bottomNavigationBar/bottomNavigationBar.js\"></script> <script src=\"scripts/controllers/settings.js\"></script> <script src=\"scripts/directives/weightUnitSetting/weightUnitSetting.js\"></script> <script src=\"scripts/directives/weightUnitSetting/weightUnitSettingService.js\"></script> <script src=\"scripts/services/programconversionservice.js\"></script> <!-- endbuild --> </body> </html>"
  );


  $templateCache.put('scripts/directives/addProgram/addProgramExerciseView.html',
    "<div layout=\"column\"> <md-card ng-if=\"exercises && exercises.length > 0\"> <md-card-header layout-align=\"none center\"> <md-card-header-text>Enter One Rep Max</md-card-header-text> <help template-url=\"helpAddProgramOneRepMaxUrl\"></help> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <form name=\"addProgramExerciseForm\" layout=\"column\"> <md-input-container ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\" ng-repeat=\"exercise in exercises\"> <label>{{exercise.name}}</label> <input name=\"programExerciseORM\" ng-model=\"exercise.oneRepMax\" type=\"number\" step=\"1\" min=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramExerciseForm.programExerciseORM.$error\"> <div ng-message=\"required\">A one rep max is required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> </form> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgram/addProgramHeaderView.html',
    "<div layout=\"column\"> <!-- Program Name and Program Type--> <md-card> <md-card-header layout-align=\"none center\"> <md-card-header-text>Add Program</md-card-header-text> <help template-url=\"helpAddProgramUrl\"></help> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <form name=\"addProgramForm\" layout=\"column\"> <md-input-container flex=\"100\" ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\"> <label>Program Name</label> <input name=\"programNameInput\" ng-model=\"programName\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramForm.programNameInput.$error\"> <div ng-message=\"required\">A program name is required.</div> </div> </md-input-container> <md-input-container ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\" flex=\"grow\"> <div layout=\"row\"> <div flex=\"grow\"> <label>Program Increment ({{unit.textName}})</label> <input name=\"programIncrement\" ng-model=\"increment\" type=\"number\" step=\"{{unit.interval}}\" min=\"0\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramForm.programIncrement.$error\"> <div ng-message=\"required\">A program increment is required.</div> <div ng-message=\"min\">A program increment cannot be less than 0.</div> </div> </div> <div> <help template-url=\"helpAddProgramProgramIncrementUrl\"></help> </div> </div> </md-input-container> <md-input-container ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-16' : true }\"> <md-select name=\"programType\" ng-model=\"programType\" placeholder=\"Select Program Type\" required md-no-asterisk=\"true\"> <md-option ng-repeat=\"type in programTypes\" ng-selected=\"programType.id === type.id\" ng-value=\"type\">{{type.programTypeName}}</md-option> </md-select> <div ng-messages=\"addProgramForm.programType.$error\"> <div ng-message=\"required\">A program type is required.</div> </div> </md-input-container> </form> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgram/addProgramView.html',
    "<div layout=\"column\"> <add-program-header program-name=\"programName\" program-type=\"programType\" increment=\"increment\"></add-program-header> <add-program-exercise exercises=\"exercises\"></add-program-exercise> <add-remove add-function=\"addFunction(programName, programType, increment, exercises)\" remove-function=\"removeFunction()\" invalid-function=\"invalidFunction(programName, programType, increment, exercises)\" name=\"'Program'\"></add-remove> </div>"
  );


  $templateCache.put('scripts/directives/addProgram/helpAddProgramOneRepMaxTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>One Rep Max</h3> <p>The maximum amount of weight that can be lifted in a single repetition for a given exercise.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgram/helpAddProgramProgramIncrementTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Program Increment</h3> <p>To build muscle progressive overloading is needed.</p> <p>This value will determine the gradual increase of weight added to each exercise that requires progressive overloading.</p> <div layout=\"column\"> <p>E.g. Bench Press, for 12 reps. Increment of 2.5kgs</p> <span flex>Week 1: Bench Press weight is 80kgs</span> <span flex>Week 2: Bench Press weight is 80kgs + 2.5kgs</span> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgram/helpAddProgramTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Add Program</h3> <p>A program is a fitness plan tailored to your fitness level.</p> <p>Once a program is created based off of a program type, you will be able to complete sets within the program maintaining track of your progress.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeDayView.html',
    "<div layout=\"column\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true, 'no-padding-bottom': true }\" layout-padding> <span class=\"md-subhead\">Days</span> <md-divider></md-divider> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"day in programTypeDays\" ng-if=\"day.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Name: {{day.name}}</h3> <h4>Total Sets: {{day.sets.length}}</h4> </div> <div layout=\"row\" class=\"md-secondary\"> <md-button class=\"md-fab md-mini\" ng-click=\"editDay(day)\" md-colors=\"{ background: 'orange-300' }\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button class=\"md-fab md-mini\" ng-click=\"removeDay(day)\" md-colors=\"{ background: 'red-300' }\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </md-list-item> </md-list> <span ng-repeat=\"day in programTypeDays\" ng-if=\"day.confirmed === false\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true }\"> <form name=\"programTypeDayForm\" layout=\"column\"> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <label>Day Name</label> <input name=\"programTypeDayNameInput\" ng-model=\"day.name\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeDayForm.programTypeDayNameInput.$error\"> <div ng-message=\"required\">A day name is required.</div> </div> </md-input-container> </form> <add-program-type-set program-type-sets=\"day.sets\"></add-program-type-set> <add-remove add-function=\"confirmDay(day)\" remove-function=\"removeDay(day)\" invalid-function=\"isInvalid(day)\" name=\"'Day'\"></add-remove> </span> <div layout=\"column\" ng-class=\"{ 'no-padding-bottom': true, 'no-padding-top': true }\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addDay()\" aria-label=\"Add Day\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Day</span> </div> </md-button> </div> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeExerciseView.html',
    "<div layout=\"column\"> <md-card> <md-card-header> <md-card-header-text>Exercises</md-card-header-text> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <div layout=\"column\"> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"exercise in programTypeExercises\" ng-if=\"exercise.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Name: {{exercise.name}}</h3> <h4>Type: {{exercise.exerciseType.name}}</h4> </div> <div layout=\"row\" class=\"md-secondary\"> <md-button class=\"md-fab md-mini\" ng-click=\"editExercise(exercise)\" md-colors=\"{ background: 'orange-300' }\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button class=\"md-fab md-mini\" ng-click=\"removeExercise(exercise)\" md-colors=\"{ background: 'red-300' }\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </md-list-item> </md-list> <form name=\"programTypeExerciseForm\" layout=\"column\" ng-repeat=\"exercise in programTypeExercises\" ng-if=\"exercise.confirmed === false\"> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <label>Exercise Name</label> <input name=\"programTypeExerciseNameInput\" ng-model=\"exercise.name\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeExerciseForm.programTypeExerciseNameInput.$error\"> <div ng-message=\"required\">An exercise name is required.</div> </div> </md-input-container> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <div layout=\"row\"> <div flex=\"grow\"> <md-select ng-class=\"{ 'no-margin-top': true, 'padding-top-4': true }\" name=\"programTypeExerciseTypeSelect\" ng-model=\"exercise.exerciseType\" placeholder=\"Exercise Type\" required md-no-asterisk=\"true\"> <md-option ng-repeat=\"exerciseType in exerciseTypes\" ng-selected=\"exercise.exerciseType.id === exerciseType.id\" ng-value=\"exerciseType\">{{exerciseType.name}}</md-option> </md-select> <div ng-messages=\"programTypeExerciseForm.programTypeExerciseTypeSelect.$error\"> <div ng-message=\"required\">An exercise type is required.</div> </div> </div> <div> <help template-url=\"helpAddProgramTypeExerciseTypeUrl\"></help> </div> </div> </md-input-container> <add-remove add-function=\"confirmExercise(exercise)\" remove-function=\"removeExercise(exercise)\" invalid-function=\"isInvalid(exercise)\" name=\"'Exercise'\"></add-remove> </form> <div ng-class=\"{ 'padding-bottom-8': true }\" layout=\"column\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addExercise()\" aria-label=\"Add Exercise\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Exercise</span> </div> </md-button> </div> </div> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeNameView.html',
    "<div layout=\"column\"> <md-card> <md-card-header layout-align=\"none center\"> <md-card-header-text>Add Program Type</md-card-header-text> <help template-url=\"helpAddProgramTypeUrl\"></help> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <form name=\"programTypeDetailsForm\" layout=\"column\"> <md-input-container flex=\"100\" ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\"> <label>Program Type Name</label> <input name=\"programTypeNameInput\" ng-model=\"programTypeName\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeDetailsForm.programTypeNameInput.$error\"> <div ng-message=\"required\">A program type name is required.</div> </div> </md-input-container> </form> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeSetView.html',
    "<div layout=\"column\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true, 'no-padding-bottom': true }\" layout-padding> <span class=\"md-subhead\">Sets</span> <md-divider></md-divider> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"set in programTypeSets\" ng-if=\"set.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Exercise: {{set.exercise.name}}</h3> <span ng-if=\"set.exercise.exerciseType.id === 0 || set.exercise.exerciseType.id === 1\"> <h4>Sets: {{set.numberOfSets}}, Reps: {{set.numberOfReps}}</h4> </span> <span ng-if=\"set.exercise.exerciseType.id === 2\"> <h4>Duration: {{set.duration}}</h4> </span> </div> <div layout=\"row\" class=\"md-secondary\"> <md-button class=\"md-fab md-mini\" ng-click=\"editSet(set)\" md-colors=\"{ background: 'orange-300' }\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button class=\"md-fab md-mini\" ng-click=\"removeSet(set)\" md-colors=\"{ background: 'red-300' }\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </md-list-item> </md-list> <span ng-repeat=\"set in programTypeSets\" ng-if=\"set.confirmed === false\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true }\"> <form name=\"programTypeSetForm\" layout=\"column\" ng-class=\"{ 'no-padding-bottom': true }\"> <md-input-container ng-class=\"{ 'no-margin-top': true }\" flex=\"100\"> <md-select name=\"programTypeSetExerciseSelect\" ng-model=\"set.exercise\" placeholder=\"Exercise\" required md-no-asterisk=\"true\"> <md-option ng-repeat=\"exercise in exercises | filter:removeNonComplete\" ng-selected=\"set.exercise.id === exercise.id\" ng-value=\"exercise\">{{exercise.name}}</md-option> </md-select> <div ng-messages=\"programTypeSetForm.programTypeSetExerciseSelect.$error\"> <div ng-message=\"required\">An exercise is required.</div> </div> </md-input-container> <!-- Number of Sets --> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true, 'padding-bottom-8': true }\" flex=\"100\" ng-if=\"set.exercise.exerciseType.id === 0 || set.exercise.exerciseType.id === 1\"> <label>Number of Sets</label> <input name=\"programTypeSetNumberOfSetsInput\" ng-model=\"set.numberOfSets\" type=\"number\" min=\"1\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeSetForm.programTypeSetNumberOfSetsInput.$error\"> <div ng-message=\"required\">Number of sets is required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 1 is required.</div> </div> </md-input-container> <!-- Number of Reps --> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true, 'padding-bottom-8': true }\" flex=\"100\" ng-if=\"set.exercise.exerciseType.id === 0 || set.exercise.exerciseType.id === 1\"> <label>Number of Reps</label> <input name=\"programTypeSetNumberOfRepsInput\" ng-model=\"set.numberOfReps\" type=\"number\" min=\"1\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeSetForm.programTypeSetNumberOfRepsInput.$error\"> <div ng-message=\"required\">Number of reps is required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 1 is required.</div> </div> </md-input-container> <!-- One Rep Max Percentage --> <md-input-container ng-if=\"set.exercise.exerciseType.id === 0\" ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true, 'padding-bottom-8': true }\" flex=\"100\"> <div layout=\"row\"> <div flex=\"grow\"> <label>One Rep Max %</label> <input name=\"programTypeSetOneRepMaxPercentInput\" ng-model=\"set.oneRepMaxPercent\" type=\"number\" min=\"0\" max=\"100\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeSetForm.programTypeSetOneRepMaxPercentInput.$error\"> <div ng-message=\"required\">One rep max is required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 0 is required.</div> <div ng-message=\"max\">A number less than 100 is required.</div> </div> </div> <div> <help template-url=\"helpAddProgramTypeOneRepMaxUrl\"></help> </div> </div> </md-input-container> <!-- Increment Multiplier --> <md-input-container ng-if=\"set.exercise.exerciseType.id === 0\" ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true, 'padding-bottom-8': true }\" flex=\"100\"> <div layout=\"row\"> <div flex=\"grow\"> <label>Increment Multiplier</label> <input name=\"programTypeSetIncrementMultiplierInput\" ng-model=\"set.incrementMultiplier\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeSetForm.programTypeSetIncrementMultiplierInput.$error\"> <div ng-message=\"required\">An Increment multiplier is required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 0 is required.</div> </div> </div> <div> <help template-url=\"helpAddProgramTypeIncrementUrl\"></help> </div> </div> </md-input-container> <!-- Duration --> <div ng-if=\"set.exercise.exerciseType.id === 2\" layout=\"row\"> <!-- Minutes --> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true, 'padding-bottom-8': true }\" flex=\"100\"> <label>Minutes</label> <input name=\"programTypeSetMinutesInput\" ng-model=\"set.minutes\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeSetForm.programTypeSetMinutesInput.$error\"> <div ng-message=\"required\">Minutes are required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 0 is required.</div> </div> </md-input-container> <!-- Seconds --> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true, 'padding-bottom-8': true }\" flex=\"100\"> <label>Seconds</label> <input name=\"programTypeSetSecondsInput\" ng-model=\"set.seconds\" type=\"number\" min=\"0\" max=\"59\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeSetForm.programTypeSetSecondsInput.$error\"> <div ng-message=\"required\">Seconds are required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 0 is required.</div> <div ng-message=\"max\">A number less than 59 is required.</div> </div> </md-input-container> </div> </form> <add-remove add-function=\"confirmSet(set)\" remove-function=\"removeSet(set)\" invalid-function=\"isInvalid(set)\" name=\"'Set'\"></add-remove> </span> <div layout=\"column\" ng-class=\"{ 'no-padding-bottom': true, 'no-padding-top': true }\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addSet()\" aria-label=\"Add Set\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Set</span> </div> </md-button> </div> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeView.html',
    "<div layout=\"column\"> <add-program-type-name program-type-name=\"programTypeName\"></add-program-type-name> <add-program-type-exercise program-type-exercises=\"exercises\"></add-program-type-exercise> <add-program-type-week program-type-weeks=\"weeks\"></add-program-type-week> <add-remove add-function=\"addFunction(programTypeName, exercises, weeks)\" remove-function=\"removeFunction()\" name=\"'Type'\" invalid-function=\"invalidFunction(programTypeName, exercises, weeks)\"></add-remove> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeWeekView.html',
    "<div layout=\"column\"> <md-card> <md-card-header> <md-card-header-text>Weeks</md-card-header-text> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <div layout=\"column\"> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"week in programTypeWeeks\" ng-if=\"week.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Name: {{week.name}}</h3> <h4>Total Days: {{week.days.length}}</h4> </div> <div layout=\"row\" class=\"md-secondary\"> <md-button class=\"md-fab md-mini\" ng-click=\"editWeek(week)\" md-colors=\"{ background: 'orange-300' }\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button class=\"md-fab md-mini\" ng-click=\"removeWeek(week)\" md-colors=\"{ background: 'red-300' }\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </md-list-item> </md-list> <span ng-repeat=\"week in programTypeWeeks\" ng-if=\"week.confirmed === false\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true }\"> <form name=\"programTypeWeekForm\" layout=\"column\"> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <label>Week Name</label> <input name=\"programTypeWeekNameInput\" ng-model=\"week.name\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeWeekForm.programTypeWeekNameInput.$error\"> <div ng-message=\"required\">A week name is required.</div> </div> </md-input-container> </form> <add-program-type-day program-type-days=\"week.days\"></add-program-type-day> <add-remove add-function=\"confirmWeek(week)\" remove-function=\"removeWeek(week)\" invalid-function=\"isInvalid(week)\" name=\"'Week'\"></add-remove> </span> <div ng-class=\"{ 'padding-bottom-8': true }\" layout=\"column\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addWeek()\" aria-label=\"Add Week\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Week</span> </div> </md-button> </div> </div> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/helpAddProgramTypeExerciseTypeTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Exercise Types</h3> <p>There are three types of exercise types.</p> <div layout=\"column\"> <span class=\"padding-bottom-4\"><span class=\"bold-text\">Weighted</span>: exercises that required weight (E.g. Bench Press).</span> <span class=\"padding-bottom-4\"><span class=\"bold-text\">Non-weighted</span>: exercises that do not require weight (E.g. Situps).</span> <span class=\"padding-bottom-4\"><span class=\"bold-text\">Cardio</span>: cardiovascular exercises which require a duration (E.g. Running).</span> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/helpAddProgramTypeIncrementTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Increment Multiplier</h3> <p>The amount of times an increment will be added to the calculated weight.</p> <div layout=\"column\"> <p>E.g. Bench Press, for 12 reps. Increment of 2.5kgs</p> <span flex>Multiplier of 1: Bench Press weight is 80kgs + 2.5kgs</span> <span flex>Multiplier of 2: Bench Press weight is 80kgs + 5kgs</span> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/helpAddProgramTypeOneRepMaxTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>One Rep Max Percent</h3> <p>A percentage of the one rep max that determines the weight to be used.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/helpAddProgramTypeTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Add Program Type</h3> <p>A program type is a scaffold outlining the weeks, days, sets and exercises for a custom fitness program.</p> <p>Once created the program type can be used to generate multiple programs.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addRemove/addRemoveView.html',
    "<div layout=\"row\"> <md-button class=\"md-raised flex\" md-colors=\"{ background: 'green-300'}\" ng-click=\"addFunction()\" ng-disabled=\"invalidFunction()\" aria-label=\"Add\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/check.svg\" flex=\"none\"></md-icon> <span flex>{{name}}</span> </div> </md-button> <md-button class=\"md-raised flex\" md-colors=\"{ background: 'red-300'}\" ng-click=\"removeFunction()\" aria-label=\"Remove\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/remove.svg\" flex=\"none\"></md-icon> <span flex>{{name}}</span> </div> </md-button> </div>"
  );


  $templateCache.put('scripts/directives/bottomNavigationBar/bottomNavigationBarView.html',
    "<div layout=\"row\"> <md-toolbar md-colors=\"{ background: 'primary-50'}\"> <div class=\"md-toolbar-tools\"> <div layout=\"column\" class=\"icon-width navbar-height\" layout-align=\"center center\"> <md-button class=\"md-icon-button\" href=\"#/add-program\" aria-label=\"add gym program\"> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/checkBlack.svg\"></md-icon> </md-button> <span class=\"icon-text truncate-text\">Add Program</span> </div> <div layout=\"column\" class=\"icon-width navbar-height\" layout-align=\"center center\"> <md-button class=\"md-icon-button\" ng-href=\"#/program-list\" aria-label=\"complete gym programs\"> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/listCheckBlack.svg\"></md-icon> </md-button> <span class=\"icon-text truncate-text\">Program List</span> </div> <span flex></span> <span flex></span> <div layout=\"column\" class=\"icon-width navbar-height\" layout-align=\"center center\"> <md-button class=\"md-icon-button\" ng-href=\"#/add-program-type\" aria-label=\"add gym program type\"> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/addBlack.svg\"></md-icon> </md-button> <span class=\"icon-text truncate-text\">Add Type</span> </div> <div layout=\"column\" class=\"icon-width navbar-height\" layout-align=\"center center\"> <md-button class=\"md-icon-button\" ng-href=\"#/program-type-list\" aria-label=\"complete gym program types\"> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/listAddBlack.svg\"></md-icon> </md-button> <span class=\"icon-text truncate-text\">Type List</span> </div> </div> </md-toolbar> </div>"
  );


  $templateCache.put('scripts/directives/help/helpView.html',
    "<div layout=\"column\"> <md-button class=\"md-icon-button\" ng-click=\"display()\" aria-label=\"help\"> <md-icon md-svg-icon=\"images/icons/help.svg\"></md-icon> </md-button> </div>"
  );


  $templateCache.put('scripts/directives/highlightCard/highlightCardView.html',
    "<div layout=\"column\"> <md-card md-colors=\"{ 'background': '{{highlightColor}}' }\"> <md-card-header class=\"padding-top-8 padding-bottom-8\"> <md-card-header-text> <span class=\"font-size-16 font-weight-600\">{{headerText}}</span> </md-card-header-text> </md-card-header> <md-card-title class=\"no-padding-top\"> <md-card-title-text layout-align=\"center center\"> <span class=\"font-size-48 center-text\">{{highlightText}}</span> <span class=\"md-subhead no-padding-top center-text\">{{subheadText}}</span> </md-card-title-text> </md-card-title> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/list/listView.html',
    "<div layout=\"column\"> <span ng-if=\"values && values.length > 0\" flex> <md-list> <md-list-item class=\"md-3-line background-white margin-bottom-10\" ng-repeat=\"value in values\" ng-href=\"{{value.href}}\" md-whiteframe=\"2\"> <div class=\"padding-top-24 padding-bottom-16 padding-right-16 padding-left-16\" layout=\"row\" flex=\"100\"> <div layout=\"column\" flex> <div layout=\"column\" flex> <p class=\"list-text headline truncate-text\">{{value.text}}</p> <p class=\"list-text subhead truncate-text\">{{value.secondText}}</p> <p class=\"list-text subhead truncate-text\">{{value.thirdText}}</p> </div> </div> <div layout=\"row\" flex=\"none\" layout-align=\"center start\"> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'orange-300' }\" ng-click=\"editFunction(value)\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button ng-if=\"value.removable\" class=\"md-icon-button\" md-colors=\"{ background: 'red-300' }\" class=\"md-raised\" ng-click=\"removeFunction(value)\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> <md-progress-linear ng-if=\"value.percentage >= 0\" class=\"list-progress\" md-mode=\"determinate\" value=\"{{value.percentage}}\"></md-progress-linear> </div> </md-list-item> </md-list> </span> <div ng-if=\"!values || values.length <= 0\" layout=\"column\"> <message-card message=\"emptyMessage\" link=\"emptyLink\" button-text=\"emptyButtonText\"></message-card> </div> </div>"
  );


  $templateCache.put('scripts/directives/messageCard/messageCardView.html',
    "<div class=\"column\"> <md-card md-colors=\"{ background: 'orange-200' }\"> <md-card-title class=\"padding-top-16 padding-bottom-8\"> <md-card-title-text layout-align=\"center center\">{{message}}</md-card-title-text> </md-card-title> <md-card-actions class=\"margin-bottom-16\" layout=\"column\" layout-align=\"center center\"> <md-button class=\"md-raised\" md-colors=\"{ background: 'orange-700', color: 'grey-900' }\" ng-click=\"buttonClicked()\">{{buttonText}}</md-button> </md-card-actions> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/navigationBar/navigationBarView.html',
    "<div layout=\"row\"> <md-toolbar class=\"md-hue-2\"> <div class=\"md-toolbar-tools\"> <div layout=\"column\" class=\"icon-width navbar-height\" layout-align=\"center center\"> <md-button class=\"md-icon-button\" ng-href=\"#/\" aria-label=\"dashboard\"> <md-icon md-svg-icon=\"images/icons/dashboard.svg\"></md-icon> </md-button> <span class=\"icon-text truncate-text\">dashboard</span> </div> <span flex></span> <h2 class=\"title-text\">POWER HOUSE</h2> <span flex></span> <div layout=\"column\" class=\"icon-width navbar-height\" layout-align=\"center center\"> <md-button class=\"md-icon-button\" ng-href=\"#/settings\" aria-label=\"settings\"> <md-icon md-svg-icon=\"images/icons/settings.svg\"></md-icon> </md-button> <span class=\"icon-text truncate-text\">settings</span> </div> </div> </md-toolbar> </div>"
  );


  $templateCache.put('scripts/directives/programList/programListView.html',
    "<div layout=\"column\"> <list edit-function=\"editFunction\" remove-function=\"removeFunction\" values=\"programs\" empty-message=\"emptyMessage\" empty-link=\"emptyLink\" empty-button-text=\"emptyButtonText\"></list> </div>"
  );


  $templateCache.put('scripts/directives/programTypeList/ProgramTypeListView.html',
    "<div layout=\"column\"> <list edit-function=\"editFunction\" remove-function=\"removeFunction\" values=\"programTypes\" empty-message=\"emptyMessage\" empty-link=\"emptyLink\" empty-button-text=\"emptyButtonText\"></list> </div>"
  );


  $templateCache.put('scripts/directives/quickComplete/quickCompleteHelpTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Quick Complete</h3> <p>Allows the quick completion of the next set in the most recently active program.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/quickComplete/quickCompleteView.html',
    "<div layout=\"column\"> <md-card class=\"quickcomplete\" ng-if=\"defined()\"> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">{{quickCompleteProgram.name}}</span> <span flex=\"nogrow\">{{week.name}} | {{day.name}}</span> </div> </md-card-header-text> <help template-url=\"helpTemplateUrl\"></help> </md-card-header> <md-card-content> <div layout=\"row\"> <div layout=\"column\" flex=\"grow\"> <span class=\"margin-bottom-8 font-weight-600\">{{exercise}}</span> <span>{{setInformation}}</span> </div> <div layout=\"column\" layout-align=\"center center\" flex=\"nogrow\"> <md-checkbox class=\"no-margin\" ng-model=\"set.complete\" ng-change=\"calculatePercentageComplete()\" aria-label=\"complete set\" flex=\"nogrow\"></md-checkbox> </div> </div> </md-card-content> <md-progress-linear ng-if=\"quickCompleteProgram.percentComplete >= 0\" md-mode=\"determinate\" value=\"{{quickCompleteProgram.percentComplete}}\"></md-progress-linear> </md-card> <md-card class=\"quickcomplete\" ng-if=\"!defined()\"> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">No most recent program</span> </div> </md-card-header-text> <help template-url=\"helpTemplateUrl\"></help> </md-card-header> <md-card-content> <div layout=\"column\" layout-align=\"none center\"> <md-button class=\"md-raised\" md-colors=\"{ background: 'orange-700', color: 'grey-900' }\" ng-click=\"buttonClicked()\">{{buttonText}}</md-button> </div> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/weightUnitSetting/weightUnitSettingView.html',
    "<div layout=\"column\"> <md-input-container class=\"no-margin-bottom no-margin-top\"> <div layout=\"row\" layout-align=\"none center\"> <div class=\"padding-right-8\" flex=\"noshrink\"> <p>Weight unit:</p> </div> <div flex=\"grow\"> <md-select ng-model=\"currentUnit\" aria-label=\"Units\"> <md-option ng-repeat=\"unit in units\" ng-selected=\"unit.name === currentUnit.name\" ng-value=\"unit\">{{unit.name}}</md-option> </md-select> </div> </div> </md-input-container> </div>"
  );


  $templateCache.put('views/addProgram.html',
    "<div layout=\"column\" layout-padding> <add-program program-name=\"programName\" program-type=\"programType\" increment=\"increment\" exercises=\"exercises\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program> </div>"
  );


  $templateCache.put('views/addProgramType.html',
    "<div layout=\"column\" layout-padding> <add-program-type program-type-name=\"programTypeName\" exercises=\"exercises\" weeks=\"weeks\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program-type> </div>"
  );


  $templateCache.put('views/dashboard.html',
    "<div layout=\"column\" layout-padding> <div layout=\"row\"> <div flex=\"50\"> <highlight-card header-text=\"completedHeaderText\" highlight-text=\"completedHighlightText\" highlight-color=\"completedHighlightColor\" subhead-text=\"completeSubheadText\"></highlight-card> </div> <div flex=\"50\"> <highlight-card header-text=\"activeHeaderText\" highlight-text=\"activeHighlightText\" highlight-color=\"activeHighlightColor\" subhead-text=\"activeSubheadText\"></highlight-card> </div> </div> <div layout=\"column\" flex> <quick-complete quick-complete-program=\"quickCompleteProgram\"></quick-complete> </div> </div>"
  );


  $templateCache.put('views/editProgram.html',
    "<div layout=\"column\" layout-padding> <add-program program-name=\"programName\" program-type=\"programType\" increment=\"increment\" exercises=\"exercises\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program> </div>"
  );


  $templateCache.put('views/editProgramType.html',
    "<div layout=\"column\" layout-padding> <add-program-type program-type-name=\"programTypeName\" exercises=\"exercises\" weeks=\"weeks\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program-type> </div>"
  );


  $templateCache.put('views/programInformation.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <span ng-if=\"program !== undefined\" flex> <!-- HEADER --> <md-list> <md-list-item class=\"md-3-line background-white margin-bottom-10 no-padding-left no-padding-right\" md-whiteframe=\"2\"> <div class=\"padding-top-24 padding-bottom-16 padding-right-16 padding-left-16\" layout=\"row\" flex=\"100\"> <div layout=\"column\" flex> <div layout=\"column\" flex> <p class=\"list-text headline truncate-text\">{{program.name}}</p> <p class=\"list-text subhead truncate-text\">Total Weeks: {{program.weeks.length}}</p> <p class=\"list-text subhead truncate-text\">Increment: {{program.increment}}{{unit.textName}}</p> </div> </div> <div layout=\"row\" flex=\"none\" layout-align=\"center start\"> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'orange-300' }\" ng-click=\"editFunction(program)\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'red-300' }\" class=\"md-raised\" ng-click=\"removeFunction(program)\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </div> <md-progress-linear class=\"list-progress\" md-mode=\"determinate\" value=\"{{program.percentComplete}}\"></md-progress-linear> </md-list-item> </md-list> <!-- BODY --> <md-expansion-panel-group> <md-expansion-panel ng-repeat=\"week in program.weeks\"> <md-expansion-panel-collapsed> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <md-list ng-class=\"{ 'no-padding-top': true, 'no-padding-bottom': true }\" ng-repeat=\"day in week.days\" flex> <p class=\"no-margin-top\">{{day.name}}</p> <md-divider></md-divider> <md-list-item class=\"md-3-line\" ng-repeat=\"set in day.sets\" flex> <div ng-if=\"set.exercise.exerciseType.id === 0\" class=\"md-list-item-text\" flex> <h3 flex>{{set.exercise.name}}</h3> <p>{{set.numberOfSets}} sets by {{set.numberOfReps}} reps at {{set.weight}}{{unit.textName}}</p> <p>Increment Multiplier: {{set.incrementMultiplier}}</p> </div> <div ng-if=\"set.exercise.exerciseType.id === 1\" class=\"md-list-item-text\"> <h3 flex>{{set.exercise.name}}</h3> <p>{{set.numberOfSets}} sets by {{set.numberOfReps}} reps</p> </div> <div ng-if=\"set.exercise.exerciseType.id === 2\" class=\"md-list-item-text\"> <h3 flex>{{set.exercise.name}}</h3> <p>Duration: {{set.duration}}</p> </div> <md-checkbox class=\"md-secondary\" ng-model=\"set.complete\" ng-change=\"calculatePercentageComplete()\" aria-label=\"Complete Set\"></md-checkbox> </md-list-item> </md-list> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> </md-expansion-panel-group> </span> </div> </div>"
  );


  $templateCache.put('views/programList.html',
    "<div layout=\"column\" layout-padding> <program-list remove-function=\"removeFunction\" edit-function=\"editFunction\"></program-list> </div>"
  );


  $templateCache.put('views/programTypeInformation.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <span ng-if=\"programType !== undefined\" flex> <!-- HEADER --> <md-list> <md-list-item class=\"md-3-line background-white margin-bottom-10 no-padding-left no-padding-right\" md-whiteframe=\"2\"> <div class=\"padding-top-24 padding-bottom-16 padding-right-16 padding-left-16\" layout=\"row\" flex=\"100\"> <div layout=\"column\" flex> <div layout=\"column\" flex> <p class=\"list-text headline truncate-text\">{{programType.programTypeName}}</p> <p class=\"list-text subhead truncate-text\">Total Weeks: {{programType.weeks.length}}</p> <p class=\"list-text subhead truncate-text\">Total Sets: {{programType.totalNumberOfSets}}</p> </div> </div> <div layout=\"row\" flex=\"none\" layout-align=\"center start\"> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'orange-300' }\" ng-click=\"editFunction(programType)\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button ng-if=\"programType.removable\" class=\"md-icon-button\" md-colors=\"{ background: 'red-300' }\" class=\"md-raised\" ng-click=\"removeFunction(programType)\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </div> </md-list-item> </md-list> <!-- BODY --> <md-expansion-panel-group> <md-expansion-panel> <md-expansion-panel-collapsed> <div class=\"md-title\">Exercises</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">Exercises</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <md-list ng-class=\"{ 'no-padding-top': true, 'no-padding-bottom': true }\" ng-repeat=\"exercise in programType.exercises\" flex> <md-list-item class=\"md-2-line\" flex> <div class=\"md-list-item-text\" flex> <h3 flex>{{exercise.name}}</h3> <p>Type: {{exercise.exerciseType.name}}</p> </div> </md-list-item> <md-divider ng-if=\"!$last\"></md-divider> </md-list> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> <md-expansion-panel ng-repeat=\"week in programType.weeks\"> <md-expansion-panel-collapsed> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <md-list ng-repeat=\"day in week.days\" flex> <p class=\"no-margin-top\">{{day.name}}</p> <md-divider></md-divider> <md-list-item class=\"md-3-line\" ng-repeat=\"set in day.sets\" flex> <div ng-if=\"set.exercise.exerciseType.id === 0\" class=\"md-list-item-text\" flex> <h3 flex>{{set.exercise.name}}</h3> <p>{{set.numberOfSets}} sets by {{set.numberOfReps}} reps at {{set.oneRepMaxPercent}}% ORM</p> <p>Increment Multiplier: {{set.incrementMultiplier}}</p> </div> <div ng-if=\"set.exercise.exerciseType.id === 1\" class=\"md-list-item-text\"> <h3 flex>{{set.exercise.name}}</h3> <p>{{set.numberOfSets}} sets by {{set.numberOfReps}} reps</p> </div> <div ng-if=\"set.exercise.exerciseType.id === 2\" class=\"md-list-item-text\"> <h3 flex>{{set.exercise.name}}</h3> <p>Duration: {{set.duration}}</p> </div> </md-list-item> </md-list> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> </md-expansion-panel-group> </span> </div> </div>"
  );


  $templateCache.put('views/programTypeList.html',
    "<div layout=\"column\" layout-padding> <program-type-list></program-type-list> </div>"
  );


  $templateCache.put('views/settings.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <md-card> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">Settings</span> </div> </md-card-header-text> </md-card-header> <md-card-content> <weight-unit-setting></weight-unit-setting> </md-card-content> </md-card> </div> </div>"
  );

}]);
