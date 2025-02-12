// 좌표와 수치 계산 관련 유틸리티 함수들
export const coordinateUtils = {
  // 점 좌표 보정
  roundPoint: (point) => ({
    x: Math.round(point.x),
    y: Math.round(point.y)
  }),

  // 밀리미터 단위 보정
  snapToMillimeter: (value) => Math.round(value),

  // 선분 위의 가장 가까운 점 찾기
  getClosestPointOnLine: (start, end, point) => {
    const lengthSquared = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
    if (lengthSquared === 0) return start;
    let t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    return { x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) };
  },

  // 직각 보정
  getOrthogonalPoint: (start, end) => ({
    x: Math.abs(end.x - start.x) > Math.abs(end.y - start.y) ? end.x : start.x,
    y: Math.abs(end.x - start.x) > Math.abs(end.y - start.y) ? start.y : end.y
  }),

  // 경계 체크
  isInBoundary: (coords) => {
    const BOUNDARY = { min: -50000, max: 50000 };
    return coords.x >= BOUNDARY.min && coords.x <= BOUNDARY.max && 
           coords.y >= BOUNDARY.min && coords.y <= BOUNDARY.max;
  }
};

// SVG 관련 유틸리티
export const svgUtils = {
  // 마우스 좌표를 SVG 좌표로 변환
  getSVGCoordinates: (event, draw) => {
    const point = draw.node.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(draw.node.getScreenCTM().inverse());
  }
}; 