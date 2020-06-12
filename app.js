const express = require('express');
const app = express();

const userRouter = require("./api/users/users.router");
const photoRouter = require("./api/photos/photos.router");

app.use((req, res, next) => {
    const error = new Error('Not found');;
    error.status = 404;
    next();
});

app.use((error, req, res, next) => {
    res.statsu(error.status || 500);
    res.jsnon({
        error: {
            message: error.message
        }
    });
});

app.use(express.json());

app.use("/user", userRouter);
app.use("/photo", photoRouter);

app.listen(3000, () => {
    console.log("Server is up!");
});