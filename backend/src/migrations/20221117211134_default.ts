import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary().unique();
      table.string("name").notNullable();
      table.string("lastname").notNullable();
      table.string("username", 30).notNullable().unique();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.string("photo");
      table.enum("role", ["admin", "register"]).notNullable();
      table.integer("gold");
      table.integer("silver");
      table.integer("bronze");
      table.integer("numberOfGames");
      table.integer("numberOfWins");
      table.integer("numberOfLoses");
    })
    .createTable("teams", (table) => {
      table.increments("id").primary().unique();
      table
        .integer("ownerId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .index();
      table.string("name").notNullable();
      table.integer("capacity").notNullable();
      table.string("logo");
      table.integer("gold");
      table.integer("silver");
      table.integer("bronze");
      table.integer("numberOfGames");
      table.integer("numberOfWins");
      table.integer("numberOfLoses");
    })
    .createTable("tournaments", (table) => {
      table.increments("id").primary().unique();
      table
        .integer("ownerId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .index();
      table.string("name").notNullable();
      table.datetime("date").notNullable();
      table.integer("capacity").notNullable();
      table.string("description");
      table.string("prize").notNullable();
    })
    .createTable("matches", (table) => {
      table.increments("id").primary().unique();
      table
        .integer("tournamentId")
        .unsigned()
        .references("id")
        .inTable("tournaments")
        .onDelete("CASCADE")
        .index();
      table.datetime("date").notNullable();
      table.integer("firstScore");
      table.integer("secondScore");
    })
    .createTable("users-teams-matches", (table) => {
      table.increments("id").primary().unique();
      table
        .integer("matchId")
        .unsigned()
        .references("id")
        .inTable("matches")
        .onDelete("CASCADE")
        .index();
      table
        .integer("teamId")
        .unsigned()
        .references("id")
        .inTable("teams")
        .onDelete("CASCADE")
        .index();
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .index();
    })
    .createTable("users-teams", (table) => {
      table.increments("id").primary().unique();
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .index();
      table
        .integer("teamId")
        .unsigned()
        .references("id")
        .inTable("teams")
        .onDelete("CASCADE")
        .index();
    })
    .createTable("users-tournaments-teams", (table) => {
      table.increments("id").primary().unique();
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .index();
      table
        .integer("tournamentId")
        .unsigned()
        .references("id")
        .inTable("tournaments")
        .onDelete("CASCADE")
        .index();
      table
        .integer("teamId")
        .unsigned()
        .references("id")
        .inTable("teams")
        .onDelete("CASCADE")
        .index();
    });
}
export async function down(knex: Knex): Promise<void> {
  return (
    await knex.schema.dropTableIfExists("users-tournaments-teams"),
    await knex.schema.dropTableIfExists("users-teams"),
    await knex.schema.dropTableIfExists("users-teams-matches"),
    await knex.schema.dropTableIfExists("matches"),
    await knex.schema.dropTableIfExists("tournaments"),
    await knex.schema.dropTableIfExists("teams"),
    await knex.schema.dropTableIfExists("users")
  );
}
