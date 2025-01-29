const TeamId = require("../Models/teamId.model");

const teamIdGenerate = async () => {
    try {
        const lastTeam = await TeamId.findOne().sort({ teamId: -1 });
        const newTeamId = lastTeam ?Number(lastTeam.teamId) + 1 : 1;
        const createdTeam = await TeamId.create({ teamId: newTeamId });

        console.log("Generated Team ID:", createdTeam.teamId);
        return createdTeam.teamId;
    } catch (error) {
        console.error("Error generating team ID:", error);
        throw error;
    }
};

// ✅ Make sure to export correctly
module.exports = teamIdGenerate;
