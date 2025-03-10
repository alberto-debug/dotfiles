let startAnimationTime = 0;
let stopAnimationTime = 0;
let canAnimate = null;
let animationTime = 0;
let animationFrameId = null;

export let wallpaperAnimated = true;

function startAnimationTimer() {
  if (wallpaperAnimated) {
    return;
  }
  startAnimationTime = performance.now();
  wallpaperAnimated = true;
}

function stopAnimationTimer() {
  if (!wallpaperAnimated) {
    return;
  }
  stopAnimationTime = performance.now();
  animationTime += stopAnimationTime - startAnimationTime;
  wallpaperAnimated = false;
}

export function setAnimationFrameId(id) {
  animationFrameId = id;
}

export function getAnimationTime() {
  return wallpaperAnimated ?
      animationTime + (performance.now() - startAnimationTime) :
      animationTime;
}

export async function updateAnimation(
    device,
    context,
    pipeline,
    vertexBuffer,
    fragmentUniformBuffer,
    frameCallback,
    data,
) {
  const animating = canAnimate && (data?.wallpaperAnimated ?? false);

  if (animating) {
    startAnimationTimer();
  } else {
    stopAnimationTimer();
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  frameCallback(
      device,
      context,
      pipeline,
      vertexBuffer,
      fragmentUniformBuffer,
      performance.now(),
  );
}

export async function setAnimationState(
    device, context, pipeline, vertexBuffer, fragmentUniformBuffer,
    frameCallback, getDataCallback, animating) {
  if (canAnimate === animating) {
    return;
  }
  canAnimate = animating;
  const data = await getDataCallback();
  updateAnimation(
      device, context, pipeline, vertexBuffer, fragmentUniformBuffer,
      frameCallback, data);
}
