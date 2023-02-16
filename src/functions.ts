import ITask from "./interfaces/ITask";
import ITransition from "./interfaces/ITransition";

export const isTask = (
  task: ITask,
  tasks: ITask[],
  transitions: ITransition[]
) => {
  const initName = tasks.find((task) => task.isInitial === true)?.name;
  const taskDependencies = new Map();

  let isOrphanTask = true;
  let isFinalTask = false;
  let isAfterInit = false;

  if (initName === task.name) isOrphanTask = false;
  else {
    transitions.forEach(({ from, to }) => {
      if (isAfterInit || from === initName) {
        if (from) {
          taskDependencies.set(from, []);
        }
        taskDependencies.get(from).push(to);
        if (to) {
          if (!taskDependencies.has(to)) {
            taskDependencies.set(to, []);
          }
        }
        isAfterInit = true;
      }
    });
    if (taskDependencies.has(task.name)) isOrphanTask = false;
  }
  if (task.isSelectedFrom === false) isFinalTask = false;
  return [isOrphanTask, isFinalTask];
};

export const onDelete = (
  transitions: ITransition[],
  tasks: ITask[],
  name: string
) => {
  tasks = tasks.filter((task) => task.name !== name);

  transitions.map((transition) => {
    if (transition.to === name) {
      tasks.map((task) => {
        if (task.isSelectedFrom && task.name === transition.from) {
          task.isSelectedFrom = false;
        }
      });
    } else if (transition.from === name) {
      tasks.map((task) => {
        if (task.isSelectedTo && task.name === transition.from) {
          task.isSelectedTo = false;
        }
      });
    }
  });
  transitions = transitions.filter(
    (transition) => !(transition.from === name || transition.to === name)
  );

  return { tasks, transitions };
};
