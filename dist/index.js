"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 3000;
app_1.app.listen(port, () => {
    console.log(`app listen on porte ${port}`);
});
