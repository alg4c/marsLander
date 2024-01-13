class Svg {
  constructor(id) {
    this.id = id;
    this.nameSpace = "http://www.w3.org/2000/svg";
    this.DOMreference = document.getElementById(id);
  }
  drawLine(className, ...coordinates) {
    const pLine = document.createElementNS(this.nameSpace, "polyline");
    pLine.setAttribute("points", coordinates.join(" "));
    pLine.setAttribute("class", className);
    this.DOMreference.appendChild(pLine);
  }
}

export default Svg;
