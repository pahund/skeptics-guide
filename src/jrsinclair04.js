const parseJSON = (dataFromServer) => {
  try {
    return JSON.parse(dataFromServer);
  } catch (_) {
    return undefined;
  }
};

const notificationData = [
  parseJSON(`{
    "username": "sherlock",
    "message": "Watson. Come at once if convenient.",
    "date": -1461735479,
    "displayName": "Sherlock Holmes",
    "id": 221,
    "read": false,
    "sourceId": "note-to-watson-1895",
    "sourceType": "note"
  }`),
  parseJSON(`{
    "username": "sherlock",
    "message": "If not convenient, come all the same.",
    "date": -1461735359,
    "displayName": "Sherlock Holmes",
    "id": 221,
    "read": false,
    "sourceId": "note-to-watson-1895",
    "sourceType": "note"
  }`)
];

const getSet = (getKey, setKey, transform) => (obj) =>
  ({
    ...obj,
    [setKey]: transform(obj[getKey]),
  });

const addReadableDate = (notification) => {
  if (notification !== undefined) {
    return getSet(
      'date',
      'readableDate',
      t => new Date(t * 1000).toGMTString()
    )(notification);
  } else {
    return undefined;
  }
}
const sanitizeMessage = (notification) => {
  if (notification !== undefined) {
    return getSet(
      'message',
      'message',
      msg => msg.replace(/</g, '&lt;')
    )(notification)
  } else {
    return undefined;
  }
};
const buildLinkToSender = (notification) => {
  if (notification !== undefined) {
    return getSet(
      'username',
      'sender',
      u => `https://example.com/users/${u}`
    )(notification);
  } else {
    return undefined;
  }
};
const buildLinkToSource = (notification) => {
  if (notification !== undefined) {
    return ({
      ...notification,
      source: `https://example.com/${
        notification.sourceType
      }/${notification.sourceId}`
    });
  } else {
    return undefined;
  }
};
const iconPrefix = 'https://example.com/assets/icons/';
const iconSuffix = '-small.svg';
const addIcon = (notification) => {
  if (notification !== undefined) {
    return getSet(
      'sourceType',
      'icon',
      sourceType =>
        `${iconPrefix}${sourceType}${iconSuffix}`
    )(notification);
  } else {
    return undefined;
  }
};

const map = f => functor => functor.map(f);

const pipe = (x0, ...funcs) => funcs.reduce(
  (x, f) => f(x),
  x0
);

const dataForTemplate = pipe(
  notificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon)
);//?
