export const createViewModule = (draw) => {
  const viewbox = {
    x: -2000,
    y: -2000,
    width: 4000,
    height: 4000
  };

  let isPanning = false;
  let panStart = { x: 0, y: 0 };

  // 뷰박스 업데이트 함수
  const updateViewbox = () => {
    draw.viewbox(viewbox.x, viewbox.y, viewbox.width, viewbox.height);
  };

  // 팬 컨트롤
  const panControls = {
    start: (event) => {
      isPanning = true;
      panStart = { x: event.clientX, y: event.clientY };
    },

    move: (event) => {
      if (!isPanning) return;
      const dx = (event.clientX - panStart.x) * viewbox.width / draw.node.clientWidth;
      const dy = (event.clientY - panStart.y) * viewbox.height / draw.node.clientHeight;
      viewbox.x -= dx;
      viewbox.y -= dy;
      updateViewbox();
      panStart = { x: event.clientX, y: event.clientY };
    },

    stop: () => {
      isPanning = false;
    }
  };

  // 줌 컨트롤
  const zoomCanvas = (event) => {
    const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
    const point = draw.node.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(draw.node.getScreenCTM().inverse());
    
    const newWidth = viewbox.width * zoomFactor;
    const newHeight = viewbox.height * zoomFactor;
    const dx = (svgPoint.x - viewbox.x) * (newWidth / viewbox.width - 1);
    const dy = (svgPoint.y - viewbox.y) * (newHeight / viewbox.height - 1);
    
    viewbox.x -= dx;
    viewbox.y -= dy;
    viewbox.width = newWidth;
    viewbox.height = newHeight;
    
    updateViewbox();
  };

  // 줌 인/아웃 함수 추가
  const zoomIn = () => {
    const zoomFactor = 0.9;  // 10% 줌 인
    const centerX = viewbox.x + viewbox.width / 2;
    const centerY = viewbox.y + viewbox.height / 2;
    
    const newWidth = viewbox.width * zoomFactor;
    const newHeight = viewbox.height * zoomFactor;
    
    viewbox.x = centerX - newWidth / 2;
    viewbox.y = centerY - newHeight / 2;
    viewbox.width = newWidth;
    viewbox.height = newHeight;
    
    updateViewbox();
  };

  const zoomOut = () => {
    const zoomFactor = 1.1;  // 10% 줌 아웃
    const centerX = viewbox.x + viewbox.width / 2;
    const centerY = viewbox.y + viewbox.height / 2;
    
    const newWidth = viewbox.width * zoomFactor;
    const newHeight = viewbox.height * zoomFactor;
    
    viewbox.x = centerX - newWidth / 2;
    viewbox.y = centerY - newHeight / 2;
    viewbox.width = newWidth;
    viewbox.height = newHeight;
    
    updateViewbox();
  };

  return {
    viewbox,
    isPanning,
    panControls,
    zoomCanvas,
    updateViewbox,
    zoomIn,    // 새로 추가된 함수들
    zoomOut    // 새로 추가된 함수들
  };
}; 