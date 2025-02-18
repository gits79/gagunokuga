export const gridModule = {
  // 그리드 생성
  createGrid: (draw) => {
    const GRID_BOUNDARY = { min: -50000, max: 50000 };
    
    // 기존 그리드 제거
    draw.find(".grid-line").forEach(line => line.remove());
    
    // 그리드 그룹 생성
    const gridGroup = draw.group().addClass('grid-group');
    
    // 일반 그리드 라인
    for (let i = GRID_BOUNDARY.min; i <= GRID_BOUNDARY.max; i += 100) {
      const color = i % 1000 === 0 ? "#111" : "#555";
      const width = i % 1000 === 0 ? 1 : 0.5;
      gridGroup.line(GRID_BOUNDARY.min, i, GRID_BOUNDARY.max, i)
        .stroke({ width, color })
        .addClass("grid-line");
      gridGroup.line(i, GRID_BOUNDARY.min, i, GRID_BOUNDARY.max)
        .stroke({ width, color })
        .addClass("grid-line");
    }
    
    // 중심축
    gridGroup.line(GRID_BOUNDARY.min, 0, GRID_BOUNDARY.max, 0)
      .stroke({ width: 10, color: "#000" })
      .addClass("grid-line");
    gridGroup.line(0, GRID_BOUNDARY.min, 0, GRID_BOUNDARY.max)
      .stroke({ width: 10, color: "#000" })
      .addClass("grid-line");
    
    // 경계선
    [GRID_BOUNDARY.min, GRID_BOUNDARY.max].forEach(pos => {
      gridGroup.line(pos, GRID_BOUNDARY.min, pos, GRID_BOUNDARY.max)
        .stroke({ width: 50, color: "#f00" })
        .addClass("grid-line");
      gridGroup.line(GRID_BOUNDARY.min, pos, GRID_BOUNDARY.max, pos)
        .stroke({ width: 50, color: "#f00" })
        .addClass("grid-line");
    });

    // 그리드를 가장 아래로
    gridGroup.back();
  },

  // 그리드 표시/숨김 함수 추가
  toggleGrid: (draw, show) => {
    draw.find(".grid-line").forEach(line => {
      if (show) {
        line.show();
      } else {
        line.hide();
      }
    });
  }
}; 