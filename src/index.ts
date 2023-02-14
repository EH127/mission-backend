import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import ITask from "./interfaces/ITask";
import ITransition from "./interfaces/ITransition";
import cors from "cors";

const app = express();
const PORT = 3001;

let tasks: ITask[] = [];
let transitions: ITransition[] = [];

app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

app.get("/api/transitions", (req: Request, res: Response) => {
  res.json(transitions);
});

const isTask = (task: ITask, tasks: ITask[]) => {
  const initName = tasks.find((task) => task.isInitial === true)?.name;
  const taskDependencies = new Map();
  let isOrphanTask = false;
  let isFinalTask = false;

  let isAfterInit = false;
  if (initName === task.name) isOrphanTask = true;
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
    if (taskDependencies.has(task.name)) isOrphanTask = true;
  }

  if (task.isSelectedFrom === false) isFinalTask = true;
  return [isOrphanTask, isFinalTask];
};

app.post("/api/tasks", (req: Request, res: Response) => {
  const { name, isSelectedFrom, isSelectedTo, isInitial, isFinal, isOrphan } =
    req.body;

  const newTask: ITask = {
    name,
    isSelectedFrom,
    isFinal,
    isInitial,
    isOrphan,
    isSelectedTo,
  };

  tasks.push(newTask);

  res.json(tasks);
});

app.post("/api/transitions", (req: Request, res: Response) => {
  const { name, from, to } = req.body;

  const newTransition: ITransition = {
    name,
    from,
    to,
  };

  if (
    transitions.find((transition) => transition.name === name) ||
    (name && name.trimEnd().length === 0) ||
    !name
  ) {
    return;
  }
  tasks.map((task) =>{
    task.isSelectedFrom = task.name === from;
    task.isSelectedTo = task.name === to;
  })
  transitions.push(newTransition);

  res.json(transitions);
});

app.get("/api/tasks/updateall", (req: Request, res: Response) => {
  tasks = tasks.map((task) => {
    const [isOrphanTask, isFinalTask] = isTask(task, tasks);
    task.isFinal = isFinalTask;
    task.isOrphan = !isOrphanTask;
    return task;
  });
  res.json(tasks)
});

app.put("/api/tasks/:index", (req, res) => {
  const taskIndex = req.params.index;
  const updatedTask: ITask = req.body;

  if (updatedTask.isInitial === true) {
    tasks.map((task) => {
      return (task.isInitial = false);
    });

    tasks[taskIndex].isInitial = true;
  }

  res.json(tasks);
});

app.delete("/api/tasks/:taskName", (req, res) => {
  const taskName = req.params.taskName;
  tasks = tasks.filter((task) => task.name !== taskName);

  res.json(tasks);
});

app.delete("/api/transitions/:transitionName", (req, res) => {
  const transitionName = req.params.transitionName;
  transitions = transitions.filter(
    (transition) => transition.name !== transitionName
  );
  res.json(transitions);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
