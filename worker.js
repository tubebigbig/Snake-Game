onmessage = function (e) {
  const data = e.data;
  let interval;
  if (data.start) {
    interval = setTimeout(function () {
      postMessage(true);
    }, data.times || 1000);
  }
  if (data.stop && interval !== undefined) {
    clearTimeout(interval);
  }
};
