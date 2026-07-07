'use client';

import React, { useEffect, useRef } from 'react';

export default function AnimatedShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track mouse position
    const mouse = { x: -1000, y: -1000, active: false };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl instanceof WebGLRenderingContext) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initial resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // WebGL initialization
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let animationFrameId: number;

    const cleanupListeners = () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };

    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      // Fallback: Canvas 2D Calm Water Simulation
      initializeCanvas2DFallback(canvas);
      return cleanupListeners;
    }

    // WebGL Shader Source Code
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      void main() {
        // Normalize coordinates to [0, 1]
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // Scale and correct aspect ratio for drone view
        vec2 p = uv * 4.0;
        p.x *= u_resolution.x / u_resolution.y;
        
        // Mouse ripple interaction
        if (u_mouse.x > 0.0) {
          vec2 mouseUV = u_mouse / u_resolution.xy;
          mouseUV.x *= u_resolution.x / u_resolution.y;
          float d = distance(p, mouseUV * 4.0);
          if (d < 1.5) {
            float force = (1.5 - d) / 1.5;
            // Displace coordinates outwards to simulate waves
            p += normalize(p - mouseUV * 4.0) * sin(d * 10.0 - u_time * 2.5) * force * 0.08;
          }
        }

        float time = u_time * 0.15; // Slow, calm ocean ripple speed
        vec2 i = p;
        float c = 0.0;
        float inten = 0.0035; // Thin caustics lines
        float t = 0.0;

        // Unrolled 5 iterations of caustics calculation for absolute compatibility & safety
        
        // Iteration 1
        t = time * (1.0 - (2.5 / 1.0));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / (length(vec2(p.x / (sin(i.x + t) / inten + 0.0001), p.y / (cos(i.y + t) / inten + 0.0001))) + 0.005);

        // Iteration 2
        t = time * (1.0 - (2.5 / 2.0));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / (length(vec2(p.x / (sin(i.x + t) / inten + 0.0001), p.y / (cos(i.y + t) / inten + 0.0001))) + 0.005);

        // Iteration 3
        t = time * (1.0 - (2.5 / 3.0));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / (length(vec2(p.x / (sin(i.x + t) / inten + 0.0001), p.y / (cos(i.y + t) / inten + 0.0001))) + 0.005);

        // Iteration 4
        t = time * (1.0 - (2.5 / 4.0));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / (length(vec2(p.x / (sin(i.x + t) / inten + 0.0001), p.y / (cos(i.y + t) / inten + 0.0001))) + 0.005);

        // Iteration 5
        t = time * (1.0 - (2.5 / 5.0));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / (length(vec2(p.x / (sin(i.x + t) / inten + 0.0001), p.y / (cos(i.y + t) / inten + 0.0001))) + 0.005);

        c /= 5.0;
        
        // Prevent negative values before power functions (causes NaN / black screen on some GPUs)
        c = 1.17 - pow(max(0.0, c), 1.4);

        // Make the caustics thin and sharp
        float caustic = pow(max(0.0, c), 8.0);
        
        // Soft depth bloom for a liquid refraction glow
        float bloom = pow(max(0.0, c), 2.0) * 0.08;

        // Faint deep blue sea undertone (blends beautifully with page bg-zinc-950)
        vec3 deepBlue = vec3(0.01, 0.03, 0.06); 
        
        // Soft white ripples (with a tiny touch of cool cyan/blue for realism)
        vec3 rippleColor = vec3(0.9, 0.96, 1.0);
        
        // Combine components
        vec3 finalRGB = deepBlue + rippleColor * caustic * 0.35 + rippleColor * bloom * 0.15;
        float alpha = clamp(caustic * 0.25 + bloom * 0.15, 0.0, 0.5);

        gl_FragColor = vec4(finalRGB, alpha);
      }
    `;

    const createShader = (glContext: WebGLRenderingContext, type: number, source: string) => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader compile error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!program || !vs || !fs) {
      console.warn('WebGL Shader compilation failed. Falling back to Canvas 2D.');
      initializeCanvas2DFallback(canvas);
      return cleanupListeners;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('WebGL Program linking failed. Falling back to Canvas 2D.');
      initializeCanvas2DFallback(canvas);
      return cleanupListeners;
    }

    // Geometry buffer for a full-screen quad (2 triangles)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    gl.viewport(0, 0, canvas.width, canvas.height);
    const startTime = Date.now();

    const render = () => {
      if (!canvas || !gl) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);
      
      if (mouse.active) {
        // Convert to WebGL bottom-left origin coordinates
        gl.uniform2f(mouseLocation, mouse.x, canvas.height - mouse.y);
      } else {
        gl.uniform2f(mouseLocation, -1000, -1000);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cleanupListeners();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };

    // Canvas 2D Fallback: organic waving lines
    function initializeCanvas2DFallback(fallbackCanvas: HTMLCanvasElement) {
      const ctx2d = fallbackCanvas.getContext('2d');
      if (!ctx2d) return;

      let time2d = 0;

      const render2d = () => {
        if (!fallbackCanvas || !ctx2d) return;
        ctx2d.clearRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);

        ctx2d.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx2d.lineWidth = 1;
        time2d += 0.006;

        const gap = 50;
        for (let y = 0; y < fallbackCanvas.height + gap; y += gap) {
          ctx2d.beginPath();
          for (let x = 0; x < fallbackCanvas.width + 10; x += 15) {
            const offset = 
              Math.sin(x * 0.008 + time2d + y * 0.02) * 12 + 
              Math.cos(x * 0.015 - time2d * 1.3 + y * 0.01) * 6;
            
            if (x === 0) {
              ctx2d.moveTo(x, y + offset);
            } else {
              ctx2d.lineTo(x, y + offset);
            }
          }
          ctx2d.stroke();
        }

        animationFrameId = requestAnimationFrame(render2d);
      };

      render2d();
    }
  }, []);

  return (
    <canvas
      id="background-shader"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
