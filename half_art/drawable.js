function Drawable () {
  this.createAndAppend = function (parent) {
    this.element = document.createElement('canvas')
    parent.appendChild(this.element)
    this.context2d = this.element.getContext('2d')
  }
  this.resize = function (size) {
    this.element.width = size.width
    this.element.height = size.height
  }

  this.fill = function (color) {
    this.context2d.fillStyle = color
    this.context2d.fillRect(0, 0, this.element.width, this.element.height);
  }

  this.getSize = function () {
    return {
      width: this.element.width,
      height: this.element.height
    }
  }
  this.clear = function () {
    this.context2d.clearRect(0, 0, this.element.width, this.element.height)
  }

  this.element = null
  this.context2d = null
}

export default Drawable
