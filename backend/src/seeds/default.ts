import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("teams").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1,
      name: "Samuel",
      lastname: "Sadlek",
      username: "samcik333",
      email: "samcik333@gmail.com",
      password: "123456",
      role: "register",
    },
  ]);
  await knex("teams").insert([
    {
      id: 1,
      ownerId: 1,
      name: "Ostinohy",
      capacity: 5,
    },
  ]);
}
