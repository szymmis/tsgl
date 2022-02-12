attribute vec2 a_texCoord;
attribute vec2 a_translation;
attribute float a_rotation;
attribute vec2 a_scale;
attribute vec4 a_region;

uniform vec2 u_resolution;
uniform vec2 u_worldScale;
uniform vec2 u_textureSize;

varying vec2 v_texCoord;

void main() {
    vec2 pre_rotated = (a_texCoord - vec2(0.5, 0.5));
    vec2 post_rotated = vec2(pre_rotated.x * cos(a_rotation) - pre_rotated.y * sin(a_rotation), pre_rotated.x * sin(a_rotation) + pre_rotated.y * cos(a_rotation));
    vec2 scaled = (post_rotated + vec2(0.5, 0.5)) * a_scale + a_translation;
    gl_Position = vec4((scaled * u_worldScale / u_resolution) * 2.0 - 1.0, 0, 1);

    v_texCoord = vec2((a_texCoord.x * a_region.z + a_region.x) / u_textureSize.x, ((1.0 - a_texCoord.y) * a_region.w + a_region.y) / u_textureSize.y);
}