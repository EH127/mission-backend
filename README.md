## Run the project

1) Pull the project from the repository

2) Open a command line and get into the folder where the project is located

3) Run 'npm install' to install all the dependencies

4) After all the dependencies have been installed run 'npx ts-node src/index.ts' and go to http://localhost:3001 on your browser

## api

### The project api is devided to 4 routes:

Select - in this route we can get and manipulate where the init task is located

Tasks - in this route we can get and manipulate the tasks

Transitions - in this route we can get and manipulate the transitions

Reset - in this route we can reset all the project routes

## Deployment

The project is deployed using render.com and can be access by https://mission-backend.onrender.com/api/{router}

Note: There is a way that the backend seens not responding, when this happen it will respond after aprox. 20 secunds
