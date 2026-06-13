# Pushing changes

## Checklist

Before you push changes to the live site, check the following:

1. Have I set the `draft` field on the front matter of my posts to 'true'?
1. Have I reviewed the post to make sure all images and footnotes are displaying correctly?
1. Have I checked that the page card is displaying the correct image, and has a good summary?
1. Open the source control tab in VSCodium.  
    1. Are all my changes listed here?
    1. Are there any unexpected changes here? (your changes should generally only be in the `content` or `assets` directories, the other folders contain technical stuff)

## Committing changes

Once you are confident in your changes, the changes need to be *staged* in the source control tab.  This can be accomplied by clicking the '+' icon next to the files in the source control panel.

Once everything is staged, enter a *commit message* in the source control panel.  The text of this message doesn't matter, but it's helpfull for it to be descriptive (e.g "Add Post x" or "Fix typo in Post y")

After entering a commit message, click the 'commit' button to *commit* your changes. This will add your changes to the *revision history* of the site.

> Alternatively, you can run the command `git add * && git commit -m "Commit message"` in the terminal to stage all changes and commit them at once.

## Making your changes live

Once you are ready to push your changes to the site you can click the *syncronize* button in the source control panel to send the changes to the live site.  The site will update automatically after a few minutes.

> Alternatively, you can run the command `git push` to push your changes.
