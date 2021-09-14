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

- [ ] loading icon
- [ ] button to pause/play animations
- [ ] arrow buttons to toggle theme
- [x] figure out if separate theme context is really necessary? could also just create a custom hook and maybe put it in RenderContext since they're somewhat related/in[ ] terdependent already
- [ ] get rid of transformObject its stupid
- [ ] add css for different themes
- [ ] convert water to ts
- [ ] clean up lib
- [ ] link themes to url paths??