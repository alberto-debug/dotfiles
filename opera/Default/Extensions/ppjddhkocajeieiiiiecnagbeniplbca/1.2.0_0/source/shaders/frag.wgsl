struct FragmentUniforms {
  mainColor : vec4<f32>,
  time : f32,
  padding : f32, // padding to ensure 16 byte alignment
  picker : vec2<f32>,
  resolution : vec2<f32>,
};

@group(0) @binding(0) var<uniform> fragmentUniforms : FragmentUniforms;

fn mat4x2_multiply(m: mat4x2<f32>, v: vec2<f32>) -> vec4<f32> {
  return vec4<f32>(
    dot(m[0], v),
    dot(m[1], v),
    dot(m[2], v),
    dot(m[3], v));
}

fn value(p: vec2<f32>, o: f32) -> f32 {
  let k = vec2<f32> (.07934,.01391);
  let f = vec2<f32> (floor(p));
  var s = p-f;
  s *= s*(3. - s*2.);
  let m = mat4x2<f32> (
    vec2<f32>(f.x, f.y),
    vec2<f32>(1.0 + f.x, f.y),
    vec2<f32>(f.x, 1.0 + f.y),
    vec2<f32>(1.0 + f.x, 1.0 + f.y));

  let h = vec4<f32> (fract(cos(o+mat4x2_multiply(m,k))*4e4));
  let x = vec2<f32> (mix(h.xz,h.yw,s.x));
  return mix(x.x,x.y,s.y);
}

@fragment
fn main(@builtin(position) fragCoord: vec4<f32>, 
@location(0) texCoord: vec2<f32>) -> @location(0) vec4<f32> {
  let SPEED = mix(0.1, 0.5, fragmentUniforms.picker.x);
  let NOISE = mix(0.0, 10.0, fragmentUniforms.picker.x);
  let BLUR = mix(1.0, 100.0, fragmentUniforms.picker.x);
  let SAT = mix(0.05, 0.25, fragmentUniforms.picker.y);
  let WAVE = mix(1.0, 5.0, fragmentUniforms.picker.x);
  let DISTORT = mix(0.0, 0.4, fragmentUniforms.picker.y);
  let BACK = fragmentUniforms.mainColor.rgb;
  let TINT = vec3<f32>(0.9, 0.8, 0.5);
  let PHASE = vec3<f32>(0.5 * sin(fragmentUniforms.time * 0.7),
    1.0, 2.0 + 0.5 * cos(fragmentUniforms.time * 0.6));

  let t = fragmentUniforms.time * SPEED;
  var p = (fragCoord.xy - fragmentUniforms.resolution.xy * 0.5)
    / fragmentUniforms.resolution.y;
  let n = value(fragCoord.xy, fragmentUniforms.time) * NOISE;

  //10 octaves of sine waves
  for (var i = 0.0; i<10.0; i+=1.0) {
    p = p * mat2x2<f32>(.6, -.8, .8, .6) / 0.75;
    p.x += WAVE * sin(p.y + t * .3 * (1. + i * .3))
        * (.2 + .15 * sin(t * .3 + i));
  }
  //Rotate and scale
  let v4 = vec4<f32>(0.0, 33.0, 11.0, 0.0);
  let angle = -0.5 + 0.3 * cos(t * 0.1 + v4.x + v4.y + v4.z + v4.w);

  let c = cos(angle);
  let s = sin(angle);
  let rotationMatrix = mat2x2<f32>(c, -s, s, c);
  p *= rotationMatrix * 3.0;

  //Value noise waves
  let v = DISTORT * value(p * 0.2 + t * 0.1, 0.0);
  //Shift down and add waves
  p.y -= 10.0 + v;

  //Background and foreground wave borders
  let b1 = (p.x + p.y) / 2.0 + cos(p.x / 2e1 + t * .5) *
      5.0 + v * 2.0 - 10.0;
  let b2 = min(p.y, (20.0 - p.y) / 1e2);

  //Wave edges cutoffs (with blurry edges)
  let edge1 = smoothstep(-BLUR, BLUR, b1 * 0.5);
  let edge2 = smoothstep(-BLUR - cos(p.x / 2e1 - t * .7) * BLUR * 0.8,
      0.0, b2);

  //Background hues with background waves
  let hue1 = p.x * 0.08 + edge1 * (8.0 / (8.0 + b1 * b1)) + PHASE;
  //Foreground wave hues
  let hue2 = hue1 + p.x * 0.02 + edge2 * (sin(sqrt(abs(b2) + 1.0))
  //Added distortion
      * (25.0 + DISTORT * 5.0 * cos(p.x * 0.6) * cos(p.y * 0.3) + n)) * 0.1;

  //Blend background
  let col = mix(BACK,
      //Wave colors
      mix(cos(hue1), cos(hue2), edge2
      //Translucency
      * (1.0 - (1.0 - 1.0 / (1.0 + p.y * p.y)) *
          (cos(t + (p.y) * (.2 + .1 * sin(t * .3))) * -0.5 + 0.5)))
      //Saturation
      , SAT);
  var color = vec4<f32>(pow(col, TINT), 1.0);
  return color;
}
