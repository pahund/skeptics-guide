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

const getSet = (getKey, setKey, transform) => (obj) =>
  ({
    ...obj,
    [setKey]: transform(obj[getKey]),
  });

const addReadableDate = getSet(
  'date',
  'readableDate',
  t => new Date(t * 1000).toGMTString()
);
const sanitizeMessage = getSet(
  'message',
  'message',
  msg => msg.replace(/</g, '&lt;')
);
const buildLinkToSender = getSet(
  'username',
  'sender',
  u => `https://example.com/users/${u}`
);

const buildLinkToSource = (notification) => ({
  ...notification,
  source: `https://example.com/${
    notification.sourceType
  }/${notification.sourceId}`
});
const iconPrefix = 'https://example.com/assets/icons/';
const iconSuffix = '-small.svg';
const addIcon = getSet(
  'sourceType',
  'icon',
  sourceType => `${iconPrefix}${sourceType}${iconSuffix}`
);

const map = f => functor => functor.map(f);

const pipe = (x0, ...funcs) => funcs.reduce(
  (x, f) => f(x),
  x0
);

const notificationData = parseJSON(`{
  "username": "sherlock",
  "message": "Watson. Come at once if convenient.<",
  "date": -1461735479,
  "displayName": "Sherlock Holmes",
  "id": 221,
  "read": false,
  "sourceId": "note-to-watson-1895",
  "sourceType": "note"
}`);

const badNotificationData = parseJSON("{");

const fallbackValue = {message: "error parsing JSON"};

const dataForTemplate = pipe(
  notificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
  reduce((_, val) => val, fallbackValue),
);//?
