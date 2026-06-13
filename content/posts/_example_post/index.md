+++
title = 'Example Post'
subtitle = 'How to write a markdown article'
summary = 'This is the summary text that appears in the page card'
date = 2026-05-09T15:34:54+00:00
draft = true
tags = ['draft']
cardImage = 'Mississippi_Kite_Cropped_0.jpg'
+++

This is an example post that shows how to do various markdown things. 

<!--more-->

 Since it's marked as `draft = true`, it won't show up on the live site.  Most of the info here can be found in more detail on the [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet)
 
# Images
 Images can be added using the `[img]` tag; images can either be stored in the same folder as the post, or reference an image elsewhere on the internet via the URL.  Generally it's better not to use random images from the internet, because this can lead to copyright trouble.  Stuff from wikipedia is OK though.

Local Image: 
![local image](Glen_0.jpg "This is the optional hovertext")

Remote Image: 
![remote image](https://upload.wikimedia.org/wikipedia/commons/4/42/Canis_rufus_1_-_Syracuse_Zoo.jpg "Canis Rufus")

You can also use the `figure` shortcode to add an image with a caption:

{{<figure
  src="P1140149.jpg"
  caption="Sarah your homework is to identify this bird and update the caption.">}}

# Sections
 
Section headers can be specified with the '#' character;  These will show up in the table of contents/nav menu on the left of the page.

## SubSection

Adding more '#' makes additional subsection layers.

### Subsubsection

You can next up to 6 layers of subsections, if you're into that sort of thing.

# Links

 You can add links to the webpage like [this](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet#links).  Remind me later to change the link styles in the page content so they show up as the normal blue/purple.

# Footnotes

You can add a footnote with the footnote tag `[^1]`[^1]

[^1]: This is a footnote.  On wide screens, it will display in the margins next to the paragraph it appears in.  On small screens it goes to the bottom.

# Tables

Tables in markdown are sorta weird, and need to be specified like so:

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

See the [cheatsheet](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet#tables) section on tables for more info on the formatting.  There are tools available for taking an CSV table and formatting it in markdown.
