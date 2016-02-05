module.exports = function(socket) {
  console.log("hello testing");
  socket.on('test', function(results) {
    console.log("Here are my results socket", results);
    socket.broadcast.emit('test', {
      test: "This worked just the way I wanted it too!"
    })
  })
}