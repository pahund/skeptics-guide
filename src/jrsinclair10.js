const O = (val) => ({
  map: f => O(f(val)),
  reduce: (f, x0) => f(x0, val),
  peekErr: () => O(val)
});

const Err = (e) => {
  const err = {
    map: () => err,
    reduce: (_, x0) => x0,
    peekErr: f => {
      f(e);
      return err;
    }
  };
  return err;
};

const parseJSON = (strData) => {
  try {
    return O(JSON.parse(strData));
  } catch (e) {
    return Err(e);
  }
}

const reduce = (f, x0) => foldable => foldable.reduce(f, x0);

const peekErr = f => result => result.peekErr(f);

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
  peekErr(console.warn),
  reduce((_, val) => val, fallbackValue),
);//?

const badDataForTemplate = pipe(
  badNotificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
  peekErr(console.warn),
  reduce((_, val) => val, fallbackValue),
);//?
