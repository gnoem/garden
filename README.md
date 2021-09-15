<div align="center">

🌱

# planet naomi

graphical experiments

[&raquo; view live](https://naomi.vercel.app)

</div>

## note to self

```json
{
  "extensions" : {
      "KHR_materials_transmission" : {
          "transmissionFactor" : 1
      },
      "KHR_materials_volume": {
          "thicknessFactor": 2.0,
          "attenuationDistance":  0.006
      }
  }
}
```

## todo

- [x] smooth transition between themes
- [ ] add a loading indicator to theme transition
- [x] fix useVerifyLoaded
- [ ] button to pause/play animations
- [x] arrow buttons to toggle theme
- [x] figure out if separate theme context is really necessary? could also just create a custom hook and maybe put it in RenderContext since they're somewhat related/interdependent already
- [x] maybe also create separate context called SceneContext that useScene lives inside and houses scene + camera? effectively dividing up sceneComponents into Scene (scene + camera, reset based on theme) and Render (renderer + loop, persistent throughout theme changes); maybe these can both belong to an overarching sceneComponents context which is something ive wanted to do for a bit, make scene components more easily available
- [x] get rid of transformObject its stupid
- [x] add css for different themes
- [ ] convert water to ts
- [ ] clean up lib
- [ ] link themes to url paths??
- [ ] add resize listener to canvas and see if that fixes mobile safari screen size thing or figure out what was causing that
- [x] scene component should just go in Main instead of having to be loaded in from theme file
- [ ] add orbit controls to baby bottle