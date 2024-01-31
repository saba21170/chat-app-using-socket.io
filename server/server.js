const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 5000;

// Multer Configuration
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });


app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);



  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
    //console.log(socket.id);
    console.log(msg);
  });

  socket.on("file upload", (file) =>{
    socket.broadcast.emit("file upload" , file)
    console.log(file)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
