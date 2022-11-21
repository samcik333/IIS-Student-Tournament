import Team from "../../models/teamModel";

export const getTeamsById = async (id: number) => {
	return await Team.relatedQuery("users").for(id);
};

export const findTeam = async (id: string) => {
	return await Team.query().findOne("id", id);
};
