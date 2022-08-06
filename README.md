一个cactbot扩展插件能读取当前游戏的标点坐标和摄像机面相参数；
使用方法
```javascript
let camera;
addOverlayListener("onPlayerControl", (e) => {
  camera=e.detail;
});
```
能使用的属性
![Alt](属性.png)

