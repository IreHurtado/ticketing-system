export default function admin(req, res, next){
    if (req.user.role != "admin"){
        return res
        .status(403)
        .json({
            message: "Access Denied, User don'thave permission to perform this action"
        });
    }

    next();
}

