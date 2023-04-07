const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getTeamQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const teamArray = await db.all(getTeamQuery);
  response.send(teamArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  try {
    const addPlayerQuery = `
    INSERT INTO 
    cricket_team 
    (player_name,jersey_number,role)
    VALUES 
    (
        ${playerName},
        ${jerseyNumber},
        ${role});`;
    const dbResponse = await db.run(addPlayerQuery);
    const playerId = dbResponse.lastID;
    response.send({ playerId: playerId });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
});
