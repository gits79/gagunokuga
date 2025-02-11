// 기하학 관련 유틸리티 함수들
/**
 * 두 선분의 교차점을 계산합니다.
 * @param {Object} line1 - 첫 번째 선분 {x1, y1, x2, y2}
 * @param {Object} line2 - 두 번째 선분 {x1, y1, x2, y2}
 * @returns {Object|null} 교차점 좌표 {x, y} 또는 교차하지 않을 경우 null
 */
export const getIntersection = (line1, line2) => {
  const x1 = line1.x1, y1 = line1.y1;
  const x2 = line1.x2, y2 = line1.y2;
  const x3 = line2.x1, y3 = line2.y1;
  const x4 = line2.x2, y4 = line2.y2;
  
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 0.001) return null;
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
  
  if (t < -0.001 || t > 1.001 || u < -0.001 || u > 1.001) return null;
  
  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1)
  };
};

/**
 * 점과 선분 사이의 최단 거리가 되는 선분 위의 점을 계산합니다.
 * @param {Object} start - 선분의 시작점 {x, y}
 * @param {Object} end - 선분의 끝점 {x, y}
 * @param {Object} point - 대상 점 {x, y}
 * @returns {Object} 선분 위의 최단 거리 점 {x, y}
 */
export const getClosestPointOnLine = (start, end, point) => {
  const lengthSquared = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
  if (lengthSquared === 0) return start;
  
  let t = ((point.x - start.x) * (end.x - start.x) + 
           (point.y - start.y) * (end.y - start.y)) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  
  return { 
    x: start.x + t * (end.x - start.x), 
    y: start.y + t * (end.y - start.y) 
  };
};

/**
 * 좌표를 정수로 반올림합니다.
 * @param {Object} point - 입력 좌표 {x, y}
 * @returns {Object} 반올림된 좌표 {x, y}
 */
export const roundPoint = (point) => ({
  x: Math.round(point.x),
  y: Math.round(point.y)
});

/**
 * 시작점과 끝점을 기준으로 수직/수평 정렬된 점을 계산합니다.
 * @param {Object} start - 시작점 {x, y}
 * @param {Object} end - 끝점 {x, y}
 * @returns {Object} 정렬된 좌표 {x, y}
 */
export const getOrthogonalPoint = (start, end) => roundPoint({
  x: Math.abs(end.x - start.x) > Math.abs(end.y - start.y) ? end.x : start.x,
  y: Math.abs(end.x - start.x) > Math.abs(end.y - start.y) ? start.y : end.y
});

/**
 * 좌표가 허용 범위 내에 있는지 확인합니다.
 * @param {Object} coords - 확인할 좌표 {x, y}
 * @returns {boolean} 범위 내 여부
 */
export const isInBoundary = (coords) => {
  const BOUNDARY = { min: -50000, max: 50000 };
  return coords.x >= BOUNDARY.min && coords.x <= BOUNDARY.max && 
         coords.y >= BOUNDARY.min && coords.y <= BOUNDARY.max;
}; 