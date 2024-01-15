const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
    if (err) {
        throw err;
    }
    homeContent = home;
});

fs.readFile("project.html", (err, project) => {
    if (err) {
        throw err;
    }
    projectContent = project;
});

fs.readFile("registration.html", (err, register) => {
    if (err) {
        throw err;
    }
    registrationContent = register;
});

const server = http.createServer((request, response) => {
    let url = request.url;
    response.writeHead(200, { "Content-Type": "text/html" });
    switch (url) {
        case "/project":
            response.write(projectContent);
            response.end();
            break;
        case "/registration":
            response.write(registrationContent);
            response.end();
            break;
        case "/home":
            response.write(homeContent);
            response.end();
            break;
        default:
            response.write(homeContent);
            response.end();
            break;
    }
});

const args = minimist(process.argv.slice(2));
const port = args.port;

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
