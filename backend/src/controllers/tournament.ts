import { Express, Response, Request } from "express";
import Tournament from "../models/tournamentModel";
import { findTournament } from "../services/tournamentService/find";


export const getAll = async (req: Request, res: Response) => {
    const result = await Tournament.query();
    return res.status(200).send(result);
}

export const info = async (req: Request, res: Response) => {
    const id = req.body.id;
    const result = await findTournament(id);
    if(!result){
        return res.status(409).json({message: "tournament does not exist"});
    }else{
        return res.status(200).send(result);
    }
}