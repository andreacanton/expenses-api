const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersRegistered(() => {
  const View = use('View');
  const Env = use('Env');

  View.global('appUrl', path => {
    const appUrl = Env.get('APP_URL');

    return path ? `${appUrl}/${path}` : appUrl;
  });
});
