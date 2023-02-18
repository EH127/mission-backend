import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import ITask from "./interfaces/ITask";
import ITransition from "./interfaces/ITransition";
import cors from "cors";
import * as funcs from "./functions";

const app = express();
const PORT = process.env.PORT || 3001;

let tasks: ITask[] = [];
let transitions: ITransition[] = [];
let select: number = 0;

app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/api/select", (req: Request, res: Response) => {
  res.json({ select });
});

app.post("/api/select", (req: Request, res: Response) => {
  select = req.body.select;
  res.json({ select });
});

app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

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

app.put("/api/tasks/:index", (req: Request, res: Response) => {
  const taskIndex = req.params.index;
  const updatedTask: ITask = req.body;
  if (tasks.length > 0) {
    if (updatedTask.isInitial === true) {
      tasks.map((task) => {
        return (task.isInitial = false);
      });

      tasks[taskIndex].isInitial = true;
    }

    tasks = tasks.map((task) => {
      const isOrphanTask = funcs.isTask(task, tasks, transitions);
      task.isFinal = !task.isSelectedFrom;
      task.isOrphan = isOrphanTask;
      return task;
    });
  }
  res.json(tasks);
});

app.delete("/api/tasks/:taskName", (req: Request, res: Response) => {
  const taskName = req.params.taskName;
  const taskIndex = tasks.findIndex((task: ITask) => task.name === taskName);
  if (taskIndex === select && select > 0) select -= 1;

  const resault = funcs.onDelete(transitions, tasks, taskName);
  tasks = resault.tasks;
  transitions = resault.transitions;

  res.json(tasks);
});

app.get("/api/transitions", (req: Request, res: Response) => {
  res.json(transitions);
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

  transitions.push(newTransition);

  tasks = tasks.map((task) => {
    if (task.name === from) task.isSelectedFrom = true;
    if (task.name === to) task.isSelectedTo = true;
    return task;
  });

  tasks = tasks.map((task) => {
    const isOrphanTask = funcs.isTask(task, tasks, transitions);
    task.isFinal = !task.isSelectedFrom;
    task.isOrphan = isOrphanTask;
    return task;
  });

  res.json(transitions);
});

app.delete(
  "/api/transitions/:transitionName",
  (req: Request, res: Response) => {
    const transitionName = req.params.transitionName;
    transitions = transitions.filter(
      (transition) => transition.name !== transitionName
    );

    tasks = tasks.map((task) => {
      const isOrphanTask = funcs.isTask(task, tasks, transitions);
      task.isFinal = !task.isSelectedFrom;
      task.isOrphan = isOrphanTask;
      return task;
    });

    res.json(transitions);
  }
);

app.get("/api/reset", (req: Request, res: Response) => {
  tasks = [];
  transitions = [];
  select = 0;

  res.status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
