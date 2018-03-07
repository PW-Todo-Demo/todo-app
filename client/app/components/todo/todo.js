import tasksService from '../../common/services/tasks-service/tasks-service';
// import { Task } from '../../common/models/task/task';
import { DEFAULT_INFO_TIMEOUT, DEFAULT_NG_MODEL_OPTIONS, MESSAGE_TYPE_ERROR, MESSAGE_TYPE_INFO } from '../../app.const';
import _ from 'lodash';
import './todo.scss';

class TodoController {

  constructor($location, $log, $q, $tasks, $timeout) {

    this.$location = $location;
    this.$log = $log;
    this.$q = $q;
    this.$tasks = $tasks;
    this.$timeout = $timeout;

    this.blockers = {
      api_processing: false,
      initializing: true
    };
    this.headerOptions = [];
    this.info = {
      message: null,
      type: MESSAGE_TYPE_INFO
    };
    this.ngModelOptions = DEFAULT_NG_MODEL_OPTIONS;
    this.tasks = []; // initialize with empty array

    this.activate();

  }

  activate() {

    this.headerOptions = [
      {
        callback: this.actionOpenTaskModal.bind(this),
        label: 'Add Task'
      }
    ];

    this.$tasks.load(null, {includes: 'users(id,first_name,last_name)'})
      .then((tasks) => {
        this.tasks = tasks;
      })
      .finally(() => {
        this.blockers.initializing = false;
      });

  }

  actionOpenTaskModal(taskId = 'new') {

    this.$timeout(
      () => {
        this.$location.path('/todo/' + taskId).search('');
        return;
      }
    );

  }

  handleError(error = null, autoHide = false) {

    let message = 'There was an error, please check console log for more details.'; // default message

    if (_.isString(error)) {
      message = `There was an error: ${error}`;
    } else if (_.isObject(error) && _.has(error, 'message')) {
      message = error.message;
    }

    this.$log.error(error);
    this.showInfo({
      message: message,
      type: MESSAGE_TYPE_ERROR
    });

    if (autoHide) {

      return this.$timeout(
        () => {
          this.showInfo(); // will hide message when called with no params
          return;
        },
        DEFAULT_INFO_TIMEOUT
      );

    } else {

      return this.$q.resolve();

    }

  }

  onTaskStatusChange(task = null) {

    this.blockers.api_processing = true;

    return this.$tasks.save(task)
      .catch((error) => {
        task.toggleStatus(); // revert is_complete change on error
        this.handleError(error, true);
      })
      .finally(() => {
        this.blockers.api_processing = false;
      });

  }

  showInfo(info = {message: null, type: MESSAGE_TYPE_INFO}) {
    this.info = info;
    return;
  }

}

TodoController.$inject = ['$location', '$log', '$q', tasksService.serviceName, '$timeout'];

export default {
  controller: TodoController,
  controllerName: 'TodoController',
  controllerAs: '$todo',
  name: 'Todo',
  template: require('./todo.html')
};
