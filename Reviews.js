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

//review schema
var ReviewSchema = new Schema({
    movieTitle: { type: String, required: true },
    name: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, integer: true, min: 0, max: 5,
            validate: {
                validator: Number.isInteger,
                message: 'Rating must be an integer value'
            } }
});

//return the model to server
module.exports = mongoose.model('Review', ReviewSchema);