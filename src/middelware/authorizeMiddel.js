exports.authorize = (roles = []) => {
    // If roles is a string, convert it to an array
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        try {
            const userRole = req.user.role; // Assuming `req.user` is populated by authentication middleware

            if (!roles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not have the required permissions.'
                });
            }

            next(); // User has the required role, proceed to the next middleware
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred while checking permissions.'
            });
        }
    };
};