var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

//actor schema
var actorSchema = new Schema({
    ActorName : { type: String, required: true },
    CharacterName : { type: String, required: true }
})

//user schema
var MovieSchema = new Schema({
    title: { type: String, required: true, index: { unique: true }},
    year: { type: String, required: true },
    genre: { type: String, required: true },
    actors: {
            type: [actorSchema],
            required: true,
            validate: v => Array.isArray(v) && v.length == 3
            }
});

//return the model to server
module.exports = mongoose.model('Movie', MovieSchema);