import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * EnergySphere — Three.js icosahedron with custom shader-driven
 * vertex displacement (noise) and fresnel rim glow. Looks like a
 * pulsing intelligent core.
 */
export default function EnergySphere() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Vertex displacement shader using 3D simplex-like noise
    const vertexShader = /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      uniform float uAmp;

      // Classic perlin-style noise (simplex-ish hash) for vertex distortion
      vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + 2.0*C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0*C.xxx;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m*m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        float n = snoise(position * 1.6 + uTime * 0.35);
        float n2 = snoise(position * 3.2 - uTime * 0.18);
        float displacement = (n * 0.18 + n2 * 0.08) * uAmp;
        vec3 newPosition = position + normal * displacement;
        vPosition = newPosition;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;

      void main() {
        // Fresnel rim
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);

        // Gradient mix along normal
        float mixA = smoothstep(-1.0, 1.0, vNormal.y);
        float mixB = smoothstep(-1.0, 1.0, vNormal.x);
        vec3 base = mix(uColorA, uColorB, mixA);
        base = mix(base, uColorC, mixB * 0.5);

        // Inner glow / pulsate
        float pulse = 0.5 + 0.5 * sin(uTime * 1.2);
        base += uColorC * pulse * 0.18;

        // Rim glow
        vec3 color = base + fresnel * uColorC * 1.6;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const geometry = new THREE.IcosahedronGeometry(1, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 1.0 },
        uColorA: { value: new THREE.Color("#0a1a3a") }, // deep blue
        uColorB: { value: new THREE.Color("#3a1a6a") }, // violet
        uColorC: { value: new THREE.Color("#00e5ff") }, // cyan
      },
      transparent: false,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Wireframe halo layer
    const wireGeo = new THREE.IcosahedronGeometry(1.18, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Outer glow sphere (soft)
    const glowGeo = new THREE.SphereGeometry(1.55, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        uColor: { value: new THREE.Color("#5a7bff") },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uColor;
        void main(){
          float intensity = pow(0.75 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.0);
          gl_FragColor = vec4(uColor, 1.0) * intensity * 0.9;
        }
      `,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // Particle ring around sphere
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.9 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x9d4cdd,
      size: 0.018,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting (subtle, mostly relies on shaders)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Mouse-based parallax
    let mx = 0,
      my = 0;
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      material.uniforms.uAmp.value = 0.85 + Math.sin(t * 0.8) * 0.18;

      sphere.rotation.y = t * 0.18;
      sphere.rotation.x = Math.sin(t * 0.25) * 0.15;
      wire.rotation.y = -t * 0.12;
      wire.rotation.x = Math.cos(t * 0.2) * 0.2;
      particles.rotation.y = t * 0.05;

      // Mouse parallax
      scene.rotation.y += (mx * 0.25 - scene.rotation.y) * 0.04;
      scene.rotation.x += (-my * 0.18 - scene.rotation.x) * 0.04;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="energy-sphere"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
