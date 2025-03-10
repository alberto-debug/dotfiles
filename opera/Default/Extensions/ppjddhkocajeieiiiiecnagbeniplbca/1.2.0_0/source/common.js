export const canvasId = 'gpuCanvas';
export const swapChainFormat = 'bgra8unorm';
export const hdres = [1280, 720];

const targetFPS = 30;
export const targetFrameDuration = 1000 / targetFPS;
export const clearColor = {
  r: 0.0,
  g: 0.0,
  b: 0.0,
  a: 1.0,
};

export const rectangleVertices = [
  {x: -1.0, y: 1.0},
  {x: -1.0, y: -1.0},
  {x: 1.0, y: 1.0},
  {x: 1.0, y: 1.0},
  {x: -1.0, y: -1.0},
  {x: 1.0, y: -1.0},
];

export function validateWebGPUSupport() {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported on this browser.');
  }
}

export async function requestDevice() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  return device;
}

export function configureContext(device, format) {
  const canvas = document.getElementById(canvasId);
  const context = canvas.getContext('webgpu');
  context.configure({
    device: device,
    format: format,
  });
  return context;
}

export function setupCanvas(
  id,
  device,
  context,
  pipeline,
  vertexBuffer,
  fragmentUniformBuffer,
  getFragmentDataCallback,
) {
  const canvas = document.getElementById(id);

  function resizeCanvas() {
    const resolution = getResolution([window.innerWidth, window.innerHeight]);
    console.assert(resolution[0] > 0 && resolution[1] > 0);
    canvas.width = resolution[0];
    canvas.height = resolution[1];
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.transform = 'rotate(180deg) scaleX(-1)';
    let fragmentData = getFragmentDataCallback(context);
    render(
      device,
      context,
      pipeline,
      vertexBuffer,
      fragmentUniformBuffer,
      fragmentData,
    );
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

export async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

export function createVertexBuffer(device, vertices) {
  const vertexData = new Float32Array(vertices.flatMap(v => [v.x, v.y]));
  const vertexBuffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(vertexBuffer, 0, vertexData.buffer);
  return vertexBuffer;
}

export function createFragmentUniformBuffer(device, fragmentData) {
  const fragmentUniformBuffer = device.createBuffer({
    size: fragmentData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(fragmentUniformBuffer, 0, fragmentData.buffer);
  return fragmentUniformBuffer;
}

export function createRenderPipeline(
  device,
  format,
  vertexShaderSource,
  fragmentShaderSource,
) {
  const vertexShaderModule = device.createShaderModule({
    code: vertexShaderSource,
  });
  const fragmentShaderModule = device.createShaderModule({
    code: fragmentShaderSource,
  });

  return device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: vertexShaderModule,
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 8,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2',
            },
          ],
        },
      ],
    },
    fragment: {
      module: fragmentShaderModule,
      entryPoint: 'main',
      targets: [
        {
          format: format,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });
}

export function render(
  device,
  context,
  pipeline,
  vertexBuffer,
  fragmentUniformBuffer,
  fragmentData,
) {
  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();

  device.queue.writeBuffer(fragmentUniformBuffer, 0, fragmentData.buffer);

  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: textureView,
        loadOp: 'clear',
        clearValue: clearColor,
        storeOp: 'store',
      },
    ],
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.setBindGroup(
    0,
    device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: fragmentUniformBuffer,
          },
        },
      ],
    }),
  );
  const vertices = 6;
  const instances = 1;
  const vertexOffset = 0;
  const instanceOffset = 0;

  passEncoder.draw(vertices, instances, vertexOffset, instanceOffset);
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
}

export function getResolution(resolution) {
  const maxPixels = hdres[0] * hdres[1];

  let width = resolution[0];
  let height = resolution[1];

  if (width * height > maxPixels) {
    const aspectRatio = width / height;
    const scaledWidth = Math.sqrt(maxPixels * aspectRatio);
    const scaledHeight = Math.sqrt(maxPixels / aspectRatio);

    if (scaledWidth > hdres[0]) {
      width = hdres[0];
      height = Math.round(hdres[0] / aspectRatio);
    } else if (scaledHeight > hdres[1]) {
      height = hdres[1];
      width = Math.round(hdres[1] * aspectRatio);
    } else {
      width = Math.round(scaledWidth);
      height = Math.round(scaledHeight);
    }
  }

  return [width, height];
}

export function hslToRgb(h, s, l) {
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = r + m;
  g = g + m;
  b = b + m;

  return [r, g, b];
}
