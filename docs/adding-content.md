# Adding Content
  The site's content lives under the `content` directory;

## Adding a New Post 
 1. Create a new folder under the `posts` directory.
 1. Add an `index.md` file to your new folder.
 1. Add the following front-matter to the top of the file:
 ```m
+++
title = 'This is the title'
subtitle = 'This is the subtitle'
summary = 'This is the summary (Appears in the page card on the home page)'
date = 2026-05-09T15:34:54+00:00
draft = true
tags = ['red wolves', 'blue wolves']
cardImage = 'featuredImage.png'
+++
 ```

From here, the rest of the file is the post content;  the content is written in [Markdown](https://en.wikipedia.org/wiki/Markdown) format. The formal specifications for the markdown flavors supported by hugo are [CommonMark](https://spec.commonmark.org/current/) and [Github Markdown](https://github.github.com/gfm/).  A good place to start is with the cheatsheet:

### [**▶ Markdown CheatSheet ◀**](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet)

You can look at the markdown source in `\content\posts\_example_post\index.md` for a working example.

## Page Card Content
The Page Card is how the post is displayed as a link on the home page.  
### Card Images
The image for the card is selected from the following places, in order
1. The image specified in the `cardImage` field of the front matter
1. The image in the post folder with the same name as the post folder
1. The first image in the post content itself.
1. The image located at `assets/images/default.jpg`
1. No image, if none of the above is found.

Best practice is just to specify the image explicitly using `cardImage`

### Card Summary

The text summary is specified according the the rules laid out [here](https://gohugo.io/content-management/summaries/), though by default it's going to be there first 300 or so characters of the post.

## Running the Site
 To see what your changes are going to look like in the browser, open the terminal (&#229e;+~) and run
```
hugo server -D
```
Then navigate to http://localhost:1313

## Updating the site logo/hero image
 To update the site logo/hero images, replace the images in `/assets/images` with ones of the same resolution.
 - What are the resolutions
 - [ ] Where to set favicon