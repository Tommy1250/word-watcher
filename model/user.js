const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    usedwords: {
        type: mongoose.SchemaTypes.Array,
        required: false,
        unique: false
    },
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    }
})
module.exports = mongoose.model("User", Schema)