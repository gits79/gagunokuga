import { reactive } from 'vue';

export const createToolModule = () => {
  const toolState = reactive({
    currentTool: "select",
    wallThickness: 100,
    snapDistance: 100,
    showLengthLabels: true
  });

  // 도구 상태 변경 함수들
  const setCurrentTool = (tool) => {
    toolState.currentTool = tool;
  };

  const setWallThickness = (thickness) => {
    toolState.wallThickness = thickness;
  };

  const setSnapDistance = (distance) => {
    toolState.snapDistance = distance;
  };

  const toggleLengthLabels = () => {
    toolState.showLengthLabels = !toolState.showLengthLabels;
  };

  // 도구별 이벤트 핸들러 생성 함수
  const createToolHandlers = ({ 
    selectHandlers, 
    wallHandlers, 
    rectHandlers 
  }) => {
    return {
      select: {
        onClick: selectHandlers.onClick,
        onMouseDown: selectHandlers.onMouseDown,
        onMouseMove: selectHandlers.onMouseMove,
        onMouseUp: selectHandlers.onMouseUp
      },
      wall: {
        onClick: wallHandlers.onClick,
        onMouseMove: wallHandlers.onMouseMove
      },
      rect: {
        onClick: rectHandlers.onClick,
        onMouseMove: rectHandlers.onMouseMove
      }
    };
  };

  return {
    toolState,
    setCurrentTool,
    setWallThickness,
    setSnapDistance,
    toggleLengthLabels,
    createToolHandlers
  };
}; 