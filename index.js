const fs = require("fs");

const PORT = process.env.PORT | 1234;

const server = require("https").createServer(
  {
    key: fs.readFileSync("key.pem", "utf8"),
    cert: fs.readFileSync("cert.pem", "utf8"),
    passphrase: "asdfasdf",
  }
  // app
);

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const io = require("socket.io")(server, {
  secure: true,
  requestCert: true,
  cors: {
    origin: [`https://10.0.1.4:3000`, "*"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  // 모바일 연결 되면 playerId 부여
  socket.emit("playerId", socket.id);
  // player 화면 출력
  io.emit("desktopPlayerInit", { id: socket.id });

  socket.on("mobileControl", (data) => {
    io.emit("desktopControl", { id: socket.id, data });
  });

  socket.on("mobileToServer", (data) => {
    io.emit("serverToDesktop", data);
  });
  socket.on("desktopToServer", (arg) => {
    console.log(arg);
  });
  socket.on("disconnect", (reason) => {
    io.emit("playerDisconnect", socket.id);
    console.log("disconnected", socket.id);
  });
});
