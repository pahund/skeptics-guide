const urlForData = "https://my.api.com/data";
const urlForBadData = "https://my.api.com/bad-data";

const dataFromServer = {
  username: "sherlock",
  message: "Watson. Come at once if convenient.",
  date: -1461735479,
  displayName: "Sherlock Holmes",
  id: 221,
  read: false,
  sourceId: "note-to-watson-1895",
  sourceType: "note",
};

const mockFetch = (url) =>
  new Promise((resolve) =>
    setTimeout(() =>
      resolve({
        json: () =>
          url === urlForData
            ? Promise.resolve(dataFromServer)
            : Promise.reject("failed to parse JSON from server"),
      })
    )
  );

const Task = (run) => ({
  map: (f) =>
    Task((resolve, reject) => {
      run((x) => resolve(f(x)), reject);
    }),
  peekErr: (f) =>
    Task((resolve, reject) =>
      run(resolve, (err) => {
        f(err);
        reject(err);
      })
    ),
  run: (onResolve, onReject) => run(onResolve, onReject),
  scan: (f, x0) =>
    Task((resolve) =>
      run(
        (x) => resolve(f(x0, x)),
        () => resolve(x0)
      )
    ),
});

Task.fromAsync =
  (asyncFunc) =>
  (...args) =>
    Task((resolve, reject) => {
      asyncFunc(...args)
        .then(resolve)
        .catch(reject);
    });

const taskFetchJSON = Task.fromAsync((url) =>
  mockFetch(url).then((data) => data.json())
);

const peekErr = (f) => (result) => result.peekErr(f);

const scan = (f, x0) => (scannable) => scannable.scan(f, x0);

const getSet = (getKey, setKey, transform) => (obj) => ({
  ...obj,
  [setKey]: transform(obj[getKey]),
});

const addReadableDate = getSet("date", "readableDate", (t) =>
  new Date(t * 1000).toGMTString()
);
const sanitizeMessage = getSet("message", "message", (msg) =>
  msg.replace(/</g, "&lt;")
);
const buildLinkToSender = getSet(
  "username",
  "sender",
  (u) => `https://example.com/users/${u}`
);

const buildLinkToSource = (notification) => ({
  ...notification,
  source: `https://example.com/${notification.sourceType}/${notification.sourceId}`,
});
const iconPrefix = "https://example.com/assets/icons/";
const iconSuffix = "-small.svg";
const addIcon = getSet(
  "sourceType",
  "icon",
  (sourceType) => `${iconPrefix}${sourceType}${iconSuffix}`
);

const map = (f) => (functor) => functor.map(f);

const pipe = (x0, ...funcs) => funcs.reduce((x, f) => f(x), x0);

const notificationData = taskFetchJSON(urlForData);
const badNotificationData = taskFetchJSON(urlForBadData);
const fallback = {};
const renderNotifications = (notifications) =>
  console.log(`notifications\n${JSON.stringify(notifications, null, 2)}`);
const handleError = console.warn;

const taskForTemplateData = pipe(
  notificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
  peekErr(console.warn),
  scan((_, val) => val, fallback)
);

const taskForBadTemplateData = pipe(
  badNotificationData,
  map(addReadableDate),
  map(sanitizeMessage),
  map(buildLinkToSender),
  map(buildLinkToSource),
  map(addIcon),
  peekErr(console.warn),
  scan((_, val) => val, fallback)
);

taskForTemplateData.run(renderNotifications, handleError);
taskForBadTemplateData.run(renderNotifications, handleError);
