export const convertTS = (ts) => {
  var date = new Date(ts);
  var formattedTime = date.toLocaleDateString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return formattedTime;
};
