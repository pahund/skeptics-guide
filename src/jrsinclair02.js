const notificationData = [
  {
    username: 'sherlock',
    message: 'Watson. Come at once if convenient.',
    date: -1461735479,
    displayName: 'Sherlock Holmes',
    id: 221,
    read: false,
    sourceId: 'note-to-watson-1895',
    sourceType: 'note',
  },
  {
    username: 'sherlock',
    message: 'If not convenient, come all the same.',
    date: -1461735359,
    displayName: 'Sherlock Holmes',
    id: 221,
    read: false,
    sourceId: 'note-to-watson-1895',
    sourceType: 'note',
  },
];

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

const dataForTemplate = notificationData
  .map(addReadableDate)
  .map(sanitizeMessage)
  .map(buildLinkToSender)
  .map(buildLinkToSource)
  .map(addIcon);//?
