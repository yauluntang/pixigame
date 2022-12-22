
class UtilsClass {
  RandInt: Function = (minimum: number, maximum: number): number => {
    return Math.floor(Math.random() * (Math.round(maximum) - Math.round(minimum) + 1)) + Math.round(minimum);
  }
}
const Utils = new UtilsClass();
export default Utils;

export class TdMap {
  map: Map<number, Map<number, any>> = new Map();
  set(x: number, y: number, value: any): void {
    let yMap = this.map.get(x);
    if (!yMap) {
      yMap = new Map<number, any>();
      this.map.set(x, yMap);
    }
    yMap.set(y, value);
  }

  get(x: number, y: number): any {
    let yMap = this.map.get(x);
    if (!yMap) {
      return null;
    }
    return yMap.get(y) || null;
  }

  has(x: number, y: number): any {
    let yMap = this.map.get(x);
    if (!yMap) {
      return false;
    }
    return yMap.has(y);
  }

  forEach(callbackFn: any): void {
    this.map.forEach((yMap: Map<number, any>, x: number, map: Map<number, Map<number, any>>) => {
      yMap.forEach((value: any, y: number) => {
        callbackFn(value, x, y, map);
      });
    })
  }
}