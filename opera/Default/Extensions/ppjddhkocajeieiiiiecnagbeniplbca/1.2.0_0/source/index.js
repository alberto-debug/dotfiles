import * as Animation from './animation.js';
import * as Common from './common.js';

const defaultColor = {
  r: 0.97,
  g: 0.9,
  b: 0.82,
  a: 1.0,
};
const defaultPicker = {x: 0.5, y: 0.5};

let canAnimate = true;
let setAnimationStateBound = null;

let themeConfigurationData = null;

function getDefaultFragmentData() {
  const resolution = Common.getResolution([
    window.innerWidth,
    window.innerHeight,
  ]);
  const animationTime = Animation.getAnimationTime() / 1000.0;
  const padding = 0.0;

  const fragmentData = new Float32Array([
    defaultColor.r,
    defaultColor.g,
    defaultColor.b,
    defaultColor.a,
    animationTime,
    padding,
    defaultPicker.x,
    defaultPicker.y,
    resolution[0],
    resolution[1],
    padding,
    padding,
  ]);
  return fragmentData;
}

async function getUpdatedData() {
  await updateData();
  return themeConfigurationData;
}

function updateFragmentUniformData(context) {
  if (!themeConfigurationData) {
    return getDefaultFragmentData();
  }

  const colorhsl = themeConfigurationData.colors.background;
  const picker = [
    themeConfigurationData.colorPickerX, themeConfigurationData.colorPickerY,
  ];
  const resolution = Common.getResolution([
    context.canvas.width,
    context.canvas.height,
  ]);

  const rgb = Common.hslToRgb(colorhsl[0], colorhsl[1], colorhsl[2]);
  const color = [rgb[0], rgb[1], rgb[2], 1.0];
  const animationTime = Animation.getAnimationTime() / 1000.0;
  const padding = 0.0;

  const fragmentData = new Float32Array([
    color[0],
    color[1],
    color[2],
    color[3],
    animationTime,
    padding,
    picker[0],
    picker[1],
    resolution[0],
    resolution[1],
    padding,
    padding,
  ]);
  return fragmentData;
}

function frame(
  device,
  context,
  pipeline,
  vertexBuffer,
  fragmentUniformBuffer,
  lastRenderTime,
) {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastRenderTime;
  if (deltaTime < Common.targetFrameDuration) {
    const id = requestAnimationFrame(() =>
      frame(
        device,
        context,
        pipeline,
        vertexBuffer,
        fragmentUniformBuffer,
        lastRenderTime,
      ),
    );
    Animation.setAnimationFrameId(id);
    return;
  }
  const fragmentData = updateFragmentUniformData(context);
  Common.render(
    device,
    context,
    pipeline,
    vertexBuffer,
    fragmentUniformBuffer,
    fragmentData,
  );

  if (!Animation.wallpaperAnimated) {
    return;
  }

  const id = requestAnimationFrame(() =>
    frame(
      device,
      context,
      pipeline,
      vertexBuffer,
      fragmentUniformBuffer,
      currentTime,
    ),
  );
  Animation.setAnimationFrameId(id);
}

function shouldChangeConfigData(newData, oldData) {
  if (!oldData) {
    return true;
  }
  const wallpaperAnimatedChanged =
    newData?.wallpaperAnimated !== oldData?.wallpaperAnimated;

  const colorPickerChanged =
    newData?.colorPickerX !== oldData?.colorPickerX ||
    newData?.colorPickerY !== oldData?.colorPickerY;

  return wallpaperAnimatedChanged || colorPickerChanged;
}

async function updateData() {
  const config = await opr.vibesPrivate.getCurrentlyAppliedVibeConfiguration();
  const data = config?.data;

  if (!shouldChangeConfigData(data, themeConfigurationData)) {
    return false;
  }

  themeConfigurationData = data;
  return true;
}

async function ensureWindowSize() {
  const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
  while (window.innerWidth <= 0 || window.innerHeight <= 0) {
    await sleep(200);
  }
}

async function main() {
  try {
    Common.validateWebGPUSupport();
    const device = await Common.requestDevice();
    const context = Common.configureContext(device, Common.swapChainFormat);

    const vertexShaderSource = await Common.loadShader('./shaders/vert.wgsl');
    const fragmentShaderSource = await Common.loadShader('./shaders/frag.wgsl');

    const vertexBuffer = Common.createVertexBuffer(
      device,
      Common.rectangleVertices,
    );
    const fragmentUniformBuffer = Common.createFragmentUniformBuffer(
      device,
      getDefaultFragmentData(),
    );
    const pipeline = Common.createRenderPipeline(
      device,
      Common.swapChainFormat,
      vertexShaderSource,
      fragmentShaderSource,
    );

    if (!themeConfigurationData) {
      await updateData();
    }

    await ensureWindowSize();

    Common.setupCanvas(
      Common.canvasId,
      device,
      context,
      pipeline,
      vertexBuffer,
      fragmentUniformBuffer,
      updateFragmentUniformData,
    );

    const dataUpdated = await updateData();
    if (dataUpdated) {
      Animation.updateAnimation(
        device,
        context,
        pipeline,
        vertexBuffer,
        fragmentUniformBuffer,
        frame,
        themeConfigurationData,
      );
    }

    setAnimationStateBound = Animation.setAnimationState.bind(
        null,
        device,
        context,
        pipeline,
        vertexBuffer,
        fragmentUniformBuffer,
        frame,
        getUpdatedData,
    );
    setAnimationStateBound(canAnimate);

    opr.vibesPrivate.onAppliedVibeConfigurationChanged.addListener(async () => {
      const dataUpdated = await updateData();
      if (dataUpdated) {
        Animation.updateAnimation(
          device,
          context,
          pipeline,
          vertexBuffer,
          fragmentUniformBuffer,
          frame,
          themeConfigurationData,
        );
      }
    });
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}

main();

window.startAnimating = () => {
  canAnimate = true;
  if (setAnimationStateBound) {
    setAnimationStateBound(true);
  }
};

window.stopAnimating = () => {
  canAnimate = false;
  if (setAnimationStateBound) {
    setAnimationStateBound(false);
  }
};
