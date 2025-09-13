

// Middleware to check userId  and hasPremuiumPlan

import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const {userId, has} = await req.auth();
        const hasPremuiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if (!hasPremuiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage
            
        } else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremuiumPlan ? 'premium' : 'free';
        next()

    } catch (error) {
        res.json({success: false, message: error.message })
    }
    
}