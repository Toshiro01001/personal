import{a as m}from"./parte-2TUX3VHC.js";var we=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`;var ye=1920*1080*4,K=class{constructor(t,i,o,s,r=0,n=0,a=2,l=ye,c=[]){m(this,"parentElement");m(this,"canvasElement");m(this,"gl");m(this,"program",null);m(this,"uniformLocations",{});m(this,"fragmentShader");m(this,"rafId",null);m(this,"lastRenderTime",0);m(this,"currentFrame",0);m(this,"speed",0);m(this,"currentSpeed",0);m(this,"providedUniforms");m(this,"mipmaps",[]);m(this,"hasBeenDisposed",!1);m(this,"resolutionChanged",!0);m(this,"textures",new Map);m(this,"minPixelRatio");m(this,"maxPixelCount");m(this,"isSafari",Ke());m(this,"uniformCache",{});m(this,"textureUnitMap",new Map);m(this,"ownerDocument");m(this,"initProgram",()=>{let t=je(this.gl,we,this.fragmentShader);t&&(this.program=t)});m(this,"setupPositionAttribute",()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),i=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,i);let o=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(o),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)});m(this,"setupUniforms",()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([i,o])=>{if(t[i]=this.gl.getUniformLocation(this.program,i),o instanceof HTMLImageElement){let s=`${i}AspectRatio`;t[s]=this.gl.getUniformLocation(this.program,s)}}),this.uniformLocations=t});m(this,"renderScale",1);m(this,"parentWidth",0);m(this,"parentHeight",0);m(this,"parentDevicePixelWidth",0);m(this,"parentDevicePixelHeight",0);m(this,"devicePixelsSupported",!1);m(this,"intersectionObserver",null);m(this,"isInViewport",!0);m(this,"resizeObserver",null);m(this,"setupResizeObserver",()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let i=t.devicePixelContentBoxSize?.[0];i!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=i.inlineSize,this.parentDevicePixelHeight=i.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)});m(this,"setupIntersectionObserver",()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([i])=>{this.isInViewport=i?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))});m(this,"handleVisualViewportChange",()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()});m(this,"handleResize",()=>{let t=0,i=0,o=Math.max(1,window.devicePixelRatio),s=visualViewport?.scale??1;if(this.devicePixelsSupported){let h=Math.max(1,this.minPixelRatio/o);t=this.parentDevicePixelWidth*h*s,i=this.parentDevicePixelHeight*h*s}else{let h=Math.max(o,this.minPixelRatio)*s;if(this.isSafari){let p=Je(this.ownerDocument);h*=Math.max(1,p)}t=Math.round(this.parentWidth)*h,i=Math.round(this.parentHeight)*h}let r=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*i),n=Math.min(1,r),a=Math.round(t*n),l=Math.round(i*n),c=a/Math.round(this.parentWidth);(this.canvasElement.width!==a||this.canvasElement.height!==l||this.renderScale!==c)&&(this.renderScale=c,this.canvasElement.width=a,this.canvasElement.height=l,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))});m(this,"render",t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let i=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=i*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null});m(this,"requestRender",()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)});m(this,"setTextureUniform",(t,i)=>{if(!i.complete||i.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let o=this.textures.get(t);o&&this.gl.deleteTexture(o),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let s=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+s);let r=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,r),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,i),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let n=this.gl.getError();if(n!==this.gl.NO_ERROR||r===null){console.error("Paper Shaders: WebGL error when uploading texture:",n);return}this.textures.set(t,r);let a=this.uniformLocations[t];if(a){this.gl.uniform1i(a,s);let l=`${t}AspectRatio`,c=this.uniformLocations[l];if(c){let h=i.naturalWidth/i.naturalHeight;this.gl.uniform1f(c,h)}}});m(this,"areUniformValuesEqual",(t,i)=>t===i?!0:Array.isArray(t)&&Array.isArray(i)&&t.length===i.length?t.every((o,s)=>this.areUniformValuesEqual(o,i[s])):!1);m(this,"setUniformValues",t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([i,o])=>{let s=o;if(o instanceof HTMLImageElement&&(s=`${o.src.slice(0,200)}|${o.naturalWidth}x${o.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[i],s))return;this.uniformCache[i]=s;let r=this.uniformLocations[i];if(!r){console.warn(`Uniform location for ${i} not found`);return}if(o instanceof HTMLImageElement)this.setTextureUniform(i,o);else if(Array.isArray(o)){let n=null,a=null;if(o[0]!==void 0&&Array.isArray(o[0])){let l=o[0].length;if(o.every(c=>c.length===l))n=o.flat(),a=l;else{console.warn(`All child arrays must be the same length for ${i}`);return}}else n=o,a=n.length;switch(a){case 2:this.gl.uniform2fv(r,n);break;case 3:this.gl.uniform3fv(r,n);break;case 4:this.gl.uniform4fv(r,n);break;case 9:this.gl.uniformMatrix3fv(r,!1,n);break;case 16:this.gl.uniformMatrix4fv(r,!1,n);break;default:console.warn(`Unsupported uniform array length: ${a}`)}}else typeof o=="number"?this.gl.uniform1f(r,o):typeof o=="boolean"?this.gl.uniform1i(r,o?1:0):console.warn(`Unsupported uniform type for ${i}: ${typeof o}`)})});m(this,"getCurrentFrame",()=>this.currentFrame);m(this,"setFrame",t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())});m(this,"setSpeed",(t=1)=>{this.speed=t,this.updateCurrentSpeed()});m(this,"updateCurrentSpeed",()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)});m(this,"setCurrentSpeed",t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)});m(this,"setMaxPixelCount",(t=ye)=>{this.maxPixelCount=t,this.handleResize()});m(this,"setMinPixelRatio",(t=2)=>{this.minPixelRatio=t,this.handleResize()});m(this,"setUniforms",t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())});m(this,"handleDocumentVisibilityChange",()=>{this.updateCurrentSpeed()});m(this,"dispose",()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount});if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");this.ownerDocument=t.ownerDocument,this.ownerDocument.querySelector("style[data-paper-shader]")||this.ownerDocument.createElement("style").setAttribute("data-paper-shader","");let h=this.ownerDocument.createElement("canvas");this.canvasElement=h,this.parentElement.prepend(h),this.fragmentShader=i,this.providedUniforms=o,this.mipmaps=c,this.currentFrame=n,this.minPixelRatio=a,this.maxPixelCount=l;let p=h.getContext("webgl2",s);if(!p)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=p,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(r),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}};function Se(e,t,i){let o=e.createShader(t);return o?(e.shaderSource(o,i),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(o)),e.deleteShader(o),null)):null}function je(e,t,i){let o=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),s=o?o.precision:null;s&&s<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let r=Se(e,e.VERTEX_SHADER,t),n=Se(e,e.FRAGMENT_SHADER,i);if(!r||!n)return null;let a=e.createProgram();return a?(e.attachShader(a,r),e.attachShader(a,n),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?(e.detachShader(a,r),e.detachShader(a,n),e.deleteShader(r),e.deleteShader(n),a):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(a)),e.deleteProgram(a),e.deleteShader(r),e.deleteShader(n),null)):null}function Ke(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function Je(e){let t=visualViewport?.scale??1,i=visualViewport?.width??window.innerWidth,o=window.innerWidth-e.documentElement.clientWidth,s=t*i+o,r=outerWidth/s,n=Math.round(100*r);return n%5===0?n/100:n===33?1/3:n===67?2/3:n===133?4/3:r}var re={none:0,contain:1,cover:2};var Re=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,Me=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var Ee=`
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`,Be=`
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;var ae=`#version 300 es
precision mediump float;

uniform sampler2D u_image;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;

uniform float u_shape;
uniform bool u_isImage;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_imageUV;

out vec4 fragColor;

${Re}
${Me}
${Be}

float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {

  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  if (u_isImage == true) {
    bump = smoothstep(.2, .8, bump);
  }
  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  // Tint color is applied with color burn blending
  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;

  return sum / norm;
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  if (u_isImage == false) {
    uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
  }

  float cycleWidth = u_repetition;
  float edge = 0.;
  float contOffset = 1.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  // u_contour is applied in 2 separate ranges:
  // - 0 to .4 sets the edge hardness, saturated above .4 (both branches below)
  // - .5 to 1 warps the stripes direction along the edges, inactive below .5 (see u_contour range 2)
  if (u_isImage == true) {
    float edgeRaw = img.r;
    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);
    edge = pow(edge, 1.6);
    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));
  } else {
    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);

      uv = v_responsiveUV;
      if (ratio > 1.) {
        uv.y /= ratio;
      } else {
        uv.x *= ratio;
      }
      uv += .5;
      uv.y = 1. - uv.y;

      cycleWidth *= 2.;
      contOffset = 1.5;

    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * t));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;

      uv *= .8;
      cycleWidth *= 1.6;

    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  }

  float opacity = 0.;
  if (u_isImage == true) {
    opacity = img.g;
    float frame = getImgFrame(v_imageUV, 0.);
    opacity *= frame;
  } else {
    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    if (u_shape < 2.) {
      edge = 1.2 * edge;
    } else if (u_shape < 5.) {
      edge = 1.8 * pow(edge, 1.5);
    }
  }

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);


  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  // u_contour range 2
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;


  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = 0.;
  float rExtraBlur = 0.;
  float gExtraBlur = 0.;
  if (u_isImage == true) {
    float softness = 0.05 * u_softness;
    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);
    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));
    blur += smallCanvasT * smoothstep(.0, 1., edge);
    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);
    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));
  } else {
    blur = u_softness / 15. + .3 * contour;
  }

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${Ee}

  fragColor = vec4(color, opacity);
}
`,J={measurePerformance:!1,workingSize:256,iterations:40};function ne(e){let t=document.createElement("canvas"),i=t.getContext("2d"),o=typeof e=="string"&&e.startsWith("blob:");return new Promise((s,r)=>{if(!e||!i){r(new Error("Invalid file or canvas context"));return}let n=o&&fetch(e).then(c=>c.headers.get("Content-Type")),a=new Image;a.crossOrigin="anonymous";let l=performance.now();a.onload=async()=>{let c,h=await n;h?c=h==="image/svg+xml":typeof e=="string"?c=e.endsWith(".svg")||e.startsWith("data:image/svg+xml"):c=e.type==="image/svg+xml";let p=a.width||a.naturalWidth,f=a.height||a.naturalHeight;if(c){let b=p/f;p>f?(p=4096,f=4096/b):(f=4096,p=4096*b),a.width=p,a.height=f}let R=Math.min(p,f),v=J.workingSize/R,u=Math.round(p*v),d=Math.round(f*v);J.measurePerformance&&(console.log("[Processing Mode]"),console.log(`  Original: ${p}\xD7${f}`),console.log(`  Working: ${u}\xD7${d} (${(v*100).toFixed(1)}% scale)`),v<1&&console.log(`  Speedup: ~${Math.round(1/(v*v))}\xD7`)),t.width=p,t.height=f;let _=document.createElement("canvas");_.width=u,_.height=d;let M=_.getContext("2d");M.drawImage(a,0,0,u,d);let F=performance.now(),S=M.getImageData(0,0,u,d).data,k=new Uint8Array(u*d),Q=new Uint8Array(u*d),T=0;for(let g=0,b=0;g<S.length;g+=4,b++){let y=S[g+3]===0?0:1;k[b]=y,T+=y}let z=[],C=[];for(let g=0;g<d;g++)for(let b=0;b<u;b++){let x=g*u+b;if(!k[x])continue;let y=!1;b===0||b===u-1||g===0||g===d-1?y=!0:y=!k[x-1]||!k[x+1]||!k[x-u]||!k[x+u]||!k[x-u-1]||!k[x-u+1]||!k[x+u-1]||!k[x+u+1],y?(Q[x]=1,z.push(x)):C.push(x)}J.measurePerformance&&(console.log(`[Mask Building] Time: ${(performance.now()-F).toFixed(2)}ms`),console.log(`  Shape pixels: ${T} / ${u*d} (${(T/(u*d)*100).toFixed(1)}%)`),console.log(`  Interior pixels: ${C.length}`),console.log(`  Boundary pixels: ${z.length}`));let Y=Ze(k,Q,new Uint32Array(C),new Uint32Array(z),u,d),A=performance.now(),E=Qe(Y,k,Q,u,d);J.measurePerformance&&console.log(`[Poisson Solve] Time: ${(performance.now()-A).toFixed(2)}ms`);let O=0,j;for(let g=0;g<C.length;g++){let b=C[g];E[b]>O&&(O=E[b])}let G=document.createElement("canvas");G.width=u,G.height=d;let D=G.getContext("2d"),U=D.createImageData(u,d);for(let g=0;g<d;g++)for(let b=0;b<u;b++){let x=g*u+b,y=x*4;if(!k[x])U.data[y]=255,U.data[y+1]=255,U.data[y+2]=255,U.data[y+3]=0;else{let H=255*(1-E[x]/O);U.data[y]=H,U.data[y+1]=H,U.data[y+2]=H,U.data[y+3]=255}}D.putImageData(U,0,0),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(G,0,0,u,d,0,0,p,f);let P=i.getImageData(0,0,p,f),I=document.createElement("canvas");I.width=p,I.height=f;let W=I.getContext("2d");W.drawImage(a,0,0,p,f);let q=W.getImageData(0,0,p,f);for(let g=0;g<P.data.length;g+=4){let b=q.data[g+3],x=P.data[g+3];b===0?(P.data[g]=255,P.data[g+1]=0):(P.data[g]=x===0?0:P.data[g],P.data[g+1]=b),P.data[g+2]=255,P.data[g+3]=255}i.putImageData(P,0,0),j=P,t.toBlob(g=>{if(!g){r(new Error("Failed to create PNG blob"));return}if(J.measurePerformance){let b=performance.now()-l;if(console.log(`[Total Processing Time] ${b.toFixed(2)}ms`),v<1){let x=b*Math.pow(p*f/(u*d),1.5);console.log(`[Estimated time at full resolution] ~${x.toFixed(0)}ms`),console.log(`[Time saved] ~${(x-b).toFixed(0)}ms (${Math.round(x/b)}\xD7 faster)`)}}s({imageData:j,pngBlob:g})},"image/png")},a.onerror=()=>r(new Error("Failed to load image")),a.src=typeof e=="string"?e:URL.createObjectURL(e)})}function Ze(e,t,i,o,s,r){let n=i.length,a=new Int32Array(n*4);for(let l=0;l<n;l++){let c=i[l],h=c%s,p=Math.floor(c/s);a[l*4+0]=h<s-1&&e[c+1]?c+1:-1,a[l*4+1]=h>0&&e[c-1]?c-1:-1,a[l*4+2]=p>0&&e[c-s]?c-s:-1,a[l*4+3]=p<r-1&&e[c+s]?c+s:-1}return{interiorPixels:i,boundaryPixels:o,pixelCount:n,neighborIndices:a}}function Qe(e,t,i,o,s){let r=J.iterations,n=.01,a=new Float32Array(o*s),{interiorPixels:l,neighborIndices:c,pixelCount:h}=e,p=performance.now(),f=1.9,R=[],w=[];for(let v=0;v<h;v++){let u=l[v],d=u%o,_=Math.floor(u/o);(d+_)%2===0?R.push(v):w.push(v)}for(let v=0;v<r;v++){for(let u of R){let d=l[u],_=c[u*4+0],M=c[u*4+1],F=c[u*4+2],L=c[u*4+3],S=0;_>=0&&(S+=a[_]),M>=0&&(S+=a[M]),F>=0&&(S+=a[F]),L>=0&&(S+=a[L]);let k=(n+S)/4;a[d]=f*k+(1-f)*a[d]}for(let u of w){let d=l[u],_=c[u*4+0],M=c[u*4+1],F=c[u*4+2],L=c[u*4+3],S=0;_>=0&&(S+=a[_]),M>=0&&(S+=a[M]),F>=0&&(S+=a[F]),L>=0&&(S+=a[L]);let k=(n+S)/4;a[d]=f*k+(1-f)*a[d]}}if(J.measurePerformance){let v=performance.now()-p;console.log(`[Optimized Poisson Solver (SOR \u03C9=${f})]`),console.log(`  Working size: ${o}\xD7${s}`),console.log(`  Iterations: ${r}`),console.log(`  Time: ${v.toFixed(2)}ms`),console.log(`  Interior pixels processed: ${h}`),console.log(`  Speed: ${(r*h/(v*1e3)).toFixed(2)} Mpixels/sec`)}return a}var se={none:0,circle:1,daisy:2,diamond:3,metaballs:4};function Z(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:oe;if(typeof e!="string")return oe;let t,i,o,s=1;if(e.startsWith("#"))[t,i,o,s]=et(e);else if(e.startsWith("rgb")){let r=tt(e);if(r===null)return oe;[t,i,o,s]=r}else if(e.startsWith("hsl")){let r=ot(e);if(r===null)return oe;[t,i,o,s]=it(r)}else return console.error("Unsupported color format",e),oe;return[ce(t,0,1),ce(i,0,1),ce(o,0,1),ce(s,0,1)]}function et(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(r=>r+r).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),oe;let t=parseInt(e.slice(0,2),16)/255,i=parseInt(e.slice(2,4),16)/255,o=parseInt(e.slice(4,6),16)/255,s=parseInt(e.slice(6,8),16)/255;return[t,i,o,s]}function tt(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function ot(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function it(e){let[t,i,o,s]=e,r=t/360,n=i/100,a=o/100,l,c,h;if(i===0)l=c=h=a;else{let p=(w,v,u)=>(u<0&&(u+=1),u>1&&(u-=1),u<.16666666666666666?w+(v-w)*6*u:u<.5?v:u<.6666666666666666?w+(v-w)*(.6666666666666666-u)*6:w),f=a<.5?a*(1+n):a+n-a*n,R=2*a-f;l=p(R,f,r+1/3),c=p(R,f,r),h=p(R,f,r-1/3)}return[l,c,h,s]}var ce=(e,t,i)=>Math.min(Math.max(e,t),i),oe=[.5,.5,.5,1];var V={font:"800 condensed 400px Archivo, 'Helvetica Neue', Arial, sans-serif",letterSpacing:-6,tint:"#dcecff",repetition:1.6,softness:.1,shiftRed:.12,shiftBlue:.34,distortion:.07,contour:.3,angle:70,speed:1},ge=80;async function rt(e){await document.fonts.load(V.font);let t=document.createElement("canvas").getContext("2d");return t.font=V.font,t.letterSpacing=`${V.letterSpacing}px`,{w:Math.ceil(t.measureText(e).width)+ge*2,h:400+ge*2}}async function at(e){let t=await rt(e),i=document.createElement("canvas");i.width=t.w,i.height=t.h;let o=i.getContext("2d");return o.font=V.font,o.letterSpacing=`${V.letterSpacing}px`,o.fillStyle="#fff",o.textBaseline="middle",o.fillText(e,ge,i.height/2+14),new Promise((s,r)=>i.toBlob(n=>n?s(n):r(new Error("cromo: m\xE1scara vazia")),"image/png"))}var le=new Map;function nt(e,t){if(t)return le.get(t)||le.set(t,(async()=>{let o=new Image;return o.src=t,await o.decode(),o})()).get(t);let i=le.get(e);return i||(i=at(e).then(async o=>{let{pngBlob:s}=await ne(new File([o],"mascara.png",{type:"image/png"})),r=new Image;return r.src=URL.createObjectURL(s),await r.decode(),r}),le.set(e,i)),i}function Fe(e,t,i){let o,s=!0,r=async()=>{let l=await nt(t,e.dataset.mascara);s&&(o=new K(e,ae,{u_colorBack:Z("rgba(0,0,0,0)"),u_colorTint:Z(V.tint),u_image:l,u_isImage:!0,u_shape:se.none,u_repetition:V.repetition,u_softness:V.softness,u_shiftRed:V.shiftRed,u_shiftBlue:V.shiftBlue,u_distortion:V.distortion,u_contour:V.contour,u_angle:V.angle,u_fit:re.contain,u_scale:1,u_rotation:0,u_offsetX:0,u_offsetY:0,u_originX:.5,u_originY:.5,u_worldWidth:0,u_worldHeight:0},void 0,matchMedia("(prefers-reduced-motion: reduce)").matches?0:V.speed,0,2,16e5,["u_image"]),e.dataset.ready="",i&&i())},n=new IntersectionObserver(([l])=>{l.isIntersecting&&(n.disconnect(),r().catch(c=>console.warn("cromo: ficou o t\xEDtulo comum",c)))},{rootMargin:"400px"});return n.observe(e),{sair:()=>{if(s=!1,n.disconnect(),o){let l=o.canvasElement.getContext("webgl2");o.dispose(),l?.getExtension("WEBGL_lose_context")?.loseContext()}delete e.dataset.ready},parar:()=>{o&&o.setSpeed(0)}}}function st(e,t,i){let s=new OffscreenCanvas(Math.round(e*4),Math.round(t*4)),r=s.getContext("2d");r.fillStyle="#fff",r.beginPath(),r.roundRect(0,0,s.width,s.height,s.height/2),r.fill();let n=i*4;return r.globalCompositeOperation="destination-out",r.beginPath(),r.roundRect(n,n,s.width-n*2,s.height-n*2,s.height/2-n),r.fill(),s}var Ue=new Map,Ie=Promise.resolve();function ct(e,t,i){let o=`${e}x${t}:${i}`,s=Ue.get(o);return s||(s=Ie.then(async()=>{let r=await st(e,t,i).convertToBlob({type:"image/png"}),{pngBlob:n}=await ne(new File([r],"mask.png",{type:"image/png"})),a=new Image;return a.src=URL.createObjectURL(n),await a.decode(),a}),Ie=s.catch(()=>{}),Ue.set(o,s)),s}async function lt(e){let t=await ct(e.offsetWidth,e.offsetHeight,2);if(!e.isConnected)return()=>{};let i=matchMedia("(prefers-reduced-motion: reduce)").matches,o=new K(e,ae,{u_colorBack:Z("rgba(0,0,0,0)"),u_colorTint:Z("#dcecff"),u_image:t,u_isImage:!0,u_shape:se.none,u_repetition:1.5,u_softness:.15,u_shiftRed:.12,u_shiftBlue:.34,u_distortion:.08,u_contour:.2,u_angle:90,u_fit:re.contain,u_scale:1,u_rotation:0,u_offsetX:0,u_offsetY:0,u_originX:.5,u_originY:.5,u_worldWidth:0,u_worldHeight:0},void 0,i?0:1,0,2,4e5,["u_image"]);return e.classList.add("is-ready"),()=>{o.dispose(),e.classList.remove("is-ready")}}function Ae(e=document){let t=i=>lt(i).catch(o=>console.warn("metal: ficou o anel liso",o));e.querySelectorAll(".metal-btn__metal").forEach(i=>{if(i.getBoundingClientRect().top<innerHeight)t(i);else{let s=new IntersectionObserver(([r])=>{r.isIntersecting&&(s.disconnect(),t(i))},{rootMargin:"400px"});s.observe(i)}})}var ut=`#version 300 es
void main() { vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`,dt=`#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
uniform vec3 u_anil;
uniform vec3 u_coral;
uniform vec3 u_gelo;
out vec4 o;

const float THICK = 0.26;
const float BAND = 0.4;
const float SOFT = 0.5;
const float GRAIN = 0.32;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float noise3(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v / 0.875;
}
float grain(vec2 p) {
  uvec2 q = uvec2(ivec2(p) + 4096);
  uint h = (q.x * 1597334677u) ^ (q.y * 3812015801u);
  h = (h ^ (h >> 16u)) * 0x45d9f3bu;
  h ^= h >> 16u;
  return float(h) / 4294967295.0;
}

void main() {
  float m = min(u_res.x, u_res.y);
  vec2 size = u_res / m;
  vec2 p = gl_FragCoord.xy / m;
  float t = u_time * 0.06;

  float asp = size.x / size.y;
  vec2 d2 = min(p, size - p) * vec2(mix(1.0, 1.7, smoothstep(0.95, 0.6, asp)), mix(1.0, 1.6, smoothstep(1.1, 1.9, asp)));
  float k = 0.08;
  float h = clamp(0.5 + 0.5 * (d2.y - d2.x) / k, 0.0, 1.0);
  float edge = mix(d2.y, d2.x, h) - k * h * (1.0 - h);

  vec2 q = p * 1.3;
  vec2 w = vec2(noise3(q + vec2(0.0, t)), noise3(q + vec2(5.2, -t * 0.8)));
  float n = noise3(q + 1.8 * w + vec2(t * 0.7, -t * 0.4));
  float thick = THICK * smoothstep(0.3, 0.85, n);

  vec2 md = p - u_mouse * size;
  thick += 0.3 * u_hover * exp(-dot(md, md) * 6.0);

  float shape0 = clamp((thick - edge) / BAND, 0.0, 1.0);
  float shape = shape0 + GRAIN * (grain(gl_FragCoord.xy) - 0.5);

  float s = clamp(shape - 0.125, 0.0, 1.0);
  float alpha = smoothstep(0.0, SOFT, clamp(s * 4.0, 0.0, 1.0));
  float x = s * 3.0;
  float lo = 0.5 - 0.5 * SOFT, hi = 0.5 + 0.5 * SOFT;
  vec3 col = u_anil;
  col = mix(col, u_coral, smoothstep(lo, hi, clamp(x, 0.0, 1.0)));
  col = mix(col, u_gelo, smoothstep(lo, hi, clamp(x - 1.0, 0.0, 1.0)));
  col = mix(col, u_anil, smoothstep(lo, hi, clamp(x - 2.0, 0.0, 1.0)));
  col *= alpha * smoothstep(0.0, 0.3, shape0);
  o = vec4(col, 1.0);
}`,ve=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255);function ke(e,t){let i=document.createElement("canvas");i.className="moldura-tela",i.setAttribute("aria-hidden","true");let o=i.getContext("webgl2",{antialias:!1,alpha:!1});if(!o)return e.classList.add("no-gl"),{sair(){},congelar(){}};e.prepend(i);let s=(T,z)=>{let C=o.createShader(T);return o.shaderSource(C,z),o.compileShader(C),C},r=o.createProgram();if(o.attachShader(r,s(o.VERTEX_SHADER,ut)),o.attachShader(r,s(o.FRAGMENT_SHADER,dt)),o.linkProgram(r),!o.getProgramParameter(r,o.LINK_STATUS))return i.remove(),e.classList.add("no-gl"),{sair(){},congelar(){}};o.useProgram(r),o.bindVertexArray(o.createVertexArray());let n=T=>o.getUniformLocation(r,T);o.uniform3fv(n("u_anil"),ve(t[0])),o.uniform3fv(n("u_coral"),ve(t[1])),o.uniform3fv(n("u_gelo"),ve(t[2]));let a=matchMedia("(prefers-reduced-motion: reduce)").matches,l=[.5,.5],c=[.5,.5],h=0,p=0,f=0,R=0,w=!0,v=performance.now(),u=()=>{i.width=Math.max(1,Math.round(e.clientWidth*.75)),i.height=Math.max(1,Math.round(e.clientHeight*.75)),o.viewport(0,0,i.width,i.height)},d=T=>{o.uniform2f(n("u_res"),i.width,i.height),o.uniform1f(n("u_time"),T),o.uniform2f(n("u_mouse"),c[0],c[1]),o.uniform1f(n("u_hover"),p),o.drawArrays(o.TRIANGLES,0,3)},_=T=>{if(f=0,!w)return;let z=T-R;if(z>=40){let C=1e3/Math.max(1,z),Y=1-Math.pow(.94,60/C),A=1-Math.pow(.96,60/C);c[0]+=(l[0]-c[0])*Y,c[1]+=(l[1]-c[1])*Y,p+=(h-p)*A,R=T,d((T-v)/1e3)}f=requestAnimationFrame(_)},M=T=>{let z=e.getBoundingClientRect();l=[(T.clientX-z.left)/z.width,1-(T.clientY-z.top)/z.height],h=1,a&&(c=l,p=1,d(18))},F=()=>{h=0};e.addEventListener("pointermove",M),e.addEventListener("pointerleave",F);let L=new ResizeObserver(()=>{u(),a&&d(18)});L.observe(e);let S=new IntersectionObserver(([T])=>{w=T.isIntersecting,w&&!a&&!f&&(f=requestAnimationFrame(_))},{rootMargin:"100px"});return S.observe(e),u(),a?d(18):f=requestAnimationFrame(_),{sair:()=>{cancelAnimationFrame(f),L.disconnect(),S.disconnect(),e.removeEventListener("pointermove",M),e.removeEventListener("pointerleave",F),o.getExtension("WEBGL_lose_context")?.loseContext(),i.remove()},congelar:()=>{a=!0,cancelAnimationFrame(f),f=0,d(18)}}}function Te(e){let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((e||"").trim());if(!t)return null;let i=t[1].length===3?t[1].split("").map(o=>o+o).join(""):t[1];return[parseInt(i.slice(0,2),16),parseInt(i.slice(2,4),16),parseInt(i.slice(4,6),16)]}function mt(e,t){let i=e<0?0:e>1?1:e;return Math.sqrt(i)*t*.56}function ht(e,t,i,o,s,r,n,a,l){let c=e-n,h=t-a,p=c*c+h*h;if(l>0&&p<l*l){let f=Math.sqrt(p)+.001,R=(1-f/l)*2.6;i+=c/f*R,o+=h/f*R}return i=(i+(s-e)*.05)*.84,o=(o+(r-t)*.05)*.84,[e+i,t+o,i,o]}function pt(e,t,i,o,s){let r=Math.hypot(e-i,t-o);return s>0?Math.min(1,r/s):0}function ft(e,t){return e>0?t/e*100:0}function Pe(e,t){let i=e.querySelector("canvas"),o=i&&i.getContext("2d");if(!o)return()=>{};let s=window.matchMedia("(prefers-reduced-motion: reduce)").matches,r=0,n=0,a=1,l=-1e5,c=-1e5,h=0,p=!0,f=!0,R={x:0,y:0,t:-1},w=new Float32Array(0),v=0,u=null,d=Te(t.colors.ink)||[233,228,218],_=Te(t.colors.warm)||[233,118,43],M=()=>{r=Math.max(1,e.clientWidth),n=Math.max(1,e.clientHeight),a=Math.min(window.devicePixelRatio||1,2),i.width=Math.round(r*a),i.height=Math.round(n*a);let A=document.createElement("canvas");A.width=r,A.height=n;let E=A.getContext("2d",{willReadFrequently:!0});if(!E)return;E.font=t.fontWeight+" 100px "+t.fontFamily;let O=t.wordmark||" ",j=ft(E.measureText(O).width,r*1.02);E.font=t.fontWeight+" "+j+"px "+t.fontFamily;let G=E.measureText(O),D=G.actualBoundingBoxAscent||j*.72,U=Math.max(0,Math.min(.6,t.crop));E.fillStyle="#000",E.textBaseline="alphabetic",E.fillText(O,(r-G.width)/2,n+D*U);let P=E.getImageData(0,0,r,n).data,I=Math.max(3,t.dotGap),W=Math.ceil(r/I),q=Math.ceil(n/I),g=[];for(let x=0;x<q;x++)for(let y=0;y<W;y++){let $=0;for(let te=0;te<3;te++)for(let fe=0;fe<3;fe++){let Xe=Math.min(r-1,Math.floor(y*I+(fe+.5)*I/3)),Ye=Math.min(n-1,Math.floor(x*I+(te+.5)*I/3));$+=P[(Ye*r+Xe)*4+3]}let H=$/(9*255);if(H<.06)continue;let ee=y*I+I/2,ie=x*I+I/2;g.push(ee,ie,0,0,ee,ie,mt(H,I))}w=new Float32Array(g),v=g.length/7,u=document.createElement("canvas"),u.width=256,u.height=256;let b=u.getContext("2d");if(b){let x=b.createImageData(256,256);for(let y=0;y<x.data.length;y+=4){let $=Math.random()*255;x.data[y]=x.data[y+1]=x.data[y+2]=$,x.data[y+3]=Math.random()<.5?0:255}b.putImageData(x,0,0)}f=!0},F=A=>{o.setTransform(a,0,0,a,0,0),o.fillStyle=t.colors.background,o.fillRect(0,0,r,n);let E=t.interactive&&!s?Math.max(0,t.radius):0,O=R.t<0?1e9:A-R.t,j=O*.9,G=!1;for(let D=0;D<v;D++){let U=D*7,P=w[U],I=w[U+1],W=w[U+2],q=w[U+3],g=w[U+4],b=w[U+5];if(!s){if(O<900){let $=g-R.x,H=b-R.y,ee=Math.sqrt($*$+H*H)+.001,ie=1-Math.min(1,Math.abs(ee-j)/26);if(ie>0){let te=ie*3.2*(1-O/900);W+=$/ee*te,q+=H/ee*te}}let y=ht(P,I,W,q,g,b,l,c,E);P=y[0],I=y[1],W=y[2],q=y[3],Math.abs(W)+Math.abs(q)>.02||Math.abs(P-g)+Math.abs(I-b)>.05?G=!0:(P=g,I=b,W=0,q=0),w[U]=P,w[U+1]=I,w[U+2]=W,w[U+3]=q}let x=pt(P,I,g,b,28);o.fillStyle=x>.02?"rgb("+Math.round(d[0]+(_[0]-d[0])*x)+","+Math.round(d[1]+(_[1]-d[1])*x)+","+Math.round(d[2]+(_[2]-d[2])*x)+")":t.colors.ink,o.beginPath(),o.arc(P,I,w[U+6],0,6.2832),o.fill()}if(u&&t.grain>0){o.globalAlpha=Math.min(1,t.grain)*.09,o.globalCompositeOperation="overlay";let D=o.createPattern(u,"repeat");D&&(o.fillStyle=D,o.fillRect(0,0,r,n)),o.globalAlpha=1,o.globalCompositeOperation="source-over"}f=G||O<900||l>-1e4},L=A=>{h=0,p&&(F(A),f&&(h=requestAnimationFrame(L)))},S=()=>{f=!0,!h&&p&&(h=requestAnimationFrame(L))},k=A=>{let E=i.getBoundingClientRect();return[(A.clientX-E.left)*r/(E.width||r),(A.clientY-E.top)*n/(E.height||n)]},Q=A=>{if(!t.interactive)return;let E=k(A);l=E[0],c=E[1],S()},T=()=>{l=-1e5,c=-1e5,S()},z=A=>{if(!t.interactive||s||A.target.closest("a,button"))return;let E=k(A);R={x:E[0],y:E[1],t:performance.now()},S()};M(),F(performance.now()),S(),e.addEventListener("pointermove",Q),e.addEventListener("pointerleave",T),e.addEventListener("pointerdown",z);let C=new ResizeObserver(()=>{M(),S()});C.observe(e);let Y=new IntersectionObserver(A=>{p=A[0]?A[0].isIntersecting:!0,p&&S()});return Y.observe(e),document.fonts&&document.fonts.ready&&document.fonts.ready.then(()=>{M(),S()}),()=>{cancelAnimationFrame(h),C.disconnect(),Y.disconnect()}}var ue=class{constructor(t,i,o){this.x=t,this.v=0,this.target=t,this.k=i,this.d=o}step(t){let i=this.k*(this.target-this.x)-this.d*this.v;return this.v+=i*t,this.x+=this.v*t,this.x}},xe=(e,t,i)=>Math.min(i,Math.max(t,e)),gt=11/14,vt=15/14;function ze(e,{maxTilt:t=14,stiffness:i=120,damping:o=10}={}){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;let s=t*vt,r=t*gt,n=new ue(0,i,o),a=new ue(0,i,o),l={px:.5,py:.5,hovering:!1},c=0,h=0,p=!0;e.classList.add("hc");let f=(d,_)=>{e.style.transform=`perspective(1100px) rotateX(${d.toFixed(3)}deg) rotateY(${_.toFixed(3)}deg)`,e.style.setProperty("--hc-px",l.px.toFixed(4)),e.style.setProperty("--hc-py",l.py.toFixed(4)),e.style.setProperty("--hc-hue",(_*4+(l.px-.5)*40).toFixed(2));let M=(Math.abs(d)+Math.abs(_))/Math.max(1,r+s);e.style.setProperty("--hc-glare-o",(.22+M*.4).toFixed(3))},R=d=>{c=0,h||(h=d);let _=xe((d-h)/1e3,0,.05);if(h=d,!l.hovering){n.target=0,a.target=0;let S=Math.min(1,_*2);l.px+=(.5-l.px)*S,l.py+=(.5-l.py)*S}let M=n.step(_),F=a.step(_);if(f(M,F),!l.hovering&&Math.abs(M)+Math.abs(F)<.02&&Math.abs(n.v)+Math.abs(a.v)<.02){e.style.transform="",h=0;return}p&&(c=requestAnimationFrame(R))},w=()=>{c||(c=requestAnimationFrame(R))},v=d=>{if(d.pointerType==="touch")return;let _=e.getBoundingClientRect();if(!_.width||!_.height)return;let M=xe((d.clientX-_.left)/_.width,0,1),F=xe((d.clientY-_.top)/_.height,0,1);l.px=M,l.py=F,l.hovering=!0,a.target=(M-.5)*2*s,n.target=-(F-.5)*2*r,w()},u=()=>{l.hovering=!1,w()};e.addEventListener("pointermove",v),e.addEventListener("pointerleave",u),e.addEventListener("pointercancel",u),new IntersectionObserver(d=>{p=d[0].isIntersecting,p&&w()}).observe(e)}var B=(e,t,i)=>{let o=document.createElement(e);return t&&(o.className=t),i!=null&&(o.textContent=i),o},Ce=e=>{let t=B("div","m-mock m-chart");return e.forEach(i=>{let o=B("span",i>30?"on":"");o.style.setProperty("height",i+"%"),t.append(o)}),t},Ve=(e,t,i)=>{let o=B("div","m-mock m-toggle"),s=B("div","m-seg");return s.append(B("span","on",e),B("span","",t)),o.append(s,B("span","m-price",i)),o},xt=[{kind:"foto",kicker:"Onde",title:"Academia",src:"img/local-academia.webp"},{kind:"treino",title:"Corpo inteiro A",body:"Agachamento no rack \xB7 Supino com halteres \xB7 Remada curvada \xB7 Prancha com toque no ombro",tags:["segunda","3 s\xE9ries"]},{kind:"fala",nome:"Renata Alc\xE2ntara",text:"Com tr\xEAs dias por semana que cabem antes do trabalho, estou h\xE1 oito meses sem falhar uma semana."},{kind:"ui",kicker:"Ritmo",title:"Tr\xEAs dias por semana",mock:()=>Ce([92,14,76,14,88,14,14])},{kind:"foto",kicker:"Onde",title:"Em casa",src:"img/local-casa.webp"},{kind:"treino",title:"Plano por escrito",body:"V\xEDdeo curto de cada exerc\xEDcio, carga sugerida e o que fazer se perder um dia.",tags:["m\xE9todo"]},{kind:"fala",nome:"Jonas Peralta",text:"Achei que consultoria online fosse s\xF3 uma planilha. Recebi v\xEDdeo de cada exerc\xEDcio."},{kind:"ui",kicker:"Formato",title:"Presencial ou online",mock:()=>Ve("Presencial","Online","2 a 5 dias")}],_t=[{kind:"foto",kicker:"Onde",title:"Ao ar livre",src:"img/local-arlivre.webp"},{kind:"treino",title:"Corpo inteiro B",body:"Levantamento terra romeno \xB7 Desenvolvimento com halteres \xB7 Puxada na polia \xB7 Rota\xE7\xE3o na polia",tags:["quarta","3 s\xE9ries"]},{kind:"ui",kicker:"Ritmo",title:"Quatro dias por semana",mock:()=>Ce([90,78,14,86,72,14,14])},{kind:"fala",nome:"Cleide Marquezini",text:"Comecei aos 58 anos querendo s\xF3 subir escada sem cansar. Hoje fa\xE7o agachamento com carga."},{kind:"foto",kicker:"M\xE9todo",title:"Avalia\xE7\xE3o na semana 1",src:"img/metodo-avaliacao.webp"},{kind:"treino",title:"Ajuste a cada 4 semanas",body:"A gente mede o que mudou e troca o que precisa. O ciclo curto mant\xE9m o resultado vindo.",tags:["m\xE9todo"]},{kind:"foto",kicker:"M\xE9todo",title:"Carga que sobe aos poucos",src:"img/metodo-ajuste.webp"},{kind:"ui",kicker:"Aula de experi\xEAncia",title:"50 minutos",mock:()=>Ve("Presencial","Cuiab\xE1","sem custo")}];function bt(e,t){let i=B("article","esteira-card esteira-"+e.kind);if(t&&i.setAttribute("aria-hidden","true"),e.kind==="foto"){let o=B("img","esteira-foto");o.src=e.src,o.alt="",o.loading="lazy",o.decoding="async",o.width=420,o.height=270,i.append(o,B("span","esteira-kicker",e.kicker),B("h3","esteira-title",e.title))}else if(e.kind==="treino"){let o=B("div","esteira-foot"),s=B("div","esteira-tags");e.tags.forEach(r=>s.append(B("span","",r))),o.append(s),i.append(B("span","esteira-kicker","Treino"),B("h3","esteira-title",e.title),B("p","esteira-body",e.body),o)}else if(e.kind==="fala"){let o=B("div","esteira-post-head");o.append(B("span","esteira-avatar"),B("span","esteira-handle",e.nome)),i.append(o,B("p","esteira-post",e.text),B("span","esteira-kicker esteira-ficticio","depoimento fict\xEDcio"))}else i.append(B("span","esteira-kicker",e.kicker),B("h3","esteira-title",e.title),e.mock());return i}function Le(e){e.querySelector(".esteira__row")||[xt,_t].forEach(v=>{let u=B("div","esteira__row");[0,1,2].forEach(d=>v.forEach(_=>u.append(bt(_,d>0)))),e.append(u)});let t=Array.from(e.querySelectorAll(".esteira__row")),i=matchMedia("(prefers-reduced-motion: reduce)").matches,o=matchMedia("(max-width: 900px)"),s=18,r=[0,0],n=()=>{r=t.map(v=>(v.scrollWidth+parseFloat(getComputedStyle(v).columnGap))/3)},a=0,l=performance.now(),c=0,h=!1,p=v=>{c=0,i||(a+=Math.min(64,v-l)*(s/1e3)),l=v;let u=o.matches?.2:.3,_=(i?0:(innerHeight-e.getBoundingClientRect().top)*u)+a,M=r.map(F=>F?(_%F+F)%F:0);t[0].style.transform=`translate3d(${M[0]-r[0]}px, 0, 0)`,t[1].style.transform=`translate3d(${-M[1]}px, 0, 0)`,h&&!i&&(c=requestAnimationFrame(p))},f=()=>{c||(c=requestAnimationFrame(p))};n(),p(performance.now());let R=new IntersectionObserver(([v])=>{h=v.isIntersecting,l=performance.now(),h&&f()});R.observe(e);let w=new ResizeObserver(()=>{n(),f()});return t.forEach(v=>w.observe(v)),()=>{R.disconnect(),w.disconnect(),cancelAnimationFrame(c)}}function Oe(e){matchMedia("(hover: hover) and (pointer: fine)").matches&&document.querySelectorAll(e).forEach(t=>{t.classList.add("tem-luz"),t.addEventListener("pointermove",i=>{let o=t.getBoundingClientRect();t.style.setProperty("--lx",(i.clientX-o.left).toFixed(0)+"px"),t.style.setProperty("--ly",(i.clientY-o.top).toFixed(0)+"px"),t.classList.add("luz-on")}),t.addEventListener("pointerleave",()=>{t.classList.remove("luz-on"),t.style.setProperty("--lx","0px"),t.style.setProperty("--ly","0px")})})}function De(e,t){if(!e||innerWidth<901||matchMedia("(prefers-reduced-motion: reduce)").matches)return;let i=0,o=!1,s=()=>{i=0;let n=t.getBoundingClientRect(),a=Math.min(1,Math.max(0,(innerHeight-n.top)/(innerHeight+n.height)));e.style.transform=`translate3d(0, ${(a*160-60).toFixed(1)}px, 0) rotate(${(a*14-7).toFixed(2)}deg) scale(${(.94+a*.14).toFixed(3)})`},r=()=>{o&&!i&&(i=requestAnimationFrame(s))};new IntersectionObserver(([n])=>{o=n.isIntersecting,r()}).observe(t),addEventListener("scroll",r,{passive:!0}),s()}var wt=matchMedia("(prefers-reduced-motion: reduce)").matches,Ge=matchMedia("(min-width: 901px) and (pointer: fine)").matches,pe=(()=>{try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}})(),N=e=>document.querySelector(e),X=(e,t)=>{try{t()}catch(i){console.warn("premium: "+e+" ficou na vers\xE3o simples",i)}},de=()=>new Promise(e=>"requestIdleCallback"in window?requestIdleCallback(()=>e(),{timeout:1500}):setTimeout(e,200)),me=e=>new Promise(t=>setTimeout(t,e)),yt=new Promise(e=>document.readyState==="complete"?e():addEventListener("load",()=>e(),{once:!0})),qe="metalheart-modo",He=()=>{try{let e=JSON.parse(localStorage.getItem(qe)||"null");return e&&Date.now()-e.em<7*864e5?e.modo:null}catch{return null}},St=e=>{try{localStorage.setItem(qe,JSON.stringify({modo:e,em:Date.now()}))}catch{}},$e=N("#sigilo-palco"),Ne=N("#sigilo-3d"),be=!!($e&&Ne&&Ge&&pe&&!wt)&&He()!=="leve";be&&document.documentElement.classList.add("premium-3d");var _e=e=>{console.warn("premium: o s\xEDmbolo ficou em imagem",e),document.documentElement.classList.remove("premium-3d"),document.dispatchEvent(new Event("sigilo-em-imagem"))};function We(){let e=N(".esteira");e&&X("esteira",()=>Le(e)),Ge&&X("holo",()=>document.querySelectorAll(".etapa").forEach(i=>ze(i,{maxTilt:9}))),X("luz",()=>Oe(".resultado-plano, .resultado-calc, .confirmacao, .detalhes-tecnicos")),X("marca",()=>De(N(".marca-fantasma"),N("#metodo")));let t=N("#hwf");if(t){let i=new IntersectionObserver(([o])=>{o.isIntersecting&&(i.disconnect(),X("halftone",()=>Pe(t,{wordmark:t.dataset.palavra,colors:{background:"#050709",ink:"#aeb6c2",warm:"#8fa2ff"},dotGap:innerWidth<600?5:6,radius:80,crop:.2,grain:.5,interactive:!0,fontFamily:'Archivo, "Helvetica Neue", Arial, sans-serif',fontWeight:800})))},{rootMargin:"600px"});i.observe(t)}}var he=(e=1e3)=>new Promise(t=>{let i=0,o=performance.now(),s=r=>{i++,r-o<e?requestAnimationFrame(s):t(i*1e3/(r-o))};requestAnimationFrame(s)});async function Rt(){await yt,await de();let e=N(".abertura"),t=N("#cromo-titulo"),i=N("#titulo-abertura"),o=He()==="leve",s=o?60:await he(500),r=l=>l<Math.max(20,Math.min(40,s*.6)),n,a;if(e&&pe&&X("moldura",()=>{n=ke(e,["#081250","#1a33b5","#6f86f5"])}),n&&o&&n.congelar(),n&&!o&&r(await he())&&(n.congelar(),o=!0),await me(100),await de(),t&&i&&pe&&X("cromo",()=>{a=Fe(t,t.dataset.texto,()=>{i.classList.add("tem-cromo"),o&&a.parar()})}),a&&!o&&(await me(600),r(await he())&&(a.parar(),n&&n.congelar(),o=!0)),await me(100),await de(),be&&!o){let l=await import("./parte-D5OGKTNB.js").then(c=>c.montarSigilo3D(Ne,$e)).catch(c=>(_e(c),null));l&&r(await he(1200))&&(l.sair(),_e("aparelho lento"),n&&n.congelar(),a&&a.parar(),o=!0)}else be&&_e("aparelho lento");await me(300),await de(),!o&&pe&&"OffscreenCanvas"in window&&X("merc\xFArio",()=>Ae()),St(o?"leve":"cheio")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",We):We();Rt();
