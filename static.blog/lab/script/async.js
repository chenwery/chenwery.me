var begin = new Date().getTime();
while(true) {
  var now = new Date().getTime();
  if ((now - begin) > 3000) {
    break;
  }
}
console.log('loaded script')
