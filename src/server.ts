import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import ITask from "./interfaces/ITask";
import ITransition from "./interfaces/ITransition";

const app = express();
const PORT = 3000;

let tasks: ITask[] = [];
let transitions: ITransition[] = [];

app.use(bodyParser.json());

app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});


app.get("/api/transitions", (req: Request, res: Response) => {
  res.json(transitions);
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

  res.json(newTask);
});

app.post("/api/transitions", (req: Request, res: Response) => {
  const { name, from, to } = req.body;

  const newTransition: ITransition = {
    name,
    from,
    to,
  };

  transitions.push(newTransition);

  res.json(newTransition);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
