    import mongoose from "mongoose";
    import bcrypt from "bcryptjs";

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "Name is Required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Minimum of Six Characters required"]
        },
        cartItems : [
            {
                quantity: {
                    type: Number,
                    default: 1
                },
                product: { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                }
            }
        ],
        role: {
            type: String,
            enum:["customer", "admin"],
            default: "customer"
        },
        privacy : {
            type: Boolean,
            default: false
        }
    },
        // createdAt, updatedAt
        {
        timestamps : true
        })


    // Pre-Save hook to hash password before saving to database

    userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();

        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next()
            
        } catch (error) {
            next(error)
        
        }  
        })

    // Compare the input password to the password in the database

    userSchema.methods.comparePassword = async function(password) {
        return bcrypt.compare(password, this.password);
    };

    const User = mongoose.model("User", userSchema);

    export default User;