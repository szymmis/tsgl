precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;

float u_thickness = 0.25;

void main() {
    // if(u_thickness >= 0.5 || v_texCoord.y > 1.0 - u_thickness || v_texCoord.y < u_thickness || v_texCoord.x > 1.0 - u_thickness || v_texCoord.x < u_thickness) {
    //     gl_FragColor = vec4(.25, 1, .1, 1);
    // }
    gl_FragColor = texture2D(u_image, v_texCoord);
    //  else {
    //     gl_FragColor = vec4(0, 0, 0, 0);
    // }
    // gl_FragColor = vec4(1, 0, 0, 1);
}