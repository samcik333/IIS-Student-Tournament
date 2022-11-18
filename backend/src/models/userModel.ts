import { Model } from "objection";
import Match from "./matchModel";
import Team from "./teamModel";
import Tournament from "./tournamentModel";

export default class User extends Model {
  id!: number;
  name!: string;
  lastname!: string;
  username!: string;
  email!: string;
  password!: string;
  photo!: string;
  role!: "admin" | "register";
  gold!: number;
  silver!: number;
  bronze!: number;
  numberOfGames!: number;
  numberOfWins!: number;
  numberOfLoses!: number;
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      teamsOwner: {
        relation: Model.HasManyRelation,
        modelClass: Team,
        join: {
          from: "users.id",
          to: "teams.ownerId",
        },
      },
      tournamentsOwner: {
        relation: Model.HasManyRelation,
        modelClass: Tournament,
        join: {
          from: "users.id",
          to: "tournaments.ownerId",
        },
      },
      matches: {
        relation: Model.ManyToManyRelation,
        modelClass: Match,

        join: {
          from: "users.id",

          through: {
            from: "users-teams-matches.userId",
            to: "users-teams-matches.matchId",
          },
          to: "matches.id",
        },
      },
      teams: {
        relation: Model.ManyToManyRelation,
        modelClass: Team,

        join: {
          from: "users.id",

          through: {
            from: "users-teams.userId",
            to: "users-teams.teamId",
          },
          to: "teams.id",
        },
      },
      tournaments: {
        relation: Model.ManyToManyRelation,
        modelClass: Tournament,

        join: {
          from: "users.id",

          through: {
            from: "users-tournaments-teams.userId",
            to: "users-tournaments-teams.tournamentId",
          },
          to: "tournaments.id",
        },
      },
    };
  }
}
