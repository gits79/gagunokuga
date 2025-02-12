export const gridModule = {
  // 그리드 생성
  createGrid: (draw) => {
    const GRID_BOUNDARY = { min: -50000, max: 50000 };
    
    // 기존 그리드 제거
    draw.find(".grid-line").forEach(line => line.remove());
    
    // 일반 그리드 라인
    for (let i = GRID_BOUNDARY.min; i <= GRID_BOUNDARY.max; i += 100) {
      const color = i % 1000 === 0 ? "#111" : "#555";
      const width = i % 1000 === 0 ? 1 : 0.5;
      draw.line(GRID_BOUNDARY.min, i, GRID_BOUNDARY.max, i)
        .stroke({ width, color })
        .addClass("grid-line");
      draw.line(i, GRID_BOUNDARY.min, i, GRID_BOUNDARY.max)
        .stroke({ width, color })
        .addClass("grid-line");
    }
    
    // 중심축
    draw.line(GRID_BOUNDARY.min, 0, GRID_BOUNDARY.max, 0)
      .stroke({ width: 10, color: "#000" })
      .addClass("grid-line");
    draw.line(0, GRID_BOUNDARY.min, 0, GRID_BOUNDARY.max)
      .stroke({ width: 10, color: "#000" })
      .addClass("grid-line");
    
    // 경계선
    [GRID_BOUNDARY.min, GRID_BOUNDARY.max].forEach(pos => {
      draw.line(pos, GRID_BOUNDARY.min, pos, GRID_BOUNDARY.max)
        .stroke({ width: 50, color: "#f00" })
        .addClass("grid-line");
      draw.line(GRID_BOUNDARY.min, pos, GRID_BOUNDARY.max, pos)
        .stroke({ width: 50, color: "#f00" })
        .addClass("grid-line");
    });
  }
}; 