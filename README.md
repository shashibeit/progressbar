# Progressbar
Lightweight javascript nanoscopic progress bar.</br>
Animation that shows something is in process.</br>
Usable for the ajax applications.</br>

#Usage

Add `progress.js` to your project.

```html
<script src='progress.js'></script>
```


Afterwords call `Progress.start()`, `Progress.go(<percent%>)` and `Progress.complete()`  to render the progress bar.

~~~ js
Progress.start();
Progress.go(20);
Progress.go(30);
Progress.go(80);
Progress.go(100);
Progress.complete();
~~~

# Configurations

#### `minimum/maximum percentage`
Changes the minimum or maximum percentage used upon starting.</br> 
(default minimum : `20` , default maximum : `95`)

~~~ js
Progress.configure({ minimum: 60 });
Progress.configure({ maximum: 99 });
~~~

#### `speed`

Progressbar transition speed.</br>
(default maximum : `95`) 

~~~ js
Progress.configure({ speed: 0.5 });
~~~

#### `progress bar color(s)`
Progressbar color to be used.</br>
(default color : `#9400D3`)

~~~ js
Progress.configure({color:["#9400D3"]});
~~~

You can set multiple colors as per your wish.</br>

~~~ js
Progress.configure({ color: ['#06273b','#9400D3','#00FF00'] });
~~~


