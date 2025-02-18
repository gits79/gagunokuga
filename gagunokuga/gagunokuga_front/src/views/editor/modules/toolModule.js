import { reactive } from 'vue';

export const createToolModule = () => {
  const MIN_THICKNESS = 50;  // 최소 두께 상수 추가

  const toolState = reactive({
    currentTool: "select",
    wallThickness: Math.max(100, MIN_THICKNESS),  // 초기값도 최소값 체크
    snapDistance: 100,
    showLengthLabels: localStorage.getItem('showLengthLabels') !== 'false',
    isSpacePressed: false,
  });

  // 도구 상태 변경 함수들
  const setCurrentTool = (tool) => {
    toolState.currentTool = tool;
  };

  const setWallThickness = (thickness) => {
    // 최소 두께 제한 적용
    toolState.wallThickness = Math.max(thickness, MIN_THICKNESS);
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
    rectHandlers,
    eraserHandlers  // 지우개 핸들러 추가
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
      },
      eraser: {  // 지우개 도구 추가
        onClick: eraserHandlers.onClick,
        onMouseDown: eraserHandlers.onMouseDown,
        onMouseMove: eraserHandlers.onMouseMove,
        onMouseUp: eraserHandlers.onMouseUp
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
    MIN_THICKNESS,  // 외부에서도 사용할 수 있도록 export
  };
}; 