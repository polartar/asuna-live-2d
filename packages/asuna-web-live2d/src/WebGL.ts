export class WebGL {
  gl: WebGLRenderingContext
  framebuffer: WebGLFramebuffer

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext
    if (!this.gl) {
      document.body.innerHTML = 'WebGL failed to initialize.'
      throw new Error('unable to init webgl')
    }
    this.framebuffer = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)
  }

  bindTexture(img: HTMLImageElement, premultiply: boolean): WebGLTexture {
    const gl = this.gl
    let tex = gl.createTexture() as WebGLTexture

    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    if (premultiply) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)

    return tex
  }
}