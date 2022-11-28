const Just = (val) => ({
  map: f => Just(f(val)),
  reduce: (f, x0) => f(x0, val),
});

const Nothing = () => {
  const nothing = {
    map: () => nothing,
    reduce: (_, x0) => x0,
  };
  return nothing;
};

const parseJSON = (data) => {
  try {
    return Just(JSON.parse(data));
  } catch (_) {
    return Nothing();
  }
}

const reduce = (f, x0) => foldable => foldable.reduce(f, x0);

const notificationData = parseJSON(`{
  "username": "sherlock",
  "message": "Watson. Come at once if convenient.",
  "date": -1461735479,
  "displayName": "Sherlock Holmes",
  "id": 221,
  "read": false,
  "sourceId": "note-to-watson-1895",
  "sourceType": "note"
}`);//?

reduce((_, val) => val, {message: "error parsing JSON"})(notificationData);//?

const badNotificationData = parseJSON("{");

reduce((_, val) => val, {message: "error parsing JSON"})(badNotificationData);//?
