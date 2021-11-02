attribute vec2 a_texCoord;
// attribute vec2 a_position;

uniform vec2 u_resolution;

uniform vec2 u_translation;
uniform vec2 u_scale;
uniform float u_rotation;

varying vec2 v_texCoord;

void main() {
    vec2 pre_rotated = (a_texCoord - vec2(0.5, 0.5));
    vec2 post_rotated = vec2(pre_rotated.x * cos(u_rotation) - pre_rotated.y * sin(u_rotation), pre_rotated.x * sin(u_rotation) + pre_rotated.y * cos(u_rotation));
    vec2 scaled = (post_rotated + vec2(0.5, 0.5)) * u_scale + u_translation;
    gl_Position = vec4((scaled / u_resolution) * 2.0 - 1.0, 0, 1);

    v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
}