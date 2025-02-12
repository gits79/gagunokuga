import { reactive, computed } from 'vue';

export const createHistoryModule = () => {
  const history = reactive({
    undoStack: [],
    redoStack: [],
    isRecording: true
  });

  const canUndo = computed(() => history.undoStack.length > 0);
  const canRedo = computed(() => history.redoStack.length > 0);

  // 현재 상태를 저장
  const saveState = (walls) => {
    if (!history.isRecording) return;
    history.undoStack.push(JSON.stringify(walls));
    history.redoStack = [];
  };

  // 상태 복원
  const loadState = (state, walls, wallLayer, renderWall, updateVisualElements) => {
    // DOM에서 현재 벽들 제거
    wallLayer.children().forEach(wall => wall.remove());
    
    // walls 배열 초기화 및 새로운 상태로 교체
    walls.splice(0, walls.length, ...JSON.parse(state));
    
    // 벽 다시 그리기
    walls.forEach(wall => {
      renderWall(wall);
    });
    
    // 시각요소 업데이트
    updateVisualElements();
  };

  // Undo 함수
  const undo = (walls, wallLayer, renderWall, updateVisualElements) => {
    if (history.undoStack.length === 0) return;
    
    // 현재 상태를 redo 스택에 저장
    history.redoStack.push(JSON.stringify(walls));
    
    // 이전 상태 복원
    history.isRecording = false;
    loadState(history.undoStack.pop(), walls, wallLayer, renderWall, updateVisualElements);
    history.isRecording = true;
  };

  // Redo 함수
  const redo = (walls, wallLayer, renderWall, updateVisualElements) => {
    if (history.redoStack.length === 0) return;
    
    // 현재 상태를 undo 스택에 저장
    history.undoStack.push(JSON.stringify(walls));
    
    // 다음 상태 복원
    history.isRecording = false;
    loadState(history.redoStack.pop(), walls, wallLayer, renderWall, updateVisualElements);
    history.isRecording = true;
  };

  return {
    history,
    canUndo,
    canRedo,
    saveState,
    undo,
    redo
  };
}; 