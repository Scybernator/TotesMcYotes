# Infrastructure

This info is mostly here in the event that I and someone else needs to take over keeping the site running.

The site is a Hugo page that is hosted on Cloudflare pages.  Cloudflare does the heavy lifting of setting up the git hooks and actually building the site.

The only environment variables that need to be set in cloudflare are the hugo version and the mail settings:

|Key            | Value             |
|---------------|-------------------|
|HUGO_VERSION   | 0.161.0           |
|EMAIL_PROVIDER | resend            |
|EMAIL_API_KEY  | xxxx-xxxx-xxxx    |
|PHOTO_EMAIL_TO | example@mail.com  |

Valid values for the `EMAIL_PROVIDER` are `"resend" | "sendgrid" | "mailgun"`, though [resend](https://resend.com) is the current provider.  If you need to re-setup the provider for some reason, the domain will need to be registered with the provider and some of the mail-related DNS records for the domain will need to be updated.  If mailgun is being used there is an extra environment variable `MAILGUN_DOMAIN` required, though tbh I haven't ever tested mailgun.

The `PHOTO_EMAIL_TO` is the address to send photos submissions to.

The logic for the photo email send is run via a cloudflare worker;  the javascript is found under `functions/api/submit-photo.js`

# Theme

Most of the sites styles and basic functionality are a part of the [red-wolf](https://github.com/Scybernator/red-wolf) theme, which is also maintained by me. Additional features and configuration options are documented there.  This theme is included in this repo as a git submodule.