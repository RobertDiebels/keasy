# Keasy |ˈkiː.zi|
A tiny library making [KeyBoardEvent][1] listening easy.

### Examples

#### Example 1
Lets assume you have a beautiful webpage like the one below.
``` html
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>KeasyPeasy</title>
      <script src="keasy.js"></script>
  </head>
  <body>
      Enter something here:
      <textarea id="test"></textarea>
      <span id="pretty">Pretty pleasy??</span>
  </body>
</html>
```
Seeing as you've already referenced ``Keasy`` in a script tag (old-fashioned I know..) all you have to do is call the following functions on Keasy 
1. `.when(Keasy.down)`
2. `.on(document.getElementById('test'))`
3. and finally ``.then(function(){document.getElementById('pretty').innerText = 'Thank you!!'})``

In full it looks like this
``` javascript
Keasy.when(Keasy.down).on(document.getElementById('test')).then(function(){document.getElementById('pretty').innerText = 'Thank you!!'});
```

This causes the callback you've set on ``.then()`` to be called immediately after a keydown [KeyBoardEvent][1] is fired on the textarea. It is also the most minimal version you can use to tell Keasy what to listen for and where.


Often you will want to wait a little while until a user is done typing. Let's go to Example 2 to see how that's done.

#### Example 2
Participants in [this][2] study produced an average of 75.85 Words Per Minute (WPM) a bit over 1 Word Per Second (WPS). 
Assuming most words are 3 or more letters meaning a word has at least 3 keystrokes, participants in the study cranked out about 1 keystroke every ``1000/3 = 333.33333`` milliseconds.

Which is really fast, so to be a bit on the safe side let's use 600 milliseconds for our example (I have big fingers ok...).

Refresh our  We now use the following call-sequence.

``` javascript
Keasy.when(Keasy.down).on(document.getElementById('test')).then(function(){document.getElementById('pretty').innerText = 'Thank you!!'}).after(600);
```
By adding ``after(600)`` to the sequence Keasy catches all ``keydown`` [KeyBoardEvents][1]. **After** each event Keasy waits 600 milliseconds for new events. If there are none the callback function passed to ``then()`` is called.

### Documentation
For an overview of all examples and documentation go to [the docs][3].

### Caveats
- Don't forget to call ``then()``
- Keasy instances only contain 1 KeyBoardEvent listener. Calling ``off()`` on an instance only removes the listener it registered. Cleaning up all listeners on a specific HTMLElement is currently your job.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent "KeyBoardEvent documentation"
[2]: http://www.asarif.com/pub/Arif_TIC-STH2009.pdf  "Analysis of Text Entry Performance Metrics"
[3]: http://keasy.github.io  "Keasy docs"
