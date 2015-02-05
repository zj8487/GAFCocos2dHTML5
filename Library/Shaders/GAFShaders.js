gaf.SHADER_GAUSSIAN_BLUR_FRAG =
    "varying mediump vec2 v_texCoord;\n"
    + "uniform mediump vec2 u_step;\n"
    + "void main()\n"
    + "{ \n"
    + "    mediump vec4 sum = vec4(0.0);                                      \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 4.0) * 0.05;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 0.0) * 0.18;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 4.0) * 0.05;   \n"
    + "    gl_FragColor = sum;                                                \n"
    + "} \n";

gaf.SHADER_GLOW_FRAG =
    "varying mediump vec2 v_texCoord;\n"
    + "uniform mediump vec2 u_step;\n"
    + "uniform mediump vec4 u_glowColor;\n"
    + "void main()\n"
    + "{ \n"
    + "    mediump vec4 sum = vec4(0.0);                                      \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 4.0) * 0.05;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 0.0) * 0.18;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 4.0) * 0.05;   \n"
    + "    gl_FragColor = sum * u_glowColor;                                  \n"
    + "} \n";

gaf.SHADER_COLOR_MATRIX_FRAG =
    "varying mediump vec2 v_texCoord;\n"
    + "varying mediump vec4 v_fragmentColor;\n"
    + "uniform mediump vec4 colorTransformMult;\n"
    + "uniform mediump vec4 colorTransformOffsets;\n"
    + "uniform mediump mat4 colorMatrix;\n"
    + "uniform mediump vec4 colorMatrix2;\n"
    + "void main()\n"
    + "{ \n"
    + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);                          \n"
    + "    const float kMinimalAlphaAllowed = 1.0e-8;                                   \n"
    + "    //if (texColor.a > kMinimalAlphaAllowed)                                       \n"
    + "    {                                                                            \n"
    + "        texColor = vec4(texColor.rgb / texColor.a, texColor.a);                  \n"
    + "        vec4 ctxColor = texColor * colorTransformMult + colorTransformOffsets;   \n"
    + "        vec4 adjustColor = colorMatrix * ctxColor + colorMatrix2;                \n"
    + "        adjustColor *= v_fragmentColor;                                          \n"
    + "        texColor = vec4(adjustColor.rgb * adjustColor.a, adjustColor.a);         \n"
    + "    }                                                                            \n"
    + "    gl_FragColor = texColor;                                                     \n"
    + "}\n";
