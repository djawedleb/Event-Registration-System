import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name:{ type : String, required : true },
        email:{ type : String, required : true, unique : true },
        password:{ type : String, required : true },
        role: { 
            type: String, 
            enum: ['visitor', 'organizer'],
            default: 'visitor'
        },
        createdAt:{ type : Date, default : Date.now },
        updatedAt:{ type : Date, default : Date.now },
    }
)

const User = mongoose.model('User', UserSchema);

export default User;