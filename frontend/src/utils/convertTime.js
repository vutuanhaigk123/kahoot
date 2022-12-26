export const convertTS = (ts) => {
  var date = new Date(ts);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();

  // Will display time in 20/1/1970 15:19 format
  var formattedTime = `${day}/${month}/${year} ${hours}:${minutes.slice(-2)}`;

  return formattedTime;
};
