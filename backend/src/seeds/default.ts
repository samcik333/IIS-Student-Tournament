import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("teams").del();
  await knex("tournaments").del();
  await knex("matches").del();
  await knex("users-teams-matches").del();
  await knex("users-tournaments-teams").del();
  await knex("users-teams").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1234567,
      name: "admin",
      lastname: "admin",
      username: "admin",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin",
      photo:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      gold: 0,
      silver: 0,
      bronze: 0,
      numberOfGames: 0,
      numberOfWins: 0,
    },
    {
      id: 1234568,
      name: "Janko",
      lastname: "Mrkvička",
      username: "janko1",
      email: "janko@gmail.com",
      password: "123456",
      role: "user",
      photo:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      gold: 3,
      silver: 1,
      bronze: 0,
      numberOfGames: 34,
      numberOfWins: 16,
    },
    {
      id: 1234569,
      name: "Peter",
      lastname: "Pavol",
      username: "pavol1",
      email: "pavol@gmail.com",
      password: "123456",
      role: "user",
      photo:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      gold: 3,
      silver: 1,
      bronze: 0,
      numberOfGames: 34,
      numberOfWins: 16,
    },
  ]);
  await knex("teams").insert([
    {
      id: 1234567,
      ownerId: 1234569,
      name: "Oštinohy",
      capacity: 10,
      logo: "",
      gold: 3,
      silver: 1,
      bronze: 0,
      numberOfGames: 34,
      numberOfWins: 16,
    },
    {
      id: 1234568,
      ownerId: 1234568,
      name: "Oštiruky",
      capacity: 10,
      logo: "",
      gold: 3,
      silver: 1,
      bronze: 0,
      numberOfGames: 34,
      numberOfWins: 16,
    },
  ]);
  await knex("tournaments").insert([
    {
      id: 1234567,
      ownerId: 1234569,
      name: "LOL turnaj",
      place: "Purkyne",
      date: new Date(),
      players: 2,
      capacity: 1,
      logo: "https://www.pngkey.com/png/detail/66-661551_white-blank-shield-logo-school-logo-template-free.png",
      state: "waiting",
    },
  ]);
  await knex("matches").insert([
    {
      id: 1234567,
      tournamentId: 1234567,
      date: new Date(),
      firstScore: 12,
      secondScore: 10,
    },
  ]);
  await knex("users-teams-matches").insert([
    {
      id: 1234567,
      matchId: 1234567,
      teamId: 1234567,
    },
    {
      id: 1234568,
      matchId: 1234567,
      teamId: 1234568,
    },
  ]);
  await knex("users-teams").insert([
    {
      id: 1234567,
      userId: 1234568,
      teamId: 1234568,
    },
    {
      id: 1234568,
      userId: 1234569,
      teamId: 1234567,
    },
  ]);
  await knex("users-tournaments-teams").insert([
    {
      id: 1234567,
      teamId: 1234568,
      tournamentId: 1234567,
    },
    {
      id: 1234568,
      teamId: 1234567,
      tournamentId: 1234567,
    },
  ]);
}
