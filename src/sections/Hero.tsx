import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export default function Hero() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const noise3D = createNoise3D();

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Icosahedron
    const geometry = new THREE.IcosahedronGeometry(2.5, 1);
    const positions = geometry.attributes.position;
    const originalPositions = new Float32Array(positions.array);

    const material = new THREE.MeshBasicMaterial({
      color: 0x2e5bff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Rotate
      mesh.rotation.y += 0.004;
      mesh.rotation.x += 0.002;

      // Morph vertices with noise
      const posArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < posArray.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];

        const noise = noise3D(x * 0.3, y * 0.3 + elapsed * 0.0008, z * 0.3) * 0.15;

        posArray[i] = x + x * noise;
        posArray[i + 1] = y + y * noise;
        posArray[i + 2] = z + z * noise;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    sceneRef.current = { renderer, animationId: 0 };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* 3D Canvas */}
      <div
        ref={canvasRef}
        className="absolute right-0 top-0 w-full md:w-1/2 h-full z-0 opacity-40 md:opacity-100"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-32 md:py-0">
        <div className="max-w-full md:max-w-[50%]">
          <span className="inline-block text-[11px] font-bold text-bc-accent uppercase tracking-[0.15em] mb-6 opacity-0 animate-[fadeInUp_0.6s_0.2s_forwards]">
            AI-POWERED CONVERSATIONS
          </span>

          <h1 className="font-display text-[36px] md:text-[48px] lg:text-[64px] font-bold leading-[1.05] opacity-0 animate-[fadeInUp_1s_0.4s_forwards]">
            <span className="text-bc-text">Train Your Own</span>
            <br />
            <span className="text-bc-accent">AI Assistant</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-bc-text-secondary max-w-[480px] leading-relaxed opacity-0 animate-[fadeInUp_0.8s_0.6s_forwards]">
            Upload documents, connect your website, or paste text. Our AI learns
            your business in minutes and delivers instant, accurate answers to
            your customers 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mt-8 opacity-0 animate-[fadeInUp_0.6s_0.8s_forwards]">
            <Link to="/dashboard/create">
              <Button className="bg-bc-accent hover:bg-bc-accent-hover text-white text-base font-semibold px-8 py-6 rounded-[10px] transition-all duration-200 hover:shadow-glow-strong">
                Start Building Free
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-bc-border text-bc-text hover:bg-bc-accent/10 text-base font-medium px-8 py-6 rounded-[10px] gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-3 mt-12 opacity-0 animate-[fadeIn_0.5s_1s_forwards]">
            <span className="text-[13px] text-bc-text-muted">Powered by</span>
            {['GPT-4', 'Claude 3', 'Gemini'].map((model) => (
              <span
                key={model}
                className="text-[12px] font-medium text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-3 py-1"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-[fadeIn_0.5s_1.3s_forwards]">
        <ChevronDown className="w-6 h-6 text-bc-text-muted animate-bounce-slow" />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
