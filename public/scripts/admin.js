
var socket = io(location.origin + '/admin');

socket.on('connection', function () {
  alert('Connected to Admin!');
  
  // Listen for data updates
  // Draw on the screen
  // Send updated settings when changed
  
});