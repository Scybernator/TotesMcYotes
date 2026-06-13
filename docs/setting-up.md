# Setting Up

1. Install [git](https://git-scm.com/install)
1. Install [Hugo](https://gohugo.io/installation/)[^1]
1. Install [VSCodium](https://github.com/VSCodium/vscodium/releases)
    1. Install [this extension](https://open-vsx.org/extension/raer0/codium-insertdatestring) for formatting datetime.
    1. Navigate to `Settings` and set the **Insert Date String: Format** to 'YYYY-MM-DDTHH:mm:ss+00:00

## Pull site down
Open the command prompt (&#229e; + "cmd")
 ```
 git clone https://github.com/scybernator/TotesMcYotes.git
 cd TotesMcYotes
 git submodule update --init --recursive
 ```
    
1. Open TotesMcYotes folder in VS code.

## Verifying the setup

1. In VSCodium, hit `Ctrl + ~` to open the terminal.
1. Type `hugo server -D` and hit *enter*.
1. Go to http://localhost:1313 in your browser.
1. Call your brother if it's not working.


[^1]: Requires minimum version 0.146. [Latest Releases](https://github.com/gohugoio/hugo/releases/latest)