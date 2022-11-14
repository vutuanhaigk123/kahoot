At react-with-express/ folder:

- Script run program: npm start
  (This will start express server and react server in parallel)

How to create sample project like this:

- mkdir react-with-express/
- cd react-with-express/
- npm init -y (package.json will be created in react-with-express folder)
- mkdir backend/
- cd backend/
- npm init -y (package.json will be created in react-with-express/backend folder)
- add a line: "type": "module", into the first line in backend/package.json
- touch app.js (app.js will be created in react-with-express/backend folder)
- write backend code in this app.js file.
- cd ../
- npx create-react-app frontend
- in react-with-express/package.json, change "scripts" section to:
  "scripts": {
  "start": "npm run startBE & npm run startFE",
  "startBE": "cd backend/ && node app.js",
  "startFE": "cd frontend/ && npm start"
  }

References:

- https://rapidapi.com/blog/create-react-app-express/
- https://stackoverflow.com/questions/30950032/how-can-i-run-multiple-npm-scripts-in-parallel#comment99350276_30950032
