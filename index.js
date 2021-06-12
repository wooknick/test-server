const fs = require("fs");
// const app = require("express")();

const httpsServer = require("https").createServer(
  {
    key: fs.readFileSync("key.pem", "utf8"),
    cert: fs.readFileSync("cert.pem", "utf8"),
    passphrase: "asdfasdf",
  }
  // app
);

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

httpsServer.listen(1234, () => {
  console.log(`Listening on 1234`);
});

const io = require("socket.io")(httpsServer, {
  secure: true,
  requestCert: false,
  cors: {
    origin: ["https://10.0.1.4:3000", "*"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.emit("serverToMobile", "hi mobile");
  socket.on("mobileToServer", (data) => {
    // console.log(data);
    io.emit("serverToDesktop", data);
  });
  socket.on("desktopToServer", (arg) => {
    console.log(arg);
  });
});
