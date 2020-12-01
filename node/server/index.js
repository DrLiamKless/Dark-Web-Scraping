const app = require("./app");
const port = 8080;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
// let date = new Date("29 Nov 2020, 09:22:51");
// let second = new Date("29 Nov 2020, 09:24:51") - date;
// console.log(second);
var d = new Date();

// d.setHours(d.getHours() - 3);
d.setHours(d.getHours() - 24 * 30);

// console.log(d);
let article = new Date("29 Nov 2020, 21:18:59");
console.log(article - d);
let hello = new Date() - d;
console.log(hello);
