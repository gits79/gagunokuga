import { defineStore } from "pinia";
import { off, SVG } from "@svgdotjs/svg.js";
import { reactive, computed, watch, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { coordinateUtils, svgUtils } from '@/views/editor/modules/utilsModule';
import { gridModule } from '@/views/editor/modules/gridModule';
import { createHistoryModule } from '@/views/editor/modules/historyModule';
import { createViewModule } from '@/views/editor/modules/viewModule';
import { createToolModule } from '@/views/editor/modules/toolModule';
import { createWallModule } from '@/views/editor/modules/wallModule';
import { createFloodFillModule } from '@/views/editor/modules/floodFillModule';

// 파일 상단에 상수 선언
const WALL_COLOR = '#421';
const PAN_ON = { zoomMin: 0.01, zoomMax: 10, zoomFactor: 0.125};
const PAN_OFF = { zoomMin: 0.01, zoomMax: 10, zoomFactor: 0.125, panning: false};

// 초기값을 쿠키에서 불러오기
const showGrid = ref(localStorage.getItem('showGrid') !== 'false');  // 기본값 true
const showKeys = ref(localStorage.getItem('showKeys') !== 'false');  // 기본값 true
const showDimension = ref(localStorage.getItem('showDimension') !== 'false');  // 추가
const displayUnit = ref(localStorage.getItem('displayUnit') || 'cm');  // 기본값 'cm'

export const useFloorEditorStore = defineStore("floorEditorStore", () => {
  
  // 객체 선언
  let draw = null; // SVG 객체

  let zoomLevel = null;

  const baseURL = import.meta.env.VITE_API_URL

  let wallLayer = null;
  let wallStart = null, wallPreview = null;
  let wallPreviewGroup = null;

  const { walls, setWallLayer, getWallLayer } = createWallModule();
  const roomId = ref(null);
  const deletedWalls = reactive([]);

  const { 
    toolState, 
    setCurrentTool,
    setWallThickness,
    setSnapDistance,
    createToolHandlers 
  } = createToolModule();

  let isMovingWall = false;
  let moveStartCoords = { x: 0, y: 0 };
  let originalSnapDistance = null;

  const selection = reactive({ selectedWallId: null });
  
  const selectedWall = computed(() => {
    return walls.find(wall => wall.id === selection.selectedWallId) || null;
  });

  const { 
    history, 
    canUndo, 
    canRedo, 
    saveState: historySaveState, 
    undo: historyUndo, 
    redo: historyRedo 
  } = createHistoryModule();

  // 유틸리티 함수들을 새로운 모듈의 함수로 교체
  const roundPoint = coordinateUtils.roundPoint;
  const snapToMillimeter = coordinateUtils.snapToMillimeter;
  const getClosestPointOnLine = coordinateUtils.getClosestPointOnLine;
  const getOrthogonalPoint = coordinateUtils.getOrthogonalPoint;
  const isInBoundary = coordinateUtils.isInBoundary;
  const getSVGCoordinates = (event) => svgUtils.getSVGCoordinates(event, draw);

  // 그리드 함수를 모듈의 함수로 교체
  const addGrid = () => gridModule.createGrid(draw);

  let viewModule = null;
  let wallModule = null;

  let floodFillModule = null;

  // 캔버스 초기화
  const initializeCanvas = (canvasElement) => {
    draw = SVG().addTo(canvasElement).size("100%", "100%").panZoom({...PAN_ON});
    draw.on('zoom', () => {
      viewModule.viewbox.width = draw.viewbox().width;
      updateVisualElements();
    })
    
    // 저장된 상태에 따라 그리드 표시
    if (showGrid.value) {
      addGrid();
    }
    
    viewModule = createViewModule(draw);
    draw.viewbox(viewModule.viewbox.x, viewModule.viewbox.y, 
                viewModule.viewbox.width, viewModule.viewbox.height);
    
    wallLayer = draw.group().addClass("wall-layer");
    setWallLayer(wallLayer);

    // 저장된 상태에 따라 키포인트 표시
    if (!showKeys.value) {
      draw.find('.key').forEach(key => key.hide());
    }
    
    // wallModule의 walls를 직접 참조하도록 수정
    // floodFillModule = createFloodFillModule(draw, walls);
    // floodFillModule.findEnclosedSpaces();
    // updateVisualElements();
  };

  // 서버에서 벽 데이터 불러오기
  const fetchWalls = async (id) => {
    try {
      roomId.value = id;
      const response = await axios.get(`${baseURL}/api/rooms/${id}/walls`);
      
      if (response.data && response.data.walls) {
        // 삭제되지 않은 벽만 필터링하여 저장
        walls.splice(0, walls.length, ...response.data.walls
          .filter(wall => wall.isDeleted !== true)
          .map(wall => ({
            id: wall.id,
            x1: wall.startx,    
            y1: wall.starty,    
            x2: wall.endx,      
            y2: wall.endy,      
            thickness: wall.thickness || 100  
          }))
        );
  
        // 벽 데이터 로드 후 시각적 요소 업데이트
        if (wallLayer) {
          wallLayer.children().forEach(wall => wall.remove()); // 기존 벽 제거
          walls.forEach(wall => {
            wallCreationMethods.renderWall(wall); // 새로운 벽 렌더링
          });
          updateVisualElements();
        }

        // 벽 데이터 로드 완료 후 플러드필 실행
        // floodFillModule?.findEnclosedSpaces();
        // updateVisualElements();
      }
    } catch (error) {
      console.error("벽 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  // 서버로 벽 데이터 저장
  const saveWalls = async () => {
    if (!roomId.value) return;
    try {
      // 남아있는 벽들을 WallRequest 형식으로 변환
      const remainingWalls = walls
        .filter(wall => !deletedWalls.includes(wall.id))
        .map(wall => ({
          id: typeof wall.id === 'number' ? wall.id : null,
          roomid: roomId.value,
          startx: wall.x1,
          starty: wall.y1,
          endx: wall.x2,
          endy: wall.y2,
          thickness: wall.thickness
        }));
  
      // WallListRequest 형식으로 데이터 구성
      const requestData = {
        roomid: roomId.value,
        walls: remainingWalls,
        deletedWalls: deletedWalls  // 삭제된 벽 ID 목록
      };
  
      await axios.put(`${baseURL}/api/rooms/${roomId.value}/walls`, requestData);
  
      // 삭제된 벽 목록 초기화
      deletedWalls.splice(0, deletedWalls.length);
      
      // 최신 데이터로 갱신
      await fetchWalls(roomId.value);
      
    } catch (error) {
      console.error("벽 데이터를 저장하는 중 오류 발생:", error);
    }
  };

  // 벽 생성 컨트롤
  const wallControls = {
    start: (coords) => {
      if (!isInBoundary(coords)) return;
      const snappedStart = getSnapPoint(coords, wallLayer.children());
      wallStart = {
        x: snapToMillimeter(snappedStart.x),
        y: snapToMillimeter(snappedStart.y),
      };
      wallPreviewGroup = draw.group().addClass('wall-preview-group');
      wallPreview = wallPreviewGroup
        .line(wallStart.x, wallStart.y, wallStart.x, wallStart.y)
        .stroke({ width: toolState.wallThickness, color: WALL_COLOR, dasharray: "5,5" });
        updatePreviewMarkers(wallStart, wallStart);
    },
    preview: (coords) => {
      if (!wallStart || !isInBoundary(coords)) return;
      const snappedEnd = getSnapPoint(coords, wallLayer.children());
      const end = getOrthogonalPoint(wallStart, snappedEnd);
      wallPreview?.plot(wallStart.x, wallStart.y, end.x, end.y);
      updatePreviewMarkers(wallStart, end);
      wallPreviewGroup.find('.preview-length').forEach(el => el.remove());
      const length = Math.round(Math.hypot(end.x - wallStart.x, end.y - wallStart.y));
      if (length > 1) {
        const midX = (wallStart.x + end.x) / 2;
        const midY = (wallStart.y + end.y) / 2;
        const fontSize = viewModule.viewbox.width * 0.025;
        wallPreviewGroup
          .text(formatLength(length))  // 기존 `${Math.round(length)}mm` 대신 formatLength 사용
          .font({ size: fontSize, anchor: 'middle' })
          .center(midX, midY)
          .addClass('preview-length');
      }
    },
    onClick: (coords) => {
      if (!isInBoundary(coords)) return;
      if (!wallStart) {
        wallControls.start(coords);
      } else {
        const snappedEnd = getSnapPoint(coords, wallLayer.children());
        const end = getOrthogonalPoint(wallStart, snappedEnd);
        if (Math.hypot(end.x - wallStart.x, end.y - wallStart.y) > 1) {
          const changes = wallCreationMethods.createWallWithIntersections(
            wallStart,
            end,
            toolState.wallThickness
          );
          wallCreationMethods.applyWallChanges(changes);
          wallStart = { x: end.x, y: end.y };
          wallPreview?.plot(wallStart.x, wallStart.y, wallStart.x, wallStart.y);
          updatePreviewMarkers(wallStart, wallStart);
          wallPreviewGroup.find('.preview-length').forEach(el => el.remove());
          updateVisualElements();
        }
      }
    },
    cancel: () => {
      if (wallPreviewGroup) {
        wallPreviewGroup.find('.preview-length, .preview-key').forEach(el => el.remove());
        wallPreviewGroup.remove();
      }
      wallPreviewGroup = null;
      wallPreview = null;
      wallStart = null;
    },
  };

  // 벽 이동 컨트롤
  const moveWallControls = {
    start: (event) => {
      if (!selection.selectedWallId) return;
      isMovingWall = true;
      moveStartCoords = getSVGCoordinates(event);
      // 벽 이동 시작할 때 스냅 거리를 25로 변경
      originalSnapDistance = toolState.snapDistance;
      toolState.snapDistance = 25;
    },
    move: (event) => {
      if (!isMovingWall || !selection.selectedWallId) return;
      const currentCoords = getSVGCoordinates(event);
      const dx = currentCoords.x - moveStartCoords.x;
      const dy = currentCoords.y - moveStartCoords.y;
      const wall = walls.find(w => w.id === selection.selectedWallId);
      if (!wall) return;

      // 원래 벽의 길이와 각도 계산
      const originalLength = Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1);
      const originalAngle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);

      // 새로운 시작점 계산 (스냅 포함)
      const newStart = getSnapPointForMove({ x: wall.x1 + dx, y: wall.y1 + dy }, walls, wall.id);

      // 원래 각도와 길이를 유지하면서 새로운 끝점 계산
      const newEnd = {
        x: newStart.x + originalLength * Math.cos(originalAngle),
        y: newStart.y + originalLength * Math.sin(originalAngle)
      };

      // 끝점에 대한 스냅 확인
      const snappedEnd = getSnapPointForMove(newEnd, walls, wall.id);

      // 경계 체크를 위한 임시 좌표
      let tempX1, tempY1, tempX2, tempY2;

      if (snappedEnd.x !== newEnd.x || snappedEnd.y !== newEnd.y) {
        tempX2 = snappedEnd.x;
        tempY2 = snappedEnd.y;
        tempX1 = snappedEnd.x - originalLength * Math.cos(originalAngle);
        tempY1 = snappedEnd.y - originalLength * Math.sin(originalAngle);
      } else {
        tempX1 = newStart.x;
        tempY1 = newStart.y;
        tempX2 = newEnd.x;
        tempY2 = newEnd.y;
      }

      // 모든 점이 경계 내에 있는지 확인
      if (isInBoundary({ x: tempX1, y: tempY1 }) && 
          isInBoundary({ x: tempX2, y: tempY2 })) {
        // 경계 내부에 있을 때만 벽 위치 업데이트
        wall.x1 = tempX1;
        wall.y1 = tempY1;
        wall.x2 = tempX2;
        wall.y2 = tempY2;

        const wallElement = wallLayer.find(`[data-id='${wall.id}']`);
        if (wallElement) {
          wallElement.plot(wall.x1, wall.y1, wall.x2, wall.y2);
        }
        updateVisualElements();
      }
      
      moveStartCoords = currentCoords;
    },
    end: () => {
      isMovingWall = false;
      moveStartCoords = null;
      // 벽 이동이 끝나면 원래 스냅 거리로 복원
      toolState.snapDistance = originalSnapDistance;
    },
  };

  // 사각형 컨트롤
  const rectTool = {
    startPoint: null,
    preview: null,
  
    start: (coords) => {
      if (!isInBoundary(coords)) return;
      const snappedStart = getSnapPoint(coords, wallLayer.children());
      rectTool.startPoint = {
        x: snapToMillimeter(snappedStart.x),
        y: snapToMillimeter(snappedStart.y),
      };
      
      rectTool.preview = draw.group().addClass('rect-preview');
      rectTool.preview
        .rect(0, 0)
        .fill('none')
        .stroke({ width: 1, color: WALL_COLOR, dasharray: '5,5' });
      
      // 키 미리보기 추가
      updatePreviewMarkers(rectTool.startPoint, rectTool.startPoint);
    },
    
    move: (coords) => {
      if (!rectTool.startPoint || !rectTool.preview || !isInBoundary(coords)) return;
      
      const snappedEnd = getSnapPoint(coords, wallLayer.children());
      const currentPoint = {
        x: snapToMillimeter(snappedEnd.x),
        y: snapToMillimeter(snappedEnd.y),
      };
      
      // 기존 미리보기 업데이트
      const width = Math.abs(currentPoint.x - rectTool.startPoint.x);
      const height = Math.abs(currentPoint.y - rectTool.startPoint.y);
      const x = Math.min(rectTool.startPoint.x, currentPoint.x);
      const y = Math.min(rectTool.startPoint.y, currentPoint.y);
      
      rectTool.preview.children().forEach(child => child.remove());
      
      rectTool.preview
        .rect(width, height)
        .fill('none')
        .stroke({ width: 1, color: WALL_COLOR, dasharray: '5,5' })
        .x(x)
        .y(y);
      
      [
        [x, y, x + width, y],
        [x + width, y, x + width, y + height],
        [x + width, y + height, x, y + height],
        [x, y + height, x, y]
      ].forEach(([x1, y1, x2, y2]) => {
        rectTool.preview
          .line(x1, y1, x2, y2)
          .stroke({ width: toolState.wallThickness, color: WALL_COLOR, opacity: 0.5 });
      });
      
      // 길이 표시
      const fontSize = viewModule.viewbox.width * 0.02;
      if (width > 1) {
        rectTool.preview
          .text(formatLength(width))
          .font({ size: fontSize, anchor: 'middle' })
          .center(x + width/2, y - fontSize);
      }
      if (height > 1) {
        rectTool.preview
          .text(formatLength(height))
          .font({ size: fontSize, anchor: 'middle' })
          .center(x - fontSize * 2, y + height/2)
          .rotate(-90);
      }
      
      // 키 미리보기 업데이트
      updatePreviewMarkers(rectTool.startPoint, currentPoint);
    },
    
    finish: (coords) => {
      if (!rectTool.startPoint || !rectTool.preview || !isInBoundary(coords)) return;
      
      const snappedEnd = getSnapPoint(coords, wallLayer.children());
      const end = {
        x: snapToMillimeter(snappedEnd.x),
        y: snapToMillimeter(snappedEnd.y),
      };
      
      const width = Math.abs(end.x - rectTool.startPoint.x);
      const height = Math.abs(end.y - rectTool.startPoint.y);
      
      if (width < 1 || height < 1) {
        rectTool.cancel();
        return;
      }
      
      const x = Math.min(rectTool.startPoint.x, end.x);
      const y = Math.min(rectTool.startPoint.y, end.y);
      
      // 상태 저장은 한 번만
      saveState();
      
      // 모든 변경사항을 한번에 모음
      let allChanges = {
        wallsToRemove: [],
        newWalls: []
      };
      
      // 사각형의 네 변을 벽으로 생성 (교차점 처리 포함)
      [
        [{ x, y }, { x: x + width, y }],
        [{ x: x + width, y }, { x: x + width, y: y + height }],
        [{ x: x + width, y: y + height }, { x, y: y + height }],
        [{ x, y: y + height }, { x, y }]
      ].forEach(([start, end]) => {
        const changes = wallCreationMethods.createWallWithIntersections(
          start,
          end,
          toolState.wallThickness
        );
        
        // 변경사항 누적
        allChanges.wallsToRemove.push(...changes.wallsToRemove);
        allChanges.newWalls.push(...changes.newWalls);
      });
      
      // 중복 제거
      allChanges.wallsToRemove = [...new Set(allChanges.wallsToRemove)];
      
      // 모든 변경사항을 한번에 적용
      wallCreationMethods.applyWallChanges(allChanges);
      
      updateVisualElements();
      
      if (rectTool.preview) {
        rectTool.preview.remove();
        rectTool.preview = null;
      }
      rectTool.startPoint = null;
    },
    
    cancel: () => {
      if (rectTool.preview) {
        rectTool.preview.remove();
        rectTool.preview = null;
      }
      rectTool.startPoint = null;
    }
  };

  // 지우개 도구 객체 수정
  const eraserTool = {
    isErasing: false,
    preview: null,
    lastErasedWalls: new Set(),

    // 프리뷰 생성 함수 분리
    createPreview: () => {
      if (!eraserTool.preview) {
        eraserTool.preview = draw.circle(toolState.snapDistance * 2)
          .fill('none')
          .stroke({ color: '#000000', width: 3, dasharray: '5,5' })
          .addClass('eraser-preview');
      }
    },

    start: () => {
      eraserTool.isErasing = true;
      eraserTool.lastErasedWalls.clear();
      eraserTool.createPreview();
    },

    move: (coords) => {
      if (!eraserTool.preview) {
        eraserTool.createPreview();
      }
      
      eraserTool.preview.center(coords.x, coords.y);
      
      if (eraserTool.isErasing) {
        // 드래그 중 벽 삭제 로직
        const wallsToDelete = eraserTool.getWallsInRange(coords).filter(
          wall => !eraserTool.lastErasedWalls.has(wall.id)
        );
        
        if (wallsToDelete.length > 0) {
          wallsToDelete.forEach(wall => {
            eraserTool.lastErasedWalls.add(wall.id);
            const wallElement = wallLayer.find(`[data-id='${wall.id}']`)[0];
            if (wallElement) wallElement.remove();
            
            const index = walls.findIndex(w => w.id === wall.id);
            if (index !== -1) walls.splice(index, 1);
            
            if (typeof wall.id === 'number') {
              deletedWalls.push(wall.id);
            }
          });
          
          updateVisualElements();
        }
      }
    },

    stop: () => {
      eraserTool.isErasing = false;
      eraserTool.lastErasedWalls.clear();
    },

    cleanup: () => {
      if (eraserTool.preview) {
        eraserTool.preview.remove();
        eraserTool.preview = null;
      }
    },

    // getWallsInRange는 그대로 유지
    getWallsInRange: (coords) => {
      const range = toolState.snapDistance;
      return walls.filter(wall => {
        const projectedPoint = getClosestPointOnLine(
          { x: wall.x1, y: wall.y1 },
          { x: wall.x2, y: wall.y2 },
          coords
        );
        const distance = Math.hypot(
          projectedPoint.x - coords.x,
          projectedPoint.y - coords.y
        );
        return distance < range;
      });
    }
  };

  // == 유틸리티 함수들 == //

  // 화면갱신
  const updateVisualElements = () => {
    fillCornerSpaces();
    renderKeyPoints();
    renderLengthLabels();
    
    // 키포인트 표시 상태 적용
    if (!showKeys.value) {
      draw.find('.key').forEach(key => key.hide());
    }

    // 지우개 미리보기를 항상 최상단으로
    if (eraserTool.preview) {
      eraserTool.preview.front();
    }

    // 미리보기 그룹이 있다면 항상 wallLayer 위에 오도록 조정
    if (wallPreviewGroup && wallPreviewGroup.node) {
      wallLayer.after(wallPreviewGroup);
    }
    
    // 넓이 텍스트만 front로 보내기
    draw.find('.enclosed-space-text').forEach(text => text.front());
  };

  //  키 생성 함수
  const drawKeyPoint = (x, y) => {
    const keySize = viewModule.viewbox.width * 0.02;
    draw.circle(keySize)
      .fill("#fff")
      .stroke({ color: "#000", width: keySize * 0.1 })
      .center(x, y)
      .addClass("key")
  };

  // 키 렌더링 함수
  const renderKeyPoints = () => {
    draw.find('.key').forEach(key => key.remove());
    wallLayer.children().forEach(wall => {
      drawKeyPoint(parseFloat(wall.attr('x1')), parseFloat(wall.attr('y1')));
      drawKeyPoint(parseFloat(wall.attr('x2')), parseFloat(wall.attr('y2')));
    });
  };

  // 화살표 생성 함수
  const drawArrow = (x, y, angle, isStart) => {
    const arrowSize = viewModule.viewbox.width * 0.0125;
    const arrowAngle = Math.PI * 0.4;
    const direction = isStart ? 1 : -1;
    
    const p1 = {
      x: x + direction * arrowSize * Math.cos(angle + arrowAngle),
      y: y + direction * arrowSize * Math.sin(angle + arrowAngle)
    };
    const p2 = { x, y };
    const p3 = {
      x: x + direction * arrowSize * Math.cos(angle - arrowAngle),
      y: y + direction * arrowSize * Math.sin(angle - arrowAngle)
    };
    
    return draw.polyline([[p1.x, p1.y], [p2.x, p2.y], [p3.x, p3.y]])
      .fill('none')
      .stroke({ width: viewModule.viewbox.width * 0.00125, color: '#000' })
      .addClass('dimension');
  };

  // 연결선 생성 함수
  const drawDimensionLine = (start, end) => {
    return draw.line(start.x, start.y, end.x, end.y)
      .stroke({ width: viewModule.viewbox.width * 0.00125, color: '#000' })
      .addClass('dimension');
  };

  // 직교벽 찾는 함수
  const findIntersectingWalls = (point, wallId, isCurrentWallVertical) => {
    return walls
      .filter(w =>
        w.id !== wallId &&
        ((w.x1 === point.x && w.y1 === point.y) || (w.x2 === point.x && w.y2 === point.y))
      )
      .map(w => {
        const isMeetingAtStart = w.x1 === point.x && w.y1 === point.y;
        const isVertical = Math.abs(w.y2 - w.y1) > Math.abs(w.x2 - w.x1);

        if (isCurrentWallVertical) {
          return {
            ...w,
            isVertical: isVertical,
            isLeftward: !isVertical ? (isMeetingAtStart ? w.x1 > w.x2 : w.x2 > w.x1) : false,
            isRightward: !isVertical ? (isMeetingAtStart ? w.x1 < w.x2 : w.x2 < w.x1) : false
          };
        } else {
          return {
            ...w,
            isVertical: isVertical,
            isLower: isVertical ? (isMeetingAtStart ? w.y1 < w.y2 : w.y2 < w.y1) : false,
            isUpper: isVertical ? (isMeetingAtStart ? w.y1 > w.y2 : w.y2 > w.y1) : false
          };
        }
      });
  };

  const createLengthLabel = (wallId) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) return;
    
    const isVertical = Math.abs(wall.y2 - wall.y1) > Math.abs(wall.x2 - wall.x1);
    const isUpward = wall.y1 > wall.y2;
    const isRightward = wall.x1 < wall.x2;
    const offset = wall.thickness / 2 + viewModule.viewbox.width * 0.0125;

    // 직교 보정용 오프셋
    let upperLeftOffset = 0, upperRightOffset = 0, lowerLeftOffset = 0, lowerRightOffset = 0;
    let leftUpperOffset = 0, leftLowerOffset = 0, rightUpperOffset = 0, rightLowerOffset = 0;
    
    // 수평
    if (!isVertical) {
      let leftPoint = isRightward ? { x: wall.x1, y: wall.y1 } : { x: wall.x2, y: wall.y2 };
      let rightPoint = isRightward ? { x: wall.x2, y: wall.y2 } : { x: wall.x1, y: wall.y1 };

      const leftIntersectingWalls = findIntersectingWalls(leftPoint, wallId, false);
      const rightIntersectingWalls = findIntersectingWalls(rightPoint, wallId, false);

      const leftUpperWalls = leftIntersectingWalls.filter(w => w.isUpper);
      const leftLowerWalls = leftIntersectingWalls.filter(w => w.isLower);
      const rightUpperWalls = rightIntersectingWalls.filter(w => w.isUpper);
      const rightLowerWalls = rightIntersectingWalls.filter(w => w.isLower);

      if (leftUpperWalls.length > 0 && leftLowerWalls.length > 0) {
        upperLeftOffset -= leftUpperWalls[0].thickness / 2;
        lowerLeftOffset -= leftLowerWalls[0].thickness / 2;
      } else if (leftUpperWalls.length > 0) {
        upperLeftOffset -= leftUpperWalls[0].thickness / 2;
        lowerLeftOffset += leftUpperWalls[0].thickness / 2;
      } else if (leftLowerWalls.length > 0) {
        upperLeftOffset += leftLowerWalls[0].thickness / 2;
        lowerLeftOffset -= leftLowerWalls[0].thickness / 2;
      }

      if (rightUpperWalls.length > 0 && rightLowerWalls.length > 0) {
        upperRightOffset -= rightUpperWalls[0].thickness / 2;
        lowerRightOffset -= rightLowerWalls[0].thickness / 2;
      } else if (rightUpperWalls.length > 0) {
        upperRightOffset -= rightUpperWalls[0].thickness / 2;
        lowerRightOffset += rightUpperWalls[0].thickness / 2;
      } else if (rightLowerWalls.length > 0) {
        upperRightOffset += rightLowerWalls[0].thickness / 2;
        lowerRightOffset -= rightLowerWalls[0].thickness / 2;
      }
    // 수직
    } else {
      let upperPoint = isUpward ? { x: wall.x2, y: wall.y2 } : { x: wall.x1, y: wall.y1 };
      let lowerPoint = isUpward ? { x: wall.x1, y: wall.y1 } : { x: wall.x2, y: wall.y2 };
      const upperIntersectingWalls = findIntersectingWalls(upperPoint, wallId, true);
      const lowerIntersectingWalls = findIntersectingWalls(lowerPoint, wallId, true);
    
      const upperLeftWalls = upperIntersectingWalls.filter(w => w.isLeftward);
      const upperRightWalls = upperIntersectingWalls.filter(w => w.isRightward);
      const lowerLeftWalls = lowerIntersectingWalls.filter(w => w.isLeftward);
      const lowerRightWalls = lowerIntersectingWalls.filter(w => w.isRightward);
    
      if (upperLeftWalls.length > 0 && upperRightWalls.length > 0) {
        leftUpperOffset -= upperLeftWalls[0].thickness / 2;
        rightUpperOffset -= upperRightWalls[0].thickness / 2;
      } else if (upperLeftWalls.length > 0) {
        leftUpperOffset -= upperLeftWalls[0].thickness / 2;
        rightUpperOffset += upperLeftWalls[0].thickness / 2;
      } else if (upperRightWalls.length > 0) {
        leftUpperOffset += upperRightWalls[0].thickness / 2;
        rightUpperOffset -= upperRightWalls[0].thickness / 2;
      }
    
      if (lowerLeftWalls.length > 0 && lowerRightWalls.length > 0) {
        leftLowerOffset -= lowerLeftWalls[0].thickness / 2;
        rightLowerOffset -= lowerRightWalls[0].thickness / 2;
      } else if (lowerLeftWalls.length > 0) {
        leftLowerOffset -= lowerLeftWalls[0].thickness / 2;
        rightLowerOffset += lowerLeftWalls[0].thickness / 2;
      } else if (lowerRightWalls.length > 0) {
        leftLowerOffset += lowerRightWalls[0].thickness / 2;
        rightLowerOffset -= lowerRightWalls[0].thickness / 2;
      }
    }
    
    // 기존 요소들 제거
    draw.find(`.length-label[data-id='${wall.id}']`).forEach(label => label.remove());
    draw.find(`.dimension[data-id='${wall.id}']`).forEach(dim => dim.remove());
    
    const midX = (wall.x1 + wall.x2) / 2;
    const midY = (wall.y1 + wall.y2) / 2;
    const length = Math.round(Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1));
    const fontSize = Math.min(100, viewModule.viewbox.width / 64);
    const maxOffset = length / 2;
    const dimensionLineOffset = Math.min(
      maxOffset, 
      fontSize * (0.5 + Math.log10(length) / 2)
    ) * (isVertical ? (wall.y2 < wall.y1 ? 1 : -1) : (wall.x2 > wall.x1 ? 1 : -1));

    // 벽의 방향 결정
    const angle = isVertical 
      ? (wall.y2 > wall.y1 ? Math.PI * 0.5 : -Math.PI * 0.5)
      : (wall.x2 > wall.x1 ? 0 : Math.PI);

    if (isVertical) {
      // 세로 벽 (좌/우 분리)
      const leftLabelGroup = draw.group().addClass('length-label').attr('data-id', `${wall.id}-left`);
      const rightLabelGroup = draw.group().addClass('length-label').attr('data-id', `${wall.id}-right`);
      
      const leftLength = length + (leftUpperOffset + leftLowerOffset);
      const rightLength = length + (rightUpperOffset + rightLowerOffset);

      const isUpward = wall.y2 < wall.y1;
      const arrowAngle = Math.PI * 0.5;

      let upperPoint = isUpward ? { x: wall.x2, y: wall.y2 } : { x: wall.x1, y: wall.y1 };
      let lowerPoint = isUpward ? { x: wall.x1, y: wall.y1 } : { x: wall.x2, y: wall.y2 };

      const leftDimensionLineOffset = Math.min(
        maxOffset, 
        fontSize * (0.5 + Math.log10(leftLength) / 2)
      );
      const rightDimensionLineOffset = Math.min(
        maxOffset, 
        fontSize * (0.5 + Math.log10(rightLength) / 2)
      );
      
      // 왼쪽 텍스트
      const leftLabel = leftLabelGroup.text(formatLength(leftLength))
        .font({ size: fontSize, anchor: 'middle' })
        .center(midX - offset, midY)
        .rotate(90, midX - offset, midY);
      // 오른쪽 텍스트
      const rightLabel = rightLabelGroup.text(formatLength(rightLength))
        .font({ size: fontSize, anchor: 'middle' })
        .center(midX + offset, midY)
        .rotate(90, midX + offset, midY);
      // 왼쪽 상단 연결선
      drawDimensionLine(
        { x: midX - offset, y: midY - leftDimensionLineOffset },
        { x: midX - offset, y: upperPoint.y - leftUpperOffset }
      );
      // // 왼쪽 하단 연결선
      drawDimensionLine(
        { x: midX - offset, y: midY + leftDimensionLineOffset },
        { x: midX - offset, y: lowerPoint.y + leftLowerOffset }
      );
      // 오른쪽 상단 연결선
      drawDimensionLine(
        { x: midX + offset, y: midY - rightDimensionLineOffset },
        { x: midX + offset, y: upperPoint.y - rightUpperOffset }
      );
      // 오른쪽 하단 연결선
      drawDimensionLine(
        { x: midX + offset, y: midY + rightDimensionLineOffset },
        { x: midX + offset, y: lowerPoint.y + rightLowerOffset }
      );
      // 왼쪽 상단 화살표
      drawArrow(midX - offset, upperPoint.y - leftUpperOffset, arrowAngle, true);
      // 왼쪽 하단 화살표
      drawArrow(midX - offset, lowerPoint.y + leftLowerOffset, arrowAngle, false);
      // 우측 상단 화살표
      drawArrow(midX + offset, upperPoint.y - rightUpperOffset, arrowAngle, true);
      // 우측 하단 화살표
      drawArrow(midX + offset, lowerPoint.y + rightLowerOffset, arrowAngle, false);
    } else {
      // 가로 벽 (상단/하단 분리)
      const topLabelGroup = draw.group().addClass('length-label').attr('data-id', `${wall.id}-top`);
      const bottomLabelGroup = draw.group().addClass('length-label').attr('data-id', `${wall.id}-bottom`);
      
      const upperLength = length + (upperLeftOffset + upperRightOffset);
      const lowerLength = length + (lowerLeftOffset + lowerRightOffset);

      const isRightward = wall.x1 < wall.x2;
      const arrowAngle = 0;

      let rightPoint = isRightward ? { x: wall.x2, y: wall.y2 } : { x: wall.x1, y: wall.y1 };
      let leftPoint = isRightward ? { x: wall.x1, y: wall.y1 } : { x: wall.x2, y: wall.y2 };

      const upperDimensionLineOffset = Math.min(
        maxOffset, 
        fontSize * (0.5 + Math.log10(upperLength) / 2)
      );
      const lowerDimensionLineOffset = Math.min(
        maxOffset, 
        fontSize * (0.5 + Math.log10(lowerLength) / 2)
      );

      // 상단 텍스트
      const topLabel = topLabelGroup.text(formatLength(upperLength))
        .font({ size: fontSize, anchor: 'middle' })
        .center(midX, midY - offset);
      // 하단 텍스트
      const bottomLabel = bottomLabelGroup.text(formatLength(lowerLength))
        .font({ size: fontSize, anchor: 'middle' })
        .center(midX, midY + offset);
      // 상단 좌측 연결선
      drawDimensionLine(
        { x: midX - upperDimensionLineOffset, y: midY - offset },
        { x: leftPoint.x - upperLeftOffset, y: midY - offset }
      );
      // 상단 우측 연결선
      drawDimensionLine(
        { x: midX + upperDimensionLineOffset, y: midY - offset },
        { x: rightPoint.x + upperRightOffset, y: midY - offset }
      );
      // 하단 좌측 연결선
      drawDimensionLine(
        { x: midX - lowerDimensionLineOffset, y: midY + offset },
        { x: leftPoint.x - lowerLeftOffset, y: midY + offset }
      );
      // 하단 우측 연결선
      drawDimensionLine(
        { x: midX + lowerDimensionLineOffset, y: midY + offset },
        { x: rightPoint.x + lowerRightOffset, y: midY + offset }
      );
      // 상단 좌측 화살표
      drawArrow(leftPoint.x - upperLeftOffset, midY - offset, arrowAngle, true);
      // 상단 우측 화살표
      drawArrow(rightPoint.x + upperRightOffset, midY - offset, arrowAngle, false);
      // 하단 좌측 화살표
      drawArrow(leftPoint.x - lowerLeftOffset, midY + offset, arrowAngle, true);
      // 하단 우측 화살표
      drawArrow(rightPoint.x + lowerRightOffset, midY + offset, arrowAngle, false);
    }
  };

  // 길이레이블 렌더링 함수
  const renderLengthLabels = () => {
    draw.find('.length-label').forEach(len => len.remove());
    draw.find('.dimension').forEach(dim => dim.remove());
    if (toolState.showLengthLabels) {
      walls.forEach(wall => {
        const wallId = wall.id;
        if (wallId) {
          createLengthLabel(wallId);
        }
      });
    }
  };

  // 이동용 스냅 함수
  const getSnapPointForMove = (currentPoint, walls, excludeId) => {
    currentPoint = roundPoint(currentPoint);
    const SNAP_THRESHOLD = toolState.snapDistance;
    let closestPoint = null;
    let minDistance = SNAP_THRESHOLD;
    for (const wall of walls) {
      if (wall.id === excludeId) continue;
      const start = { x: wall.x1, y: wall.y1 };
      const end = { x: wall.x2, y: wall.y2 };
      [start, end].forEach(point => {
        const distance = Math.hypot(point.x - currentPoint.x, point.y - currentPoint.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = { x: point.x, y: point.y };
        }
      });
    }
    return closestPoint ? roundPoint(closestPoint) : currentPoint;
  };

  // 벽 생성용 스냅
  const getSnapPoint = (currentPoint, walls) => {
    currentPoint = roundPoint(currentPoint);
    const SNAP_THRESHOLD = toolState.snapDistance;
    for (const wall of walls) {
      const start = { x: +wall.attr('x1'), y: +wall.attr('y1') };
      const end = { x: +wall.attr('x2'), y: +wall.attr('y2') };
      if (Math.hypot(start.x - currentPoint.x, start.y - currentPoint.y) < SNAP_THRESHOLD) {
        return roundPoint(start);
      }
      if (Math.hypot(end.x - currentPoint.x, end.y - currentPoint.y) < SNAP_THRESHOLD) {
        return roundPoint(end);
      }
    }
    let closestPoint = null;
    let minDistance = SNAP_THRESHOLD;
    for (const wall of walls) {
      const start = { x: +wall.attr('x1'), y: +wall.attr('y1') };
      const end = { x: +wall.attr('x2'), y: +wall.attr('y2') };
      const projectedPoint = getClosestPointOnLine(start, end, currentPoint);
      const projectedDistance = Math.hypot(projectedPoint.x - currentPoint.x, projectedPoint.y - currentPoint.y);
      if (projectedDistance < minDistance) {
        minDistance = projectedDistance;
        closestPoint = projectedPoint;
      }
    }
    return closestPoint ? roundPoint(closestPoint) : currentPoint;
  };

  // 벽 선택 함수
  const selectWall = (coords) => {
    if (!coords) return;
    const walls = wallLayer.children();
    let closestWallId = null;
    draw.panZoom({ ...PAN_ON });
    let minDistance = toolState.snapDistance;
    walls.forEach(wall => {
      const start = { x: +wall.attr('x1'), y: +wall.attr('y1') };
      const end = { x: +wall.attr('x2'), y: +wall.attr('y2') };
      const projectedPoint = getClosestPointOnLine(start, end, coords);
      const distance = Math.hypot(projectedPoint.x - coords.x, projectedPoint.y - coords.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestWallId = wall.data('id');
        draw.panZoom({ ...PAN_OFF });
      }
    });
    selection.selectedWallId = closestWallId;
    updateWallSelectionVisuals();
  };
  
  // 선택된 벽 강조 함수
  const updateWallSelectionVisuals = () => {
    wallLayer.children().forEach(wall => {
      const wallData = walls.find(w => w.id === wall.data('id'));
      if (wallData) {
        if (wall.data('id') === selection.selectedWallId) {
          wall.stroke({ 
            color: "#007bff", 
            width: wallData.thickness
          });
        } else {
          wall.stroke({ 
            color: WALL_COLOR, 
            width: wallData.thickness 
          });
        }
      }
    });
  };

  // 선택된 벽의 두께
  const selectedWallThickness = computed(() => {
    const wall = walls.find(wall => wall.id === selection.selectedWallId);
    return wall ? wall.thickness : 100;
  });

  // 선택된 벽의 두께 조절 함수
  const updateSelectedWallThickness = (newThickness) => {
    if (!selectedWall.value) return;
    saveState();
    
    let updatedThickness = typeof newThickness === "string" && newThickness.includes("+")
      ? selectedWall.value.thickness + 10
      : typeof newThickness === "string" && newThickness.includes("-")
      ? selectedWall.value.thickness - 10
      : parseInt(newThickness);

    // 최소 두께 제한 적용
    if (isNaN(updatedThickness) || updatedThickness < 50) return;
    
    selectedWall.value.thickness = updatedThickness;
    const wallElement = wallLayer.find(`[data-id='${selectedWall.value.id}']`);
    if (wallElement) {
      wallElement.stroke({ width: updatedThickness });
    }
    updateVisualElements();
  };

  // 선택된 벽의 길이
  const selectedWallLength = computed(() => {
    if (!selectedWall.value) return 0;
    const { x1, y1, x2, y2 } = selectedWall.value;
    return Math.round(Math.hypot(x2 - x1, y2 - y1));
  });

  // 선택된 벽의 길이 변경 함수
  const updateSelectedWallLength = (newLength) => {
    if (!selectedWall.value) return;
    saveState();
    let updatedLength = typeof newLength === "string" && newLength.includes("+")
      ? selectedWallLength.value + 100
      : typeof newLength === "string" && newLength.includes("-")
      ? selectedWallLength.value - 100
      : parseInt(newLength);
    if (isNaN(updatedLength) || updatedLength < 1) return;
    const { x1, y1, x2, y2 } = selectedWall.value;
    const isHorizontal = Math.abs(y2 - y1) < Math.abs(x2 - x1);
    const newX2 = isHorizontal ? x1 + (x2 > x1 ? updatedLength : -updatedLength) : x1;
    const newY2 = isHorizontal ? y1 : y1 + (y2 > y1 ? updatedLength : -updatedLength);
    selectedWall.value.x2 = newX2;
    selectedWall.value.y2 = newY2;
    const wallElement = wallLayer.find(`[data-id='${selectedWall.value.id}']`);
    if (wallElement) {
      wallElement.plot(x1, y1, newX2, newY2);
    }
    updateVisualElements();
  };

  // 클릭한 좌표에 가장 가까운 벽 찾기
  const getWallAtCoords = (coords) => {
    let closestWallId = null;
    let minDistance = toolState.snapDistance;
    walls.forEach(wall => {
      const start = { x: wall.x1, y: wall.y1 };
      const end = { x: wall.x2, y: wall.y2 };
      const projectedPoint = getClosestPointOnLine(start, end, coords);
      const distance = Math.hypot(projectedPoint.x - coords.x, projectedPoint.y - coords.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestWallId = wall.id;
      }
    });
    return closestWallId;
  };

  // 선분 교차점 계산 함수
  const getIntersection = (line1, line2) => {
    const x1 = line1.x1, y1 = line1.y1;
    const x2 = line1.x2, y2 = line1.y2;
    const x3 = line2.x1, y3 = line2.y1;
    const x4 = line2.x2, y4 = line2.y2;
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denominator) < 0.001) return null; // 평행선 처리
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
    if (t < -0.001 || t > 1.001 || u < -0.001 || u > 1.001) return null;
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  };

  // 벽 분할 함수
  const splitWallAtPoint = (wall, point) => {
    const part1 = {
      id: uuidv4(),
      x1: wall.x1,
      y1: wall.y1,
      x2: point.x,
      y2: point.y,
      thickness: wall.thickness
    };
    const part2 = {
      id: uuidv4(),
      x1: point.x,
      y1: point.y,
      x2: wall.x2,
      y2: wall.y2,
      thickness: wall.thickness
    };
    return [part1, part2].filter(part => 
      Math.hypot(part.x2 - part.x1, part.y2 - part.y1) > 1
    );
  };

  // 벽 생성 및 분할 관련 메서드들
  const wallCreationMethods = {
    // 새로운 벽 생성
    createWall: (start, end, thickness) => {
      return {
        id: uuidv4(),
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        thickness: thickness,
      };
    },
    // 벽 렌더링
    renderWall: (wall) => {
      const element = wallLayer.line(wall.x1, wall.y1, wall.x2, wall.y2)
        .stroke({ width: wall.thickness, color: WALL_COLOR })
        .data('id', wall.id);
      return element;
    },
    // 교차점을 포함한 벽 생성
    createWallWithIntersections: (start, end, thickness) => {
      // 1. 새 벽 생성
      const newWall = wallCreationMethods.createWall(start, end, thickness);
      
      // 교차점 확인
      const intersections = [];
      const wallsToRemove = [];
      const newWalls = [];

      // 2. 모든 기존 벽과의 교차점 찾기
      walls.forEach(existingWall => {
        const intersection = getIntersection(newWall, existingWall);
        if (intersection) {
          // 교차점에 정밀도 보정 적용
          intersection.x = Math.round(intersection.x);
          intersection.y = Math.round(intersection.y);
          
          // 교차점이 벽의 끝점과 너무 가까운 경우 처리
          const isNearStart = Math.hypot(intersection.x - existingWall.x1, intersection.y - existingWall.y1) < 1;
          const isNearEnd = Math.hypot(intersection.x - existingWall.x2, intersection.y - existingWall.y2) < 1;
          
          if (!isNearStart && !isNearEnd) {
            intersections.push({
              point: intersection,
              wall: existingWall
            });

            if (!wallsToRemove.includes(existingWall.id)) {
              wallsToRemove.push(existingWall.id);
            }

            wallsToRemove.push(existingWall.id);
          }
        }
      });

      // 3. 교차점이 있는 경우 처리
      if (intersections.length > 0) {
        // 새 벽의 방향에 따라 교차점 정렬
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        
        intersections.sort((a, b) => {
          if (isHorizontal) {
            return (dx > 0) ? a.point.x - b.point.x : b.point.x - a.point.x;
          } else {
            return (dy > 0) ? a.point.y - b.point.y : b.point.y - a.point.y;
          }
        });

        // 4. 분할된 벽 생성
        let currentStart = { x: start.x, y: start.y };
        intersections.forEach(intersection => {
          // 교차점까지의 새 벽 생성
          if (Math.hypot(currentStart.x - intersection.point.x, currentStart.y - intersection.point.y) > 1) {
            const wallToIntersection = wallCreationMethods.createWall(
              currentStart,
              intersection.point,
              thickness
            );
            newWalls.push(wallToIntersection);
          }
          
          // 교차된 기존 벽 분할
          const splitWalls = splitWallAtPoint(intersection.wall, intersection.point);
          splitWalls.forEach(wall => {
            if (Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) > 1) {
              newWalls.push(wall);
            }
          });
          
          currentStart = intersection.point;
        });

        // 마지막 구간 추가
        if (Math.hypot(currentStart.x - end.x, currentStart.y - end.y) > 1) {
          const finalWall = wallCreationMethods.createWall(
            currentStart,
            end,
            thickness
          );
          newWalls.push(finalWall);
        }
      } else {
        // 교차점이 없는 경우
        newWalls.push(newWall);
      }

      // 중복 벽 제거
      const uniqueWalls = newWalls.filter((wall, index, self) => {
        return !self.slice(index + 1).some(otherWall => {
          return Math.abs(wall.x1 - otherWall.x1) < 1 &&
                Math.abs(wall.y1 - otherWall.y1) < 1 &&
                Math.abs(wall.x2 - otherWall.x2) < 1 &&
                Math.abs(wall.y2 - otherWall.y2) < 1;
        });
      });

      return {
        wallsToRemove,
        newWalls: uniqueWalls
      };
    },
    // 벽 변경 적용
    applyWallChanges: (changes) => {
      saveState();
      // 기존 벽 제거
      changes.wallsToRemove.forEach(id => {
        const wallElement = wallLayer.find(`[data-id='${id}']`)[0];
        if (wallElement) wallElement.remove();
        const index = walls.findIndex(w => w.id === id);
        if (index !== -1) {
          const wall = walls[index];
          // 서버에서 가져온 벽이면 deletedWalls에 추가
          if (typeof wall.id === 'number') {
            deletedWalls.push(wall.id);
          }
          walls.splice(index, 1);
        }
      });

      // 새로운 벽 추가
      changes.newWalls.forEach(wall => {
        // 최소 길이 체크
        if (Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) > 1) {
          walls.push(wall);
          wallCreationMethods.renderWall(wall);
        }
      });
    }
  };

  // 선택된 벽 삭제
  const deleteSelectedWall = () => {
    if (!selection.selectedWallId) return;
    saveState();
  
    // 삭제된 벽을 deletedWalls 배열에 추가
    const wall = walls.find(w => w.id === selection.selectedWallId);
    if (wall && typeof wall.id === 'number') {  // 서버에서 가져온 벽만 추적
      deletedWalls.push(wall.id);
    }
  
    // DOM에서 벽 요소 제거
    const wallElement = wallLayer.find(`[data-id='${selection.selectedWallId}']`)[0];
    if (wallElement) {
      wallElement.remove();
    }
    
    // walls 배열에서 제거
    const wallIndex = walls.findIndex(w => w.id === selection.selectedWallId);
    if (wallIndex !== -1) {
      walls.splice(wallIndex, 1);
    }
    
    // 선택 해제
    selection.selectedWallId = null;
    
    // 시각적 요소 업데이트
    updateVisualElements();
  };

  // 모서리 채우기 함수
  const fillCornerSpaces = () => {
    draw.find('.corner-space').forEach(space => space.remove());
    
    const cornerMap = new Map();
    
    walls.forEach(wall => {
      const points = [
        [wall.x1, wall.y1],
        [wall.x2, wall.y2]
      ];
      
      points.forEach(([x, y]) => {
        const key = `${Math.round(x)},${Math.round(y)}`;
        if (!cornerMap.has(key)) {
          cornerMap.set(key, []);
        }
        cornerMap.get(key).push(wall);
      });
    });

    // 교차점에서 모서리 처리
    cornerMap.forEach((walls, key) => {
      if (walls.length === 2) {
        const [wallA, wallB] = walls;
        const [x, y] = key.split(',').map(Number);
        
        // 두 벽의 방향 확인 (수직/수평)
        const isWallAVertical = Math.abs(wallA.x1 - wallA.x2) < 1;
        const isWallBVertical = Math.abs(wallB.x1 - wallB.x2) < 1;
        
        if (isWallAVertical !== isWallBVertical) {
          // 수직 벽과 수평 벽 구분
          const verticalWall = isWallAVertical ? wallA : wallB;
          const horizontalWall = isWallAVertical ? wallB : wallA;
          
          draw.rect(verticalWall.thickness, horizontalWall.thickness)
            .center(x, y)
            .fill(WALL_COLOR)
            .addClass('corner-space');
        }
      }
    });

    wallLayer.front();
  };

  // 미리보기 키 업데이트 함수 수정
  const updatePreviewMarkers = (start, end) => {
    const previewGroup = wallPreviewGroup || rectTool.preview;
    if (!previewGroup) return;

    // 기존 키포인트 제거
    previewGroup.find('.preview-key').forEach(el => el.remove());

    const keySize = viewModule.viewbox.width * 0.02;
    
    const checkSnap = (point) => {
      // 끝점 스냅 체크
      const endPointSnap = walls.some(wall => {
        return (Math.abs(wall.x1 - point.x) <= toolState.snapDistance && 
                Math.abs(wall.y1 - point.y) <= toolState.snapDistance) ||
               (Math.abs(wall.x2 - point.x) <= toolState.snapDistance && 
                Math.abs(wall.y2 - point.y) <= toolState.snapDistance);
      });

      // 선분 위 스냅 체크
      const lineSnap = walls.some(wall => {
        const projectedPoint = getClosestPointOnLine(
          { x: wall.x1, y: wall.y1 },
          { x: wall.x2, y: wall.y2 },
          point
        );
        const distance = Math.hypot(
          projectedPoint.x - point.x,
          projectedPoint.y - point.y
        );
        return distance <= toolState.snapDistance;
      });

      return endPointSnap || lineSnap;
    };

    const isSnappedStart = checkSnap(start);
    const isSnappedEnd = checkSnap(end);
    
    if (wallPreviewGroup) {
      // 벽 도구일 경우 시작점과 끝점만 표시
      [
        { point: start, isSnapped: isSnappedStart },
        { point: end, isSnapped: isSnappedEnd }
      ].forEach(({ point, isSnapped }) => {
        wallPreviewGroup
          .circle(keySize)
          .fill(isSnapped ? "#FFD700" : "#DDDDDD")
          .stroke({ color: "#000", width: keySize * 0.1 })
          .center(point.x, point.y)
          .addClass('preview-key');
      });
    } else if (rectTool.preview) {
      // 사각형 도구일 경우 네 꼭지점 모두 표시하되, 실제 시작점과 끝점만 스냅 표시
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);

      [
        { x: start.x, y: start.y, isStart: true },  // 실제 시작점
        { x: end.x, y: end.y, isEnd: true },        // 실제 끝점
        { x: end.x, y: start.y, isCorner: true },   // 나머지 모서리
        { x: start.x, y: end.y, isCorner: true }    // 나머지 모서리
      ].forEach(point => {
        rectTool.preview
          .circle(keySize)
          .fill(point.isStart ? (isSnappedStart ? "#FFD700" : "#DDDDDD") :
                point.isEnd ? (isSnappedEnd ? "#FFD700" : "#DDDDDD") :
                "#DDDDDD")
          .stroke({ color: "#000", width: keySize * 0.1 })
          .center(point.x, point.y)
          .addClass('preview-key');
      });
    }
  };

  // == 유틸리티 함수들 == //

  // 단축키 처리 함수
  const handleKeyDown = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    
    if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        toolState.isSpacePressed = true;
        draw.panZoom({ ...PAN_ON });
        document.body.style.cursor = 'grab';
    }
    
    switch (event.key.toLowerCase()) {
      case "[":
        if (toolState.currentTool === "eraser") {
          const newSize = Math.max(25, toolState.snapDistance - 25);
          setSnapDistance(newSize);
          if (eraserTool.preview) {
            eraserTool.preview.size(newSize * 2);
          }
        } else if (toolState.currentTool === "wall" || toolState.currentTool === "rect") {
          const newThickness = Math.max(10, toolState.wallThickness - 10);
          setWallThickness(newThickness);
          // 미리보기 업데이트
          if (wallPreview) {
            wallPreview.stroke({ width: newThickness });
          }
          if (rectTool.preview) {
            rectTool.preview.find('line').forEach(line => 
              line.stroke({ width: newThickness })
            );
          }
        }
        break;
      case "]":
        if (toolState.currentTool === "eraser") {
          const newSize = Math.min(500, toolState.snapDistance + 25);
          setSnapDistance(newSize);
          if (eraserTool.preview) {
            eraserTool.preview.size(newSize * 2);
          }
        } else if (toolState.currentTool === "wall" || toolState.currentTool === "rect") {
          const newThickness = Math.min(500, toolState.wallThickness + 10);
          setWallThickness(newThickness);
          // 미리보기 업데이트
          if (wallPreview) {
            wallPreview.stroke({ width: newThickness });
          }
          if (rectTool.preview) {
            rectTool.preview.find('line').forEach(line => 
              line.stroke({ width: newThickness })
            );
          }
        }
        break;
      case "escape":
        if (toolState.currentTool === "wall") {
          wallControls.cancel();
        } else if (toolState.currentTool === "rect") {
          rectTool.cancel();
        }
        break;
      case "delete":
        if (selection.selectedWallId) {
          deleteSelectedWall();
        }
        break;
      case "1": 
        handleToolChange("select");
        break;
      case "2": 
        handleToolChange("wall");
        break;
      case "3": 
        handleToolChange("rect");
        break;
      case "4": 
        handleToolChange("eraser");
        break;
      case "l":
        toggleLengthLabels();  // toolModule의 함수 사용
        updateVisualElements(); // 시각적 요소 업데이트 추가
        break;
      case "g": 
        toggleGrid();
        break;
      case "k": 
        toggleKeys();
        break;
      default:
        if (event.ctrlKey) {
          switch (event.key) {
            case "z": event.preventDefault(); undo(); break;
            case "y": event.preventDefault(); redo(); break;
          }
        }
        break;
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveWalls();
        return;
    }

    // Ctrl + '+' 또는 Ctrl + '-' 처리
    if (event.ctrlKey || event.metaKey) {  // Windows의 Ctrl 또는 Mac의 Cmd
        switch (event.key) {
            case '+':
            case '=':  // Shift 없이 '+' 누를 때
                event.preventDefault();
                zoomLevel = Math.min(draw.zoom() * 1.125, 10);
                draw.zoom(zoomLevel);
                // viewModule?.zoomIn();
                updateVisualElements();
                return;
            case '-':
                event.preventDefault();
                zoomLevel = Math.max(draw.zoom() * 0.875, 0.01);
                draw.zoom(zoomLevel);
                // viewModule?.zoomOut();
                updateVisualElements();
                return;
            // ... existing cases (z, y, s) ...
        }
    }
  };

  // 스페이스바를 뗄 때 커서를 원래대로
  const handleKeyUp = (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        toolState.isSpacePressed = false;
        document.body.style.cursor = '';
        if (toolState.currentTool !== 'select') {
          draw.panZoom({ ...PAN_OFF });
        }
    }
  };

  const toggleKeys = () => {
    showKeys.value = !showKeys.value;
    draw.find('.key').forEach(key => {
      showKeys.value ? key.show() : key.hide();
    });
    localStorage.setItem('showKeys', showKeys.value);
  };

  // === 도구 이벤트 설정 === //
  const tools = createToolHandlers({
    selectHandlers: {
      onClick: (event) => {
        const coords = getSVGCoordinates(event);
        selectWall(coords);
        updateWallSelectionVisuals();
      },
      onMouseDown: (event) => {
        const coords = getSVGCoordinates(event);
        const clickedWallId = getWallAtCoords(coords);
        if (clickedWallId) {
          if (selection.selectedWallId === clickedWallId) {
            moveWallControls.start(event);
          } else {
            selection.selectedWallId = clickedWallId;
            updateWallSelectionVisuals();
          }
        } else {
          selection.selectedWallId = null;
          // viewModule?.panControls.start(event);
        }
      },
      onMouseMove: (event) => {
        if (isMovingWall) {
          moveWallControls.move(event);
        } else {
          // viewModule?.panControls.move(event);
        }
      },
      onMouseUp: () => {
        if (isMovingWall) {
          moveWallControls.end();
        } else {
          // viewModule?.panControls.stop();
        }
      }
    },
    wallHandlers: {
      onClick: (event) => {
        if (!toolState.isSpacePressed) {
          // 스페이스바가 떼진 상태에서만 벽 생성
          wallControls.onClick(getSVGCoordinates(event));
        }
      },
      onMouseDown: (event) => {
        if (toolState.isSpacePressed) {
          // 스페이스바가 눌린 상태면 패닝 시작
          // viewModule?.panControls.start(event);
        }
      },
      onMouseMove: (event) => {
        if (toolState.isSpacePressed) {
          // 스페이스바가 눌린 상태면 패닝
          // viewModule?.panControls.move(event);
        } else {
          // 아니면 기존 벽 프리뷰
          wallControls.preview(getSVGCoordinates(event));
        }
      },
      onMouseUp: () => {
        if (toolState.isSpacePressed) {
          // 스페이스바가 눌린 상태면 패닝 종료
          // viewModule?.panControls.stop();
        }
      }
    },
    rectHandlers: {
      onClick: (event) => {
        if (!toolState.isSpacePressed) {
          // 스페이스바가 떼진 상태에서만 사각형 생성
          const coords = getSVGCoordinates(event);
          !rectTool.startPoint ? rectTool.start(coords) : rectTool.finish(coords);
        }
      },
      onMouseDown: (event) => {
        if (toolState.isSpacePressed) {
          // 스페이스바가 눌린 상태면 패닝 시작
          // viewModule?.panControls.start(event);
        }
      },
      onMouseMove: (event) => {
        if (toolState.isSpacePressed) {
          // 스페이스바가 눌린 상태면 패닝
          // viewModule?.panControls.move(event);
        } else {
          // 아니면 사각형 프리뷰
          rectTool.move(getSVGCoordinates(event));
        }
      },
      onMouseUp: () => {
        if (toolState.isSpacePressed) {
          // 스페이스바가 눌린 상태면 패닝 종료
          // viewModule?.panControls.stop();
        }
      }
    },
    eraserHandlers: {
      onClick: (event) => {
        if (toolState.isSpacePressed) return;
        
        const coords = getSVGCoordinates(event);
        const wallsToDelete = eraserTool.getWallsInRange(coords);
        
        if (wallsToDelete.length > 0) {
          saveState();
          wallsToDelete.forEach(wall => {
            const wallElement = wallLayer.find(`[data-id='${wall.id}']`)[0];
            if (wallElement) wallElement.remove();
            
            const index = walls.findIndex(w => w.id === wall.id);
            if (index !== -1) walls.splice(index, 1);
            
            if (typeof wall.id === 'number') {
              deletedWalls.push(wall.id);
            }
          });
          
          updateVisualElements();
        }
      },
      onMouseDown: (event) => {
        if (toolState.isSpacePressed) {
          // viewModule?.panControls.start(event);
        } else {
          saveState();
          eraserTool.start();
        }
      },
      onMouseMove: (event) => {
        if (toolState.isSpacePressed) {
          viewModule?.panControls.move(event);
          eraserTool.cleanup();  // 스페이스바 누르면 프리뷰 제거
        } else {
          eraserTool.move(getSVGCoordinates(event));
        }
      },
      onMouseUp: () => {
        if (toolState.isSpacePressed) {
          // viewModule?.panControls.stop();
        } else {
          eraserTool.stop();
        }
      }
    }
  });

  // 이벤트 처리기 실행 함수 (이벤트 이름, 이벤트 객체)
  const executeToolEvent = (eventName, event) => {
    // 우클릭 시 현재 도구의 작업 취소
    if (event.button === 2) {  // 2는 우클릭
        if (toolState.currentTool === 'wall') {
            wallControls.cancel();  
        } else if (toolState.currentTool === 'rect') {
            rectTool.cancel();
        }
        return;
    }

    // mousemove 이벤트에서 좌표 업데이트
    if (eventName === 'onMouseMove') {
        updateMousePosition(event);
    }

    // 휠 클릭이나 스페이스바가 눌린 상태면 패닝 처리
    if (event.button === 1 || toolState.isSpacePressed) {  // 1은 휠 클릭
        switch(eventName) {
            case 'onMouseDown':
                document.body.style.cursor = 'grab';  // 휠 클릭 시 커서 변경
                // viewModule?.panControls.start(event);
                return;
            case 'onMouseMove':
                // viewModule?.panControls.move(event);
                return;
            case 'onMouseUp':
                document.body.style.cursor = '';  // 휠 클릭 해제 시 원래 커서로
                // viewModule?.panControls.stop();
                return;
        }
    }
    
    // 일반 도구 이벤트 처리
    const tool = tools[toolState.currentTool];
    if (tool && tool[eventName]) {
        tool[eventName](event);
    }
  };
  
  // 상태 저장 함수
  const saveState = () => historySaveState(walls);

  // undo/redo 함수 정의
  const undo = () => historyUndo(walls, wallLayer, wallCreationMethods.renderWall, updateVisualElements);
  const redo = () => historyRedo(walls, wallLayer, wallCreationMethods.renderWall, updateVisualElements);

  // 줌 이벤트 핸들러 수정
  // const handleZoom = (event) => {
  //   viewModule?.zoomCanvas(event);
  //   updateVisualElements();
  // };

  const toggleLengthLabels = () => {
    toolState.showLengthLabels = !toolState.showLengthLabels;
    localStorage.setItem('showLengthLabels', toolState.showLengthLabels);
    updateVisualElements();
  };

  // toggleGrid 함수 수정
  const toggleGrid = () => {
    showGrid.value = !showGrid.value;
    if (showGrid.value) {
      addGrid();  // 그리드 켤 때는 다시 렌더링
    } else {
      gridModule.toggleGrid(draw, false);  // 끌 때는 숨기기만
    }
    localStorage.setItem('showGrid', showGrid.value);
  };

  // setCurrentTool 호출 시 이전 도구 정리 및 새 도구 초기화
  const handleToolChange = (newTool) => {
    // 이전 도구 정리
    switch (toolState.currentTool) {
      case 'wall':
        wallControls.cancel();
        break;
      case 'rect':
        rectTool.cancel();
        break;
      case 'eraser':
        eraserTool.cleanup();  // 지우개 미리보기 제거
        eraserTool.stop();
        break;
    }

    // 새 도구로 변경
    setCurrentTool(newTool);

    // 새 도구가 지우개면 프리뷰 생성
    if (newTool === 'eraser') {
      eraserTool.createPreview();
    }

    if (newTool === 'select' ) {
      draw.panZoom({ ...PAN_ON });
    } else {
      draw.panZoom({ ...PAN_OFF });
    }
  };

  const mousePosition = ref({ x: 0, y: 0 });
  
  const formatLength = (value) => {
    switch (displayUnit.value) {
      case 'cm':
        return `${(value / 10).toFixed(1)}cm`;
      case 'm':
        return `${(value / 1000).toFixed(2)}m`;
      default: // mm
        return `${Math.round(value)}mm`;
    }
  };

  const cycleDisplayUnit = () => {
    const units = ['mm', 'cm', 'm'];
    const currentIndex = units.indexOf(displayUnit.value);
    displayUnit.value = units[(currentIndex + 1) % units.length];
    localStorage.setItem('displayUnit', displayUnit.value);  // 단위 변경 시 저장
    updateVisualElements();  // 단위 변경 시 시각적 요소들 업데이트
  };

  const updateMousePosition = (event) => {
    const coords = getSVGCoordinates(event);
    mousePosition.value = {
      x: Math.round(coords.x),
      y: Math.round(coords.y)
    };
  };

  // SVG 이벤트 핸들러에 마우스 좌표 업데이트 추가
  const handleSVGMouseMove = (event) => {
    updateMousePosition(event);
    executeToolEvent('onMouseMove', event);
  };

  // 리턴
  return {
    walls,
    roomId,
    fetchWalls,
    saveWalls,

    toolState,
    executeToolEvent,
    initializeCanvas,
    // zoomCanvas: handleZoom,
    handleKeyDown,
    handleKeyUp,  // handleKeyUp 추가
    handleToolChange,
    
    setWallThickness,
    setSnapDistance,
    wallControls,
    rectTool, 
    canUndo,
    canRedo,
    undo,
    redo,
    toggleLengthLabels,

    selection,
    selectWall,
    selectedWallLength,
    selectedWallThickness,
    updateSelectedWallLength,
    updateSelectedWallThickness,
    deleteSelectedWall,
    viewbox: computed(() => viewModule?.viewbox),
    showGrid,
    toggleGrid,
    showKeys,
    toggleKeys,
    showDimension,
    mousePosition,
    displayUnit,
    formatLength,
    cycleDisplayUnit,
    handleSVGMouseMove,
  };
});