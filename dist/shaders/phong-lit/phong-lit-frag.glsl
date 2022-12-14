precision highp float;

// Uniforms matrice.
uniform mat4 uV;

// Uniform light data.
uniform vec3 uDirLight;

// Textures.
uniform sampler2D tex1;
uniform sampler2D tex2;

// Camera space position.
varying vec3 fPosition;
// Vertex color.
varying vec4 fColor;
// Model space normal.
varying vec3 fNormal;
// Texture coordinates.
varying vec2 fTexCoord;

// Ambient light.
const vec4 ambientColor = vec4(1);
const float ambientIntensity = 0.05;
// Specular settings.
const float maxSpecularExp = 128.0;
const float minSpecularExp = 16.0;
// Sun light.
const vec4 dirLightColor = vec4(1);
const float dirLightIntensity = 1.0;

vec2 getDiffuseSpecular(vec3 l, vec3 h, vec3 n, float di, float si, float s) {
  // Diffuse light.
  float diffuseIntensity = max(0.0, dot(n, l));
  diffuseIntensity = diffuseIntensity * di;

  // Specular light.
  float specularIntensity = max(0.0, pow(max(0.0, dot(n, h)), s));
  specularIntensity = specularIntensity * si * s;

  return vec2(diffuseIntensity, specularIntensity);
}

void main() {
  // Base color.
  vec4 baseColor = texture2D(tex1, fTexCoord);
  vec4 waterMap = texture2D(tex2, fTexCoord);

  // Constants.
  vec3 n = normalize(fNormal);
  vec3 e = normalize(-fPosition);

  // Ambient light.
  vec4 ambientLight = ambientColor * ambientIntensity;

  // Sun light.
  vec3 lightDir = (uV * vec4(uDirLight, 0)).xyz;
  vec3 sl = normalize(lightDir);
  vec3 sh = normalize(e + sl);

  float specExp = mix(minSpecularExp, maxSpecularExp, waterMap.x);
  vec2 sds = getDiffuseSpecular(sl, sh, n, dirLightIntensity, dirLightIntensity / 100., specExp);

  vec4 dirLight = dirLightColor * sds.x;
  dirLight = dirLight + dirLightColor * sds.y;

  vec4 color = vec4(0, 0, 0, 1);
    // Apply ambient light.
  color = color + baseColor * ambientLight;
    // Apply sun light.
  color = color + baseColor * dirLight;

  gl_FragColor = color;
}