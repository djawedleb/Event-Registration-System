import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
    {
        userId:{ type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true },
        eventId:{ type : mongoose.Schema.Types.ObjectId, ref : 'Event', required : true },
        createdAt:{ type : Date, default : Date.now },
        updatedAt:{ type : Date, default : Date.now },
    }
)

const Registration = mongoose.model('Registration', RegistrationSchema);

export default Registration;