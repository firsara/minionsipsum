# Minionsipsum Desktop Client

Adds a little Tray Icon to your desktop where you can pull minion ipsum data to your clipboard.
connects to <a href="http://www.minionsipsum.com/">http://www.minionsipsum.com/</a> for fetching data.
Thanks to Carlos Alberto Hernández (<a href="http://www.calberhs.com/">http://www.calberhs.com/</a>) for creating that funny service in the first place.

## Download

you can download Minionsipsum Desktop Client at:
 * Mac OSX: <a href="http://fabianirsara.com/examples/minionsipsum/bin/minionsipsum.osx.x64.zip">http://fabianirsara.com/examples/minionsipsum/bin/minionsipsum.osx.x64.zip</a>
 * Windows: <a href="http://fabianirsara.com/examples/minionsipsum/bin/minionsipsum.win.x64.zip">http://fabianirsara.com/examples/minionsipsum/bin/minionsipsum.win.x64.zip</a>
 * Linux: <a href="http://fabianirsara.com/examples/minionsipsum/bin/minionsipsum.linux.x64.zip">http://fabianirsara.com/examples/minionsipsum/bin/minionsipsum.linux.x64.zip</a>

## Development

If you want you can build your own distribution easily by

 * cloning the repository
 * installing npm dependencies
 * installing bower dependencies
 * Specify your output target in Gruntfile.js (nwjs -> platforms), <br>see: <a href="https://github.com/nwjs/grunt-nw-builder">https://github.com/nwjs/grunt-nw-builder</a>
 * running grunt

```
git clone https://github.com/firsara/minionsipsum.git
npm install
bower install
grunt
````

## Contributing

please fork and create your own feature-branch, before commiting and creating pull requests.
I will do my best to include your changes.
