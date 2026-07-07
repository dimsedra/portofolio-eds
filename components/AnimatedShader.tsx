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
        
        // Scale and center coordinates for drone view
        vec2 p = uv * 6.0 - vec2(3.0);
        p.x *= u_resolution.x / u_resolution.y;
        
        // Mouse ripple interaction
        if (u_mouse.x > 0.0) {
          vec2 mouseUV = u_mouse / u_resolution.xy;
          mouseUV = mouseUV * 6.0 - vec2(3.0);
          mouseUV.x *= u_resolution.x / u_resolution.y;
          float d = distance(p, mouseUV);
          if (d < 2.0) {
            float force = (2.0 - d) / 2.0;
            // Displace coordinates outward to simulate waves
            p += normalize(p - mouseUV) * sin(d * 8.0 - u_time * 4.0) * force * 0.18;
          }
        }

        float time = u_time * 0.6; // Gentle ocean wave speed
        
        // Create organic wave interference using multiple layered sine waves
        float wave = 0.0;
        wave += sin(p.x * 2.0 + time) * 0.45;
        wave += sin(p.y * 1.6 - time * 0.8) * 0.45;
        wave += sin((p.x + p.y) * 1.1 + time * 1.3) * 0.3;
        wave += cos((p.x - p.y) * 2.2 - time * 0.6) * 0.2;
        
        // Invert and sharpen the absolute value of the wave to get thin white caustic lines
        float ripple = sin(wave * 9.0);
        ripple = abs(ripple);
        ripple = pow(1.0 - ripple, 5.0); // Higher power makes lines thinner and sharper

        // Base zinc-950 background color (#09090b)
        vec3 baseBg = vec3(0.035, 0.035, 0.043); 
        
        // Pure cool-white ripple color
        vec3 rippleColor = vec3(0.9, 0.95, 1.0);
        
        // Mix base background with white ripples based on the calculated caustic intensity
        // Ripple intensity is scaled down to 0.08 (8%) to keep background subtle and ensure text readability
        vec3 finalRGB = mix(baseBg, rippleColor, ripple * 0.08);

        gl_FragColor = vec4(finalRGB, 1.0);
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

        // Draw opaque dark background (#09090b)
        ctx2d.fillStyle = '#09090b';
        ctx2d.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);

        ctx2d.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx2d.lineWidth = 1.5;
        time2d += 0.015;

        const gap = 50;
        for (let y = -gap; y < fallbackCanvas.height + gap; y += gap) {
          ctx2d.beginPath();
          for (let x = 0; x < fallbackCanvas.width + 20; x += 20) {
            const waveValue = 
              Math.sin(x * 0.005 + time2d + y * 0.01) * 0.5 + 
              Math.sin(y * 0.008 - time2d * 0.8) * 0.5;
            
            const offset = Math.sin(waveValue * 8.0) * 15;
            
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
    />
  );
}
