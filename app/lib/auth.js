import * as dotenv from "dotenv";
dotenv.config();

export const validateToken = (req, res, next) => {
    try {
        let token = "";
        if (req.headers?.authorization) {
            token = req.headers?.authorization?.split("Bearer ")[1];
        } else if (req.headers?.Authorization) {
            token = req.headers?.Authorization?.split("Bearer ")[1];
        }

        if (!token) {
            throw new Error("Session Expired");
        }

        // Verify the token here
        // As of now, the token is hardcoded for a single user only.
        // Later we can pull this from the database if more are required.

        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            msg: err.message,
            success: false,
        });
    }
};
