import Tournament from "../../models/tournamentModel";

export const getAll = async () => {
    return await Tournament.query();
}