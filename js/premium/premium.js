import{a as d}from"./parte-2TUX3VHC.js";var ge=`#version 300 es
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
}`;var ve=1920*1080*4,K=class{constructor(t,i,o,a,r=0,s=0,n=2,u=ve,l=[]){d(this,"parentElement");d(this,"canvasElement");d(this,"gl");d(this,"program",null);d(this,"uniformLocations",{});d(this,"fragmentShader");d(this,"rafId",null);d(this,"lastRenderTime",0);d(this,"currentFrame",0);d(this,"speed",0);d(this,"currentSpeed",0);d(this,"providedUniforms");d(this,"mipmaps",[]);d(this,"hasBeenDisposed",!1);d(this,"resolutionChanged",!0);d(this,"textures",new Map);d(this,"minPixelRatio");d(this,"maxPixelCount");d(this,"isSafari",He());d(this,"uniformCache",{});d(this,"textureUnitMap",new Map);d(this,"ownerDocument");d(this,"initProgram",()=>{let t=qe(this.gl,ge,this.fragmentShader);t&&(this.program=t)});d(this,"setupPositionAttribute",()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),i=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,i);let o=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(o),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)});d(this,"setupUniforms",()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([i,o])=>{if(t[i]=this.gl.getUniformLocation(this.program,i),o instanceof HTMLImageElement){let a=`${i}AspectRatio`;t[a]=this.gl.getUniformLocation(this.program,a)}}),this.uniformLocations=t});d(this,"renderScale",1);d(this,"parentWidth",0);d(this,"parentHeight",0);d(this,"parentDevicePixelWidth",0);d(this,"parentDevicePixelHeight",0);d(this,"devicePixelsSupported",!1);d(this,"intersectionObserver",null);d(this,"isInViewport",!0);d(this,"resizeObserver",null);d(this,"setupResizeObserver",()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let i=t.devicePixelContentBoxSize?.[0];i!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=i.inlineSize,this.parentDevicePixelHeight=i.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)});d(this,"setupIntersectionObserver",()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([i])=>{this.isInViewport=i?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))});d(this,"handleVisualViewportChange",()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()});d(this,"handleResize",()=>{let t=0,i=0,o=Math.max(1,window.devicePixelRatio),a=visualViewport?.scale??1;if(this.devicePixelsSupported){let h=Math.max(1,this.minPixelRatio/o);t=this.parentDevicePixelWidth*h*a,i=this.parentDevicePixelHeight*h*a}else{let h=Math.max(o,this.minPixelRatio)*a;if(this.isSafari){let p=$e(this.ownerDocument);h*=Math.max(1,p)}t=Math.round(this.parentWidth)*h,i=Math.round(this.parentHeight)*h}let r=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*i),s=Math.min(1,r),n=Math.round(t*s),u=Math.round(i*s),l=n/Math.round(this.parentWidth);(this.canvasElement.width!==n||this.canvasElement.height!==u||this.renderScale!==l)&&(this.renderScale=l,this.canvasElement.width=n,this.canvasElement.height=u,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))});d(this,"render",t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let i=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=i*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null});d(this,"requestRender",()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)});d(this,"setTextureUniform",(t,i)=>{if(!i.complete||i.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let o=this.textures.get(t);o&&this.gl.deleteTexture(o),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let a=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+a);let r=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,r),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,i),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||r===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(t,r);let n=this.uniformLocations[t];if(n){this.gl.uniform1i(n,a);let u=`${t}AspectRatio`,l=this.uniformLocations[u];if(l){let h=i.naturalWidth/i.naturalHeight;this.gl.uniform1f(l,h)}}});d(this,"areUniformValuesEqual",(t,i)=>t===i?!0:Array.isArray(t)&&Array.isArray(i)&&t.length===i.length?t.every((o,a)=>this.areUniformValuesEqual(o,i[a])):!1);d(this,"setUniformValues",t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([i,o])=>{let a=o;if(o instanceof HTMLImageElement&&(a=`${o.src.slice(0,200)}|${o.naturalWidth}x${o.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[i],a))return;this.uniformCache[i]=a;let r=this.uniformLocations[i];if(!r){console.warn(`Uniform location for ${i} not found`);return}if(o instanceof HTMLImageElement)this.setTextureUniform(i,o);else if(Array.isArray(o)){let s=null,n=null;if(o[0]!==void 0&&Array.isArray(o[0])){let u=o[0].length;if(o.every(l=>l.length===u))s=o.flat(),n=u;else{console.warn(`All child arrays must be the same length for ${i}`);return}}else s=o,n=s.length;switch(n){case 2:this.gl.uniform2fv(r,s);break;case 3:this.gl.uniform3fv(r,s);break;case 4:this.gl.uniform4fv(r,s);break;case 9:this.gl.uniformMatrix3fv(r,!1,s);break;case 16:this.gl.uniformMatrix4fv(r,!1,s);break;default:console.warn(`Unsupported uniform array length: ${n}`)}}else typeof o=="number"?this.gl.uniform1f(r,o):typeof o=="boolean"?this.gl.uniform1i(r,o?1:0):console.warn(`Unsupported uniform type for ${i}: ${typeof o}`)})});d(this,"getCurrentFrame",()=>this.currentFrame);d(this,"setFrame",t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())});d(this,"setSpeed",(t=1)=>{this.speed=t,this.updateCurrentSpeed()});d(this,"updateCurrentSpeed",()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)});d(this,"setCurrentSpeed",t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)});d(this,"setMaxPixelCount",(t=ve)=>{this.maxPixelCount=t,this.handleResize()});d(this,"setMinPixelRatio",(t=2)=>{this.minPixelRatio=t,this.handleResize()});d(this,"setUniforms",t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())});d(this,"handleDocumentVisibilityChange",()=>{this.updateCurrentSpeed()});d(this,"dispose",()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount});if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");this.ownerDocument=t.ownerDocument,this.ownerDocument.querySelector("style[data-paper-shader]")||this.ownerDocument.createElement("style").setAttribute("data-paper-shader","");let h=this.ownerDocument.createElement("canvas");this.canvasElement=h,this.parentElement.prepend(h),this.fragmentShader=i,this.providedUniforms=o,this.mipmaps=l,this.currentFrame=s,this.minPixelRatio=n,this.maxPixelCount=u;let p=h.getContext("webgl2",a);if(!p)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=p,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(r),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}};function xe(e,t,i){let o=e.createShader(t);return o?(e.shaderSource(o,i),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(o)),e.deleteShader(o),null)):null}function qe(e,t,i){let o=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),a=o?o.precision:null;a&&a<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let r=xe(e,e.VERTEX_SHADER,t),s=xe(e,e.FRAGMENT_SHADER,i);if(!r||!s)return null;let n=e.createProgram();return n?(e.attachShader(n,r),e.attachShader(n,s),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS)?(e.detachShader(n,r),e.detachShader(n,s),e.deleteShader(r),e.deleteShader(s),n):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(n)),e.deleteProgram(n),e.deleteShader(r),e.deleteShader(s),null)):null}function He(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function $e(e){let t=visualViewport?.scale??1,i=visualViewport?.width??window.innerWidth,o=window.innerWidth-e.documentElement.clientWidth,a=t*i+o,r=outerWidth/a,s=Math.round(100*r);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:r}var ie={none:0,contain:1,cover:2};var _e=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,be=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var we=`
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`,ye=`
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
`;var re=`#version 300 es
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

${_e}
${be}
${ye}

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

  ${we}

  fragColor = vec4(color, opacity);
}
`,Z={measurePerformance:!1,workingSize:512,iterations:40};function ae(e){let t=document.createElement("canvas"),i=t.getContext("2d"),o=typeof e=="string"&&e.startsWith("blob:");return new Promise((a,r)=>{if(!e||!i){r(new Error("Invalid file or canvas context"));return}let s=o&&fetch(e).then(l=>l.headers.get("Content-Type")),n=new Image;n.crossOrigin="anonymous";let u=performance.now();n.onload=async()=>{let l,h=await s;h?l=h==="image/svg+xml":typeof e=="string"?l=e.endsWith(".svg")||e.startsWith("data:image/svg+xml"):l=e.type==="image/svg+xml";let p=n.width||n.naturalWidth,f=n.height||n.naturalHeight;if(l){let w=p/f;p>f?(p=4096,f=4096/w):(f=4096,p=4096*w),n.width=p,n.height=f}let M=Math.min(p,f),v=Z.workingSize/M,c=Math.round(p*v),m=Math.round(f*v);Z.measurePerformance&&(console.log("[Processing Mode]"),console.log(`  Original: ${p}\xD7${f}`),console.log(`  Working: ${c}\xD7${m} (${(v*100).toFixed(1)}% scale)`),v<1&&console.log(`  Speedup: ~${Math.round(1/(v*v))}\xD7`)),t.width=p,t.height=f;let _=document.createElement("canvas");_.width=c,_.height=m;let E=_.getContext("2d");E.drawImage(n,0,0,c,m);let F=performance.now(),R=E.getImageData(0,0,c,m).data,b=new Uint8Array(c*m),P=new Uint8Array(c*m),C=0;for(let g=0,w=0;g<R.length;g+=4,w++){let S=R[g+3]===0?0:1;b[w]=S,C+=S}let X=[],W=[];for(let g=0;g<m;g++)for(let w=0;w<c;w++){let x=g*c+w;if(!b[x])continue;let S=!1;w===0||w===c-1||g===0||g===m-1?S=!0:S=!b[x-1]||!b[x+1]||!b[x-c]||!b[x+c]||!b[x-c-1]||!b[x-c+1]||!b[x+c-1]||!b[x+c+1],S?(P[x]=1,X.push(x)):W.push(x)}Z.measurePerformance&&(console.log(`[Mask Building] Time: ${(performance.now()-F).toFixed(2)}ms`),console.log(`  Shape pixels: ${C} / ${c*m} (${(C/(c*m)*100).toFixed(1)}%)`),console.log(`  Interior pixels: ${W.length}`),console.log(`  Boundary pixels: ${X.length}`));let se=Ne(b,P,new Uint32Array(W),new Uint32Array(X),c,m),I=performance.now(),B=Xe(se,b,P,c,m);Z.measurePerformance&&console.log(`[Poisson Solve] Time: ${(performance.now()-I).toFixed(2)}ms`);let L=0,j;for(let g=0;g<W.length;g++){let w=W[g];B[w]>L&&(L=B[w])}let G=document.createElement("canvas");G.width=c,G.height=m;let O=G.getContext("2d"),A=O.createImageData(c,m);for(let g=0;g<m;g++)for(let w=0;w<c;w++){let x=g*c+w,S=x*4;if(!b[x])A.data[S]=255,A.data[S+1]=255,A.data[S+2]=255,A.data[S+3]=0;else{let H=255*(1-B[x]/L);A.data[S]=H,A.data[S+1]=H,A.data[S+2]=H,A.data[S+3]=255}}O.putImageData(A,0,0),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(G,0,0,c,m,0,0,p,f);let k=i.getImageData(0,0,p,f),T=document.createElement("canvas");T.width=p,T.height=f;let D=T.getContext("2d");D.drawImage(n,0,0,p,f);let q=D.getImageData(0,0,p,f);for(let g=0;g<k.data.length;g+=4){let w=q.data[g+3],x=k.data[g+3];w===0?(k.data[g]=255,k.data[g+1]=0):(k.data[g]=x===0?0:k.data[g],k.data[g+1]=w),k.data[g+2]=255,k.data[g+3]=255}i.putImageData(k,0,0),j=k,t.toBlob(g=>{if(!g){r(new Error("Failed to create PNG blob"));return}if(Z.measurePerformance){let w=performance.now()-u;if(console.log(`[Total Processing Time] ${w.toFixed(2)}ms`),v<1){let x=w*Math.pow(p*f/(c*m),1.5);console.log(`[Estimated time at full resolution] ~${x.toFixed(0)}ms`),console.log(`[Time saved] ~${(x-w).toFixed(0)}ms (${Math.round(x/w)}\xD7 faster)`)}}a({imageData:j,pngBlob:g})},"image/png")},n.onerror=()=>r(new Error("Failed to load image")),n.src=typeof e=="string"?e:URL.createObjectURL(e)})}function Ne(e,t,i,o,a,r){let s=i.length,n=new Int32Array(s*4);for(let u=0;u<s;u++){let l=i[u],h=l%a,p=Math.floor(l/a);n[u*4+0]=h<a-1&&e[l+1]?l+1:-1,n[u*4+1]=h>0&&e[l-1]?l-1:-1,n[u*4+2]=p>0&&e[l-a]?l-a:-1,n[u*4+3]=p<r-1&&e[l+a]?l+a:-1}return{interiorPixels:i,boundaryPixels:o,pixelCount:s,neighborIndices:n}}function Xe(e,t,i,o,a){let r=Z.iterations,s=.01,n=new Float32Array(o*a),{interiorPixels:u,neighborIndices:l,pixelCount:h}=e,p=performance.now(),f=1.9,M=[],y=[];for(let v=0;v<h;v++){let c=u[v],m=c%o,_=Math.floor(c/o);(m+_)%2===0?M.push(v):y.push(v)}for(let v=0;v<r;v++){for(let c of M){let m=u[c],_=l[c*4+0],E=l[c*4+1],F=l[c*4+2],V=l[c*4+3],R=0;_>=0&&(R+=n[_]),E>=0&&(R+=n[E]),F>=0&&(R+=n[F]),V>=0&&(R+=n[V]);let b=(s+R)/4;n[m]=f*b+(1-f)*n[m]}for(let c of y){let m=u[c],_=l[c*4+0],E=l[c*4+1],F=l[c*4+2],V=l[c*4+3],R=0;_>=0&&(R+=n[_]),E>=0&&(R+=n[E]),F>=0&&(R+=n[F]),V>=0&&(R+=n[V]);let b=(s+R)/4;n[m]=f*b+(1-f)*n[m]}}if(Z.measurePerformance){let v=performance.now()-p;console.log(`[Optimized Poisson Solver (SOR \u03C9=${f})]`),console.log(`  Working size: ${o}\xD7${a}`),console.log(`  Iterations: ${r}`),console.log(`  Time: ${v.toFixed(2)}ms`),console.log(`  Interior pixels processed: ${h}`),console.log(`  Speed: ${(r*h/(v*1e3)).toFixed(2)} Mpixels/sec`)}return n}var ne={none:0,circle:1,daisy:2,diamond:3,metaballs:4};function Q(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:te;if(typeof e!="string")return te;let t,i,o,a=1;if(e.startsWith("#"))[t,i,o,a]=Ye(e);else if(e.startsWith("rgb")){let r=je(e);if(r===null)return te;[t,i,o,a]=r}else if(e.startsWith("hsl")){let r=Ke(e);if(r===null)return te;[t,i,o,a]=Ze(r)}else return console.error("Unsupported color format",e),te;return[ce(t,0,1),ce(i,0,1),ce(o,0,1),ce(a,0,1)]}function Ye(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(r=>r+r).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),te;let t=parseInt(e.slice(0,2),16)/255,i=parseInt(e.slice(2,4),16)/255,o=parseInt(e.slice(4,6),16)/255,a=parseInt(e.slice(6,8),16)/255;return[t,i,o,a]}function je(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function Ke(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function Ze(e){let[t,i,o,a]=e,r=t/360,s=i/100,n=o/100,u,l,h;if(i===0)u=l=h=n;else{let p=(y,v,c)=>(c<0&&(c+=1),c>1&&(c-=1),c<.16666666666666666?y+(v-y)*6*c:c<.5?v:c<.6666666666666666?y+(v-y)*(.6666666666666666-c)*6:y),f=n<.5?n*(1+s):n+s-n*s,M=2*n-f;u=p(M,f,r+1/3),l=p(M,f,r),h=p(M,f,r-1/3)}return[u,l,h,a]}var ce=(e,t,i)=>Math.min(Math.max(e,t),i),te=[.5,.5,.5,1];var z={font:"800 condensed 400px Archivo, 'Helvetica Neue', Arial, sans-serif",letterSpacing:-6,tint:"#dcecff",repetition:1.6,softness:.1,shiftRed:.12,shiftBlue:.34,distortion:.07,contour:.3,angle:70,speed:1},me=80;async function he(e){await document.fonts.load(z.font);let t=document.createElement("canvas").getContext("2d");return t.font=z.font,t.letterSpacing=`${z.letterSpacing}px`,{w:Math.ceil(t.measureText(e).width)+me*2,h:400+me*2}}async function Qe(e){let t=await he(e),i=document.createElement("canvas");i.width=t.w,i.height=t.h;let o=i.getContext("2d");return o.font=z.font,o.letterSpacing=`${z.letterSpacing}px`,o.fillStyle="#fff",o.textBaseline="middle",o.fillText(e,me,i.height/2+14),new Promise((a,r)=>i.toBlob(s=>s?a(s):r(new Error("cromo: m\xE1scara vazia")),"image/png"))}var Se=new Map;function Je(e){let t=Se.get(e);return t||(t=Qe(e).then(async i=>{let{pngBlob:o}=await ae(new File([i],"mascara.png",{type:"image/png"})),a=new Image;return a.src=URL.createObjectURL(o),await a.decode(),a}),Se.set(e,t)),t}function Re(e,t,i){let o,a=!0,r=async()=>{let n=await Je(t);a&&(o=new K(e,re,{u_colorBack:Q("rgba(0,0,0,0)"),u_colorTint:Q(z.tint),u_image:n,u_isImage:!0,u_shape:ne.none,u_repetition:z.repetition,u_softness:z.softness,u_shiftRed:z.shiftRed,u_shiftBlue:z.shiftBlue,u_distortion:z.distortion,u_contour:z.contour,u_angle:z.angle,u_fit:ie.contain,u_scale:1,u_rotation:0,u_offsetX:0,u_offsetY:0,u_originX:.5,u_originY:.5,u_worldWidth:0,u_worldHeight:0},void 0,matchMedia("(prefers-reduced-motion: reduce)").matches?0:z.speed,0,2,void 0,["u_image"]),e.dataset.ready="",i&&i())},s=new IntersectionObserver(([n])=>{n.isIntersecting&&(s.disconnect(),r().catch(u=>console.warn("cromo: ficou o t\xEDtulo comum",u)))},{rootMargin:"400px"});return s.observe(e),()=>{if(a=!1,s.disconnect(),o){let n=o.canvasElement.getContext("webgl2");o.dispose(),n?.getExtension("WEBGL_lose_context")?.loseContext()}delete e.dataset.ready}}function et(e,t,i){let a=new OffscreenCanvas(Math.round(e*4),Math.round(t*4)),r=a.getContext("2d");r.fillStyle="#fff",r.beginPath(),r.roundRect(0,0,a.width,a.height,a.height/2),r.fill();let s=i*4;return r.globalCompositeOperation="destination-out",r.beginPath(),r.roundRect(s,s,a.width-s*2,a.height-s*2,a.height/2-s),r.fill(),a}var Me=new Map,Ee=Promise.resolve();function tt(e,t,i){let o=`${e}x${t}:${i}`,a=Me.get(o);return a||(a=Ee.then(async()=>{let r=await et(e,t,i).convertToBlob({type:"image/png"}),{pngBlob:s}=await ae(new File([r],"mask.png",{type:"image/png"})),n=new Image;return n.src=URL.createObjectURL(s),await n.decode(),n}),Ee=a.catch(()=>{}),Me.set(o,a)),a}async function ot(e){let t=await tt(e.offsetWidth,e.offsetHeight,2);if(!e.isConnected)return()=>{};let i=matchMedia("(prefers-reduced-motion: reduce)").matches,o=new K(e,re,{u_colorBack:Q("rgba(0,0,0,0)"),u_colorTint:Q("#dcecff"),u_image:t,u_isImage:!0,u_shape:ne.none,u_repetition:1.5,u_softness:.15,u_shiftRed:.12,u_shiftBlue:.34,u_distortion:.08,u_contour:.2,u_angle:90,u_fit:ie.contain,u_scale:1,u_rotation:0,u_offsetX:0,u_offsetY:0,u_originX:.5,u_originY:.5,u_worldWidth:0,u_worldHeight:0},void 0,i?0:1,0,2,void 0,["u_image"]);return e.classList.add("is-ready"),()=>{o.dispose(),e.classList.remove("is-ready")}}function Be(e=document){let t=i=>ot(i).catch(o=>console.warn("metal: ficou o anel liso",o));e.querySelectorAll(".metal-btn__metal").forEach(i=>{if(i.getBoundingClientRect().top<innerHeight)setTimeout(()=>t(i),250);else{let a=new IntersectionObserver(([r])=>{r.isIntersecting&&(a.disconnect(),t(i))},{rootMargin:"400px"});a.observe(i)}})}var it=`#version 300 es
void main() { vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`,rt=`#version 300 es
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
}`,pe=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255);function Ue(e,t){let i=document.createElement("canvas");i.className="moldura-tela",i.setAttribute("aria-hidden","true");let o=i.getContext("webgl2",{antialias:!1,alpha:!1});if(!o)return e.classList.add("no-gl"),()=>{};e.prepend(i);let a=(b,P)=>{let C=o.createShader(b);return o.shaderSource(C,P),o.compileShader(C),C},r=o.createProgram();if(o.attachShader(r,a(o.VERTEX_SHADER,it)),o.attachShader(r,a(o.FRAGMENT_SHADER,rt)),o.linkProgram(r),!o.getProgramParameter(r,o.LINK_STATUS))return i.remove(),e.classList.add("no-gl"),()=>{};o.useProgram(r),o.bindVertexArray(o.createVertexArray());let s=b=>o.getUniformLocation(r,b);o.uniform3fv(s("u_anil"),pe(t[0])),o.uniform3fv(s("u_coral"),pe(t[1])),o.uniform3fv(s("u_gelo"),pe(t[2]));let n=matchMedia("(prefers-reduced-motion: reduce)").matches,u=[.5,.5],l=[.5,.5],h=0,p=0,f=0,M=0,y=!0,v=performance.now(),c=()=>{let b=Math.min(devicePixelRatio||1,2);i.width=Math.max(1,Math.round(e.clientWidth*b)),i.height=Math.max(1,Math.round(e.clientHeight*b)),o.viewport(0,0,i.width,i.height)},m=b=>{o.uniform2f(s("u_res"),i.width,i.height),o.uniform1f(s("u_time"),b),o.uniform2f(s("u_mouse"),l[0],l[1]),o.uniform1f(s("u_hover"),p),o.drawArrays(o.TRIANGLES,0,3)},_=b=>{if(f=0,!y)return;let P=b-M;if(P>=31){let C=1e3/Math.max(1,P),X=1-Math.pow(.94,60/C),W=1-Math.pow(.96,60/C);l[0]+=(u[0]-l[0])*X,l[1]+=(u[1]-l[1])*X,p+=(h-p)*W,M=b,m((b-v)/1e3)}f=requestAnimationFrame(_)},E=b=>{let P=e.getBoundingClientRect();u=[(b.clientX-P.left)/P.width,1-(b.clientY-P.top)/P.height],h=1,n&&(l=u,p=1,m(18))},F=()=>{h=0};e.addEventListener("pointermove",E),e.addEventListener("pointerleave",F);let V=new ResizeObserver(()=>{c(),n&&m(18)});V.observe(e);let R=new IntersectionObserver(([b])=>{y=b.isIntersecting,y&&!n&&!f&&(f=requestAnimationFrame(_))},{rootMargin:"100px"});return R.observe(e),c(),n?m(18):f=requestAnimationFrame(_),()=>{cancelAnimationFrame(f),V.disconnect(),R.disconnect(),e.removeEventListener("pointermove",E),e.removeEventListener("pointerleave",F),o.getExtension("WEBGL_lose_context")?.loseContext(),i.remove()}}function Fe(e){let t=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((e||"").trim());if(!t)return null;let i=t[1].length===3?t[1].split("").map(o=>o+o).join(""):t[1];return[parseInt(i.slice(0,2),16),parseInt(i.slice(2,4),16),parseInt(i.slice(4,6),16)]}function at(e,t){let i=e<0?0:e>1?1:e;return Math.sqrt(i)*t*.56}function nt(e,t,i,o,a,r,s,n,u){let l=e-s,h=t-n,p=l*l+h*h;if(u>0&&p<u*u){let f=Math.sqrt(p)+.001,M=(1-f/u)*2.6;i+=l/f*M,o+=h/f*M}return i=(i+(a-e)*.05)*.84,o=(o+(r-t)*.05)*.84,[e+i,t+o,i,o]}function st(e,t,i,o,a){let r=Math.hypot(e-i,t-o);return a>0?Math.min(1,r/a):0}function ct(e,t){return e>0?t/e*100:0}function Ae(e,t){let i=e.querySelector("canvas"),o=i&&i.getContext("2d");if(!o)return()=>{};let a=window.matchMedia("(prefers-reduced-motion: reduce)").matches,r=0,s=0,n=1,u=-1e5,l=-1e5,h=0,p=!0,f=!0,M={x:0,y:0,t:-1},y=new Float32Array(0),v=0,c=null,m=Fe(t.colors.ink)||[233,228,218],_=Fe(t.colors.warm)||[233,118,43],E=()=>{r=Math.max(1,e.clientWidth),s=Math.max(1,e.clientHeight),n=Math.min(window.devicePixelRatio||1,2),i.width=Math.round(r*n),i.height=Math.round(s*n);let I=document.createElement("canvas");I.width=r,I.height=s;let B=I.getContext("2d",{willReadFrequently:!0});if(!B)return;B.font=t.fontWeight+" 100px "+t.fontFamily;let L=t.wordmark||" ",j=ct(B.measureText(L).width,r*1.02);B.font=t.fontWeight+" "+j+"px "+t.fontFamily;let G=B.measureText(L),O=G.actualBoundingBoxAscent||j*.72,A=Math.max(0,Math.min(.6,t.crop));B.fillStyle="#000",B.textBaseline="alphabetic",B.fillText(L,(r-G.width)/2,s+O*A);let k=B.getImageData(0,0,r,s).data,T=Math.max(3,t.dotGap),D=Math.ceil(r/T),q=Math.ceil(s/T),g=[];for(let x=0;x<q;x++)for(let S=0;S<D;S++){let $=0;for(let ee=0;ee<3;ee++)for(let de=0;de<3;de++){let We=Math.min(r-1,Math.floor(S*T+(de+.5)*T/3)),Ge=Math.min(s-1,Math.floor(x*T+(ee+.5)*T/3));$+=k[(Ge*r+We)*4+3]}let H=$/(9*255);if(H<.06)continue;let J=S*T+T/2,oe=x*T+T/2;g.push(J,oe,0,0,J,oe,at(H,T))}y=new Float32Array(g),v=g.length/7,c=document.createElement("canvas"),c.width=256,c.height=256;let w=c.getContext("2d");if(w){let x=w.createImageData(256,256);for(let S=0;S<x.data.length;S+=4){let $=Math.random()*255;x.data[S]=x.data[S+1]=x.data[S+2]=$,x.data[S+3]=Math.random()<.5?0:255}w.putImageData(x,0,0)}f=!0},F=I=>{o.setTransform(n,0,0,n,0,0),o.fillStyle=t.colors.background,o.fillRect(0,0,r,s);let B=t.interactive&&!a?Math.max(0,t.radius):0,L=M.t<0?1e9:I-M.t,j=L*.9,G=!1;for(let O=0;O<v;O++){let A=O*7,k=y[A],T=y[A+1],D=y[A+2],q=y[A+3],g=y[A+4],w=y[A+5];if(!a){if(L<900){let $=g-M.x,H=w-M.y,J=Math.sqrt($*$+H*H)+.001,oe=1-Math.min(1,Math.abs(J-j)/26);if(oe>0){let ee=oe*3.2*(1-L/900);D+=$/J*ee,q+=H/J*ee}}let S=nt(k,T,D,q,g,w,u,l,B);k=S[0],T=S[1],D=S[2],q=S[3],Math.abs(D)+Math.abs(q)>.02||Math.abs(k-g)+Math.abs(T-w)>.05?G=!0:(k=g,T=w,D=0,q=0),y[A]=k,y[A+1]=T,y[A+2]=D,y[A+3]=q}let x=st(k,T,g,w,28);o.fillStyle=x>.02?"rgb("+Math.round(m[0]+(_[0]-m[0])*x)+","+Math.round(m[1]+(_[1]-m[1])*x)+","+Math.round(m[2]+(_[2]-m[2])*x)+")":t.colors.ink,o.beginPath(),o.arc(k,T,y[A+6],0,6.2832),o.fill()}if(c&&t.grain>0){o.globalAlpha=Math.min(1,t.grain)*.09,o.globalCompositeOperation="overlay";let O=o.createPattern(c,"repeat");O&&(o.fillStyle=O,o.fillRect(0,0,r,s)),o.globalAlpha=1,o.globalCompositeOperation="source-over"}f=G||L<900||u>-1e4},V=I=>{h=0,p&&(F(I),f&&(h=requestAnimationFrame(V)))},R=()=>{f=!0,!h&&p&&(h=requestAnimationFrame(V))},b=I=>{let B=i.getBoundingClientRect();return[(I.clientX-B.left)*r/(B.width||r),(I.clientY-B.top)*s/(B.height||s)]},P=I=>{if(!t.interactive)return;let B=b(I);u=B[0],l=B[1],R()},C=()=>{u=-1e5,l=-1e5,R()},X=I=>{if(!t.interactive||a||I.target.closest("a,button"))return;let B=b(I);M={x:B[0],y:B[1],t:performance.now()},R()};E(),F(performance.now()),R(),e.addEventListener("pointermove",P),e.addEventListener("pointerleave",C),e.addEventListener("pointerdown",X);let W=new ResizeObserver(()=>{E(),R()});W.observe(e);let se=new IntersectionObserver(I=>{p=I[0]?I[0].isIntersecting:!0,p&&R()});return se.observe(e),document.fonts&&document.fonts.ready&&document.fonts.ready.then(()=>{E(),R()}),()=>{cancelAnimationFrame(h),W.disconnect(),se.disconnect()}}var le=class{constructor(t,i,o){this.x=t,this.v=0,this.target=t,this.k=i,this.d=o}step(t){let i=this.k*(this.target-this.x)-this.d*this.v;return this.v+=i*t,this.x+=this.v*t,this.x}},fe=(e,t,i)=>Math.min(i,Math.max(t,e)),lt=11/14,ut=15/14;function Te(e,{maxTilt:t=14,stiffness:i=120,damping:o=10}={}){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;let a=t*ut,r=t*lt,s=new le(0,i,o),n=new le(0,i,o),u={px:.5,py:.5,hovering:!1},l=0,h=0,p=!0;e.classList.add("hc");let f=(m,_)=>{e.style.transform=`perspective(1100px) rotateX(${m.toFixed(3)}deg) rotateY(${_.toFixed(3)}deg)`,e.style.setProperty("--hc-px",u.px.toFixed(4)),e.style.setProperty("--hc-py",u.py.toFixed(4)),e.style.setProperty("--hc-hue",(_*4+(u.px-.5)*40).toFixed(2));let E=(Math.abs(m)+Math.abs(_))/Math.max(1,r+a);e.style.setProperty("--hc-glare-o",(.22+E*.4).toFixed(3))},M=m=>{l=0,h||(h=m);let _=fe((m-h)/1e3,0,.05);if(h=m,!u.hovering){s.target=0,n.target=0;let R=Math.min(1,_*2);u.px+=(.5-u.px)*R,u.py+=(.5-u.py)*R}let E=s.step(_),F=n.step(_);if(f(E,F),!u.hovering&&Math.abs(E)+Math.abs(F)<.02&&Math.abs(s.v)+Math.abs(n.v)<.02){e.style.transform="",h=0;return}p&&(l=requestAnimationFrame(M))},y=()=>{l||(l=requestAnimationFrame(M))},v=m=>{if(m.pointerType==="touch")return;let _=e.getBoundingClientRect();if(!_.width||!_.height)return;let E=fe((m.clientX-_.left)/_.width,0,1),F=fe((m.clientY-_.top)/_.height,0,1);u.px=E,u.py=F,u.hovering=!0,n.target=(E-.5)*2*a,s.target=-(F-.5)*2*r,y()},c=()=>{u.hovering=!1,y()};e.addEventListener("pointermove",v),e.addEventListener("pointerleave",c),e.addEventListener("pointercancel",c),new IntersectionObserver(m=>{p=m[0].isIntersecting,p&&y()}).observe(e)}var U=(e,t,i)=>{let o=document.createElement(e);return t&&(o.className=t),i!=null&&(o.textContent=i),o},ke=e=>{let t=U("div","m-mock m-chart");return e.forEach(i=>{let o=U("span",i>30?"on":"");o.style.setProperty("height",i+"%"),t.append(o)}),t},Ie=(e,t,i)=>{let o=U("div","m-mock m-toggle"),a=U("div","m-seg");return a.append(U("span","on",e),U("span","",t)),o.append(a,U("span","m-price",i)),o},dt=[{kind:"foto",kicker:"Onde",title:"Academia",src:"img/local-academia.webp"},{kind:"treino",title:"Corpo inteiro A",body:"Agachamento no rack \xB7 Supino com halteres \xB7 Remada curvada \xB7 Prancha com toque no ombro",tags:["segunda","3 s\xE9ries"]},{kind:"fala",nome:"Renata Alc\xE2ntara",text:"Com tr\xEAs dias por semana que cabem antes do trabalho, estou h\xE1 oito meses sem falhar uma semana."},{kind:"ui",kicker:"Ritmo",title:"Tr\xEAs dias por semana",mock:()=>ke([92,14,76,14,88,14,14])},{kind:"foto",kicker:"Onde",title:"Em casa",src:"img/local-casa.webp"},{kind:"treino",title:"Plano por escrito",body:"V\xEDdeo curto de cada exerc\xEDcio, carga sugerida e o que fazer se perder um dia.",tags:["m\xE9todo"]},{kind:"fala",nome:"Jonas Peralta",text:"Achei que consultoria online fosse s\xF3 uma planilha. Recebi v\xEDdeo de cada exerc\xEDcio."},{kind:"ui",kicker:"Formato",title:"Presencial ou online",mock:()=>Ie("Presencial","Online","2 a 5 dias")}],mt=[{kind:"foto",kicker:"Onde",title:"Ao ar livre",src:"img/local-arlivre.webp"},{kind:"treino",title:"Corpo inteiro B",body:"Levantamento terra romeno \xB7 Desenvolvimento com halteres \xB7 Puxada na polia \xB7 Rota\xE7\xE3o na polia",tags:["quarta","3 s\xE9ries"]},{kind:"ui",kicker:"Ritmo",title:"Quatro dias por semana",mock:()=>ke([90,78,14,86,72,14,14])},{kind:"fala",nome:"Cleide Marquezini",text:"Comecei aos 58 anos querendo s\xF3 subir escada sem cansar. Hoje fa\xE7o agachamento com carga."},{kind:"foto",kicker:"M\xE9todo",title:"Avalia\xE7\xE3o na semana 1",src:"img/metodo-avaliacao.webp"},{kind:"treino",title:"Ajuste a cada 4 semanas",body:"A gente mede o que mudou e troca o que precisa. O ciclo curto mant\xE9m o resultado vindo.",tags:["m\xE9todo"]},{kind:"foto",kicker:"M\xE9todo",title:"Carga que sobe aos poucos",src:"img/metodo-ajuste.webp"},{kind:"ui",kicker:"Aula de experi\xEAncia",title:"50 minutos",mock:()=>Ie("Presencial","Cuiab\xE1","sem custo")}];function ht(e,t){let i=U("article","esteira-card esteira-"+e.kind);if(t&&i.setAttribute("aria-hidden","true"),e.kind==="foto"){let o=U("img","esteira-foto");o.src=e.src,o.alt="",o.loading="lazy",o.decoding="async",o.width=420,o.height=270,i.append(o,U("span","esteira-kicker",e.kicker),U("h3","esteira-title",e.title))}else if(e.kind==="treino"){let o=U("div","esteira-foot"),a=U("div","esteira-tags");e.tags.forEach(r=>a.append(U("span","",r))),o.append(a),i.append(U("span","esteira-kicker","Treino"),U("h3","esteira-title",e.title),U("p","esteira-body",e.body),o)}else if(e.kind==="fala"){let o=U("div","esteira-post-head");o.append(U("span","esteira-avatar"),U("span","esteira-handle",e.nome)),i.append(o,U("p","esteira-post",e.text),U("span","esteira-kicker esteira-ficticio","depoimento fict\xEDcio"))}else i.append(U("span","esteira-kicker",e.kicker),U("h3","esteira-title",e.title),e.mock());return i}function Pe(e){e.querySelector(".esteira__row")||[dt,mt].forEach(v=>{let c=U("div","esteira__row");[0,1,2].forEach(m=>v.forEach(_=>c.append(ht(_,m>0)))),e.append(c)});let t=Array.from(e.querySelectorAll(".esteira__row")),i=matchMedia("(prefers-reduced-motion: reduce)").matches,o=matchMedia("(max-width: 900px)"),a=18,r=[0,0],s=()=>{r=t.map(v=>(v.scrollWidth+parseFloat(getComputedStyle(v).columnGap))/3)},n=0,u=performance.now(),l=0,h=!1,p=v=>{l=0,i||(n+=Math.min(64,v-u)*(a/1e3)),u=v;let c=o.matches?.2:.3,_=(i?0:(innerHeight-e.getBoundingClientRect().top)*c)+n,E=r.map(F=>F?(_%F+F)%F:0);t[0].style.transform=`translate3d(${E[0]-r[0]}px, 0, 0)`,t[1].style.transform=`translate3d(${-E[1]}px, 0, 0)`,h&&!i&&(l=requestAnimationFrame(p))},f=()=>{l||(l=requestAnimationFrame(p))};s(),p(performance.now());let M=new IntersectionObserver(([v])=>{h=v.isIntersecting,u=performance.now(),h&&f()});M.observe(e);let y=new ResizeObserver(()=>{s(),f()});return t.forEach(v=>y.observe(v)),()=>{M.disconnect(),y.disconnect(),cancelAnimationFrame(l)}}function ze(e){matchMedia("(hover: hover) and (pointer: fine)").matches&&document.querySelectorAll(e).forEach(t=>{t.classList.add("tem-luz"),t.addEventListener("pointermove",i=>{let o=t.getBoundingClientRect();t.style.setProperty("--lx",(i.clientX-o.left).toFixed(0)+"px"),t.style.setProperty("--ly",(i.clientY-o.top).toFixed(0)+"px"),t.classList.add("luz-on")}),t.addEventListener("pointerleave",()=>{t.classList.remove("luz-on"),t.style.setProperty("--lx","0px"),t.style.setProperty("--ly","0px")})})}function Ve(e,t){if(!e||innerWidth<901||matchMedia("(prefers-reduced-motion: reduce)").matches)return;let i=0,o=!1,a=()=>{i=0;let s=t.getBoundingClientRect(),n=Math.min(1,Math.max(0,(innerHeight-s.top)/(innerHeight+s.height)));e.style.transform=`translate3d(0, ${(n*160-60).toFixed(1)}px, 0) rotate(${(n*14-7).toFixed(2)}deg) scale(${(.94+n*.14).toFixed(3)})`},r=()=>{o&&!i&&(i=requestAnimationFrame(a))};new IntersectionObserver(([s])=>{o=s.isIntersecting,r()}).observe(t),addEventListener("scroll",r,{passive:!0}),a()}var pt=matchMedia("(prefers-reduced-motion: reduce)").matches,De=matchMedia("(min-width: 901px) and (pointer: fine)").matches,ue=(()=>{try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}})(),N=e=>document.querySelector(e),Y=(e,t)=>{try{t()}catch(i){console.warn("premium: "+e+" ficou na vers\xE3o simples",i)}},Ce=N("#sigilo-palco"),Le=N("#sigilo-3d");Ce&&Le&&De&&ue&&!pt&&(document.documentElement.classList.add("premium-3d"),import("./parte-6BTTQ6A4.js").then(e=>e.montarSigilo3D(Le,Ce)).catch(e=>{console.warn("premium: o s\xEDmbolo ficou em imagem",e),document.documentElement.classList.remove("premium-3d"),document.dispatchEvent(new Event("sigilo-em-imagem"))}));function Oe(){let e=N(".abertura");e&&ue&&Y("moldura",()=>Ue(e,["#081250","#1a33b5","#6f86f5"]));let t=N("#cromo-titulo"),i=N("#titulo-abertura");t&&i&&ue&&Y("cromo",()=>{let r=t.dataset.texto;he(r).then(s=>{t.style.setProperty("aspect-ratio",s.w+" / "+s.h),Re(t,r,()=>i.classList.add("tem-cromo"))})}),ue&&"OffscreenCanvas"in window&&Y("merc\xFArio",()=>Be());let o=N(".esteira");o&&Y("esteira",()=>Pe(o));let a=N("#hwf");a&&Y("halftone",()=>Ae(a,{wordmark:a.dataset.palavra,colors:{background:"#050709",ink:"#aeb6c2",warm:"#8fa2ff"},dotGap:innerWidth<600?5:6,radius:80,crop:.2,grain:.5,interactive:!0,fontFamily:'Archivo, "Helvetica Neue", Arial, sans-serif',fontWeight:800})),De&&Y("holo",()=>document.querySelectorAll(".etapa").forEach(r=>Te(r,{maxTilt:9}))),Y("luz",()=>ze(".resultado-plano, .resultado-calc, .confirmacao, .detalhes-tecnicos")),Y("marca",()=>Ve(N(".marca-fantasma"),N("#metodo")))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Oe):Oe();
