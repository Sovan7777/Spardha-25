const mongoose  = require('mongoose');

const teamIdSchema = new mongoose.Schema({
    teamId: {
        type:String,
        default:1,
    },
})

const TeamId = mongoose.model('TeamId', teamIdSchema);

module.exports = TeamId;