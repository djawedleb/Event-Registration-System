import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
    {
        name:{ type : String, required : true },
        description:{ type : String, required : true },
        location:{ type : String, required : true },
        date:{ type : Date, required : true },
        time:{ type : String, required : true },
        image:{ type : String, required : true },
        price:{ type : Number, required : true },
    }
)

const Event = mongoose.model('Event', EventSchema);

export default Event;