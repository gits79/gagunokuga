import { reactive } from 'vue';

export const createToolModule = () => {
  const toolState = reactive({
    currentTool: "select",
    wallThickness: 100,
    snapDistance: 100,
    showLengthLabels: localStorage.getItem('showLengthLabels') !== 'false',
    isSpacePressed: false,
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
    localStorage.setItem('showLengthLabels', toolState.showLengthLabels);
  };

  // 스페이스바 상태 제어 함수
  const setSpacePressed = (pressed) => {
    toolState.isSpacePressed = pressed;
  };

  // 키보드 이벤트 리스너 설정
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      setSpacePressed(true);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setSpacePressed(false);
    }
  });

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
        onMouseDown: wallHandlers.onMouseDown,
        onMouseMove: wallHandlers.onMouseMove,
        onMouseUp: wallHandlers.onMouseUp
      },
      rect: {
        onClick: rectHandlers.onClick,
        onMouseDown: rectHandlers.onMouseDown,
        onMouseMove: rectHandlers.onMouseMove,
        onMouseUp: rectHandlers.onMouseUp
      }
    };
  };

  return {
    toolState,
    setCurrentTool,
    setWallThickness,
    setSnapDistance,
    toggleLengthLabels,
    createToolHandlers,
    setSpacePressed,
  };
}; 