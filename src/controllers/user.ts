/**
 * POST /login
 * Sign in using email and password.
 */
import {check, sanitize, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import * as passport from "passport";
import {User, UserDocument} from "../models/User";
import {IVerifyOptions} from "passport-local";

/**
 * POST /login
 * Log in.
 */
export const postLogin = (req: Request, res: Response, next: NextFunction) => {
    check("email", "Email is not valid").isEmail();
    check("password", "Password cannot be blank").isLength({min: 1});
    sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array().toString()); //TODO -> Remove toString
        return res.redirect("/login");
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash("errors", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            req.flash("success", "Success! You are logged in." );
            res.redirect("/");
        });
    })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    check("email", "Email is not valid").isEmail();
    check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
    check("confirmPassword", "Passwords do not match").equals(req.body.password);
    sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array().toString());
        return res.redirect("/signup");
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash("errors", "Account with that email address already exists.");
            return res.redirect("/signup");
        }
        user.save((err: any) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        });
    });
};

