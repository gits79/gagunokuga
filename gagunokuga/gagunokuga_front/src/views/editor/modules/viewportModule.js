import { reactive, ref, computed } from 'vue';

/**
 * 뷰포트 관련 기능을 관리하는 모듈
 */
export const useViewportModule = () => {
  /** SVG 드로잉 객체 참조 */
  const draw = ref(null);
  
  /** 뷰포트 상태 */
  const viewbox = reactive({ 
    x: -2000, 
    y: -2000, 
    width: 4000, 
    height: 4000 
  });

  /** 팬 상태 */
  const isPanning = ref(false);
  const panStart = reactive({ x: 0, y: 0 });

  /** 현재 줌 레벨 계산 */
  const zoomLevel = computed(() => {
    if (!draw.value) return 1;
    return viewbox.width / draw.value.node.clientWidth;
  });

  /**
   * SVG 드로잉 객체 설정
   */
  const setDraw = (drawInstance) => {
    draw.value = drawInstance;
    if (draw.value) {
      draw.value.viewbox(viewbox.x, viewbox.y, viewbox.width, viewbox.height);
    }
  };

  /**
   * 팬 컨트롤러
   */
  const panControls = {
    start: (event) => {
      isPanning.value = true;
      panStart.x = event.clientX;
      panStart.y = event.clientY;
    },

    move: (event) => {
      if (!isPanning.value || !draw.value) return;
      
      const dx = event.clientX - panStart.x;
      const dy = event.clientY - panStart.y;
      
      viewbox.x -= dx * (viewbox.width / draw.value.node.clientWidth);
      viewbox.y -= dy * (viewbox.height / draw.value.node.clientHeight);
      
      draw.value.viewbox(viewbox.x, viewbox.y, viewbox.width, viewbox.height);
      
      panStart.x = event.clientX;
      panStart.y = event.clientY;
    },

    stop: () => {
      isPanning.value = false;
    }
  };

  return {
    viewbox,
    setDraw,
    zoomLevel,
    isPanning,
    panControls
  };
}; 