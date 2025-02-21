import { defineStore } from "pinia";
import { SVG } from "@svgdotjs/svg.js";
import '@svgdotjs/svg.draggable.js';
import '@svgdotjs/svg.panzoom.js'
import { reactive, computed, ref } from "vue";
import apiClient from "@/api/axiosInstance";
import { subscribe, unsubscribe, publish } from '@/utils/stompClient';
import { svgUtils, coordinateUtils } from '@/views/editor/modules/utilsModule';
import { gridModule } from '@/views/editor/modules/gridModule';
import { createViewModule } from '@/views/editor/modules/viewModule';
import { createToolModule } from '@/views/editor/modules/toolModule';
import { createWallModule } from '@/views/editor/modules/wallModule';

const WALL_COLOR = '#421';

export const useFurnitureEditorStore = defineStore("furnitureEditorStore", () => {
  
  // 객체 선언
  let draw = null; // SVG 객체

  let wallLayer = null;
  
  let furnitureGroup = null;

  const { walls, setWallLayer, getWallLayer } = createWallModule();
  const roomId = ref(null);

  const { 
    toolState, 
    toggleLengthLabels,
    createToolHandlers
  } = createToolModule();

  const selection = reactive({ selectedWallId: null });

  // 유틸리티 함수들을 새로운 모듈의 함수로 교체
  const getSVGCoordinates = (event) => svgUtils.getSVGCoordinates(event, draw);

  // 그리드 함수를 모듈의 함수로 교체
  const addGrid = () => gridModule.createGrid(draw);

  let viewModule = null;

  // 그리드 표시 여부 상태
  const showGrid = ref(localStorage.getItem('showGrid') !== 'false');

  // 그리드 토글 함수
  const toggleGrid = () => {
    showGrid.value = !showGrid.value;
    if (showGrid.value) {
      addGrid();  // 그리드 켤 때는 다시 렌더링
    } else {
      gridModule.toggleGrid(draw, false);  // 끌 때는 숨기기만
    }
    localStorage.setItem('showGrid', showGrid.value);
  };

  // 캔버스 초기화
  const initializeCanvas = (canvasElement) => {
    draw = SVG().addTo(canvasElement).size("100%", "100%").panZoom({ zoomMin: 0.01, zoomMax: 10, zoomFactor: 0.125 });
    draw.on('zoom', () => {
      viewModule.viewbox.width = draw.viewbox().width;
      updateVisualElements();
    });
    draw.on('panStart', () => {
      if (selectedFurniture.furnitureName) {
        const furn = furnitureObjects.value[selectedFurniture.index];
        furn.children()[0].children()[1].attr({ 'stroke-width': 0 });
      }
    });
    if (showGrid.value) {
      addGrid();
    }
    
    viewModule = createViewModule(draw);
    draw.viewbox(viewModule.viewbox.x, viewModule.viewbox.y, 
                viewModule.viewbox.width, viewModule.viewbox.height);
    
    furnitureGroup = draw.group().addClass('furniture-group');
    wallLayer = draw.group().addClass("wall-layer");
    setWallLayer(wallLayer);
  };

  // 서버에서 벽 데이터 불러오기
  const fetchWalls = async () => {
    try {
      const response = await apiClient.get(`/api/rooms/${roomId.value}/walls`);
      
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
          fillCornerSpaces();
        }
      }
    } catch (error) {
      console.error("벽 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  // == 유틸리티 함수들 == //

  // 화면갱신
  const updateVisualElements = () => {
    // fillCornerSpaces();
    // renderKeyPoints();
    renderLengthLabels();
  };

  // //  키 생성 함수
  // const drawKeyPoint = (x, y) => {
  //   const keySize = viewModule.viewbox.width * 0.02;
  //   draw.circle(keySize)
  //     .fill("#fff")
  //     .stroke({ color: "#000", width: keySize * 0.1 })
  //     .center(x, y)
  //     .addClass("key")
  // };
  // // 키 렌더링 함수
  // const renderKeyPoints = () => {
  //   draw.find('.key').forEach(key => key.remove());
  //   wallLayer.children().forEach(wall => {
  //     drawKeyPoint(parseFloat(wall.attr('x1')), parseFloat(wall.attr('y1')));
  //     drawKeyPoint(parseFloat(wall.attr('x2')), parseFloat(wall.attr('y2')));
  //   });
  // };

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
      const leftLabel = leftLabelGroup.text(`${leftLength}mm`)
        .font({ size: fontSize, anchor: 'middle' })
        .center(midX - offset, midY)
        .rotate(90, midX - offset, midY);
      // 오른쪽 텍스트
      const rightLabel = rightLabelGroup.text(`${rightLength}mm`)
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
      const topLabel = topLabelGroup.text(`${upperLength}mm`)
        .font({ size: fontSize, anchor: 'middle' })
        .center(midX, midY - offset);
      // 하단 텍스트
      const bottomLabel = bottomLabelGroup.text(`${lowerLength}mm`)
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

  // 벽 생성 및 분할 관련 메서드들
  const wallCreationMethods = {
    // 벽 렌더링
    renderWall: (wall) => {
      const element = wallLayer.line(wall.x1, wall.y1, wall.x2, wall.y2)
        .stroke({ width: wall.thickness, color: WALL_COLOR })
        .data('id', wall.id);
      return element;
    },
  };

  // 모서리 채우기 함수
  const fillCornerSpaces = () => {
    draw.find('.corner-space').forEach(space => space.remove());
    
    // 벽들의 끝점을 Map으로 관리 (좌표를 키로 사용)
    const cornerMap = new Map();
    
    wallLayer.children().forEach(wall => {
      const points = [
        [wall.attr('x1'), wall.attr('y1')],
        [wall.attr('x2'), wall.attr('y2')]
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
        const isWallAVertical = Math.abs(wallA.attr('x1') - wallA.attr('x2')) < 1;
        const isWallBVertical = Math.abs(wallB.attr('x1') - wallB.attr('x2')) < 1;
        
        if (isWallAVertical !== isWallBVertical) {
          const thicknessA = wallA.attr('stroke-width');
          const thicknessB = wallB.attr('stroke-width');
          
          const width = isWallAVertical ? thicknessA : thicknessB;
          const height = isWallAVertical ? thicknessB : thicknessA;
          
          // 모서리 사각형을 wallLayer 안에 생성
          wallLayer.rect(width, height)
            .center(x, y)
            .fill(WALL_COLOR)
            .addClass('corner-space');
        }
      }
    });
  }

  // 단축키 처리 함수
  const handleKeyDown = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    switch (event.key.toLowerCase()) {
      case 'g':
        toggleGrid();
        break;
      case 'escape':
        break;
      case 'delete':
        deleteFurniture();
        break;
      case '1': break;
      case '2': break;
      case '3': break;
      case 'l': case 'L': 
        toggleLengthLabels();  // toolModule의 함수 사용
        updateVisualElements(); // 시각적 요소 업데이트 추가
        break;
      default:
        if (event.ctrlKey) {
          switch (event.key) {
            case "z": break;
            case "y": break;
          }
        }
        break;
    }
  };

  // === 도구 이벤트 설정 === //
  const tools = createToolHandlers({
    selectHandlers: {},
    wallHandlers: {
      onClick: (event) => wallControls.onClick(getSVGCoordinates(event)),
      onMouseMove: (event) => wallControls.preview(getSVGCoordinates(event))
    },
    rectHandlers: {
      onClick: (event) => {
        const coords = getSVGCoordinates(event);
        !rectTool.startPoint ? rectTool.start(coords) : rectTool.finish(coords);
      },
      onMouseMove: (event) => rectTool.move(getSVGCoordinates(event))
    },
    eraserHandlers: {}
  });

  // 이벤트 처리기 실행 함수 (이벤트 이름, 이벤트 객체)
  const executeToolEvent = (eventName, event) => {
    const tool = tools[toolState.currentTool];
    if (tool && tool[eventName]) {
      tool[eventName](event);
    }
  };
  
  // 줌 이벤트 핸들러 수정
  const handleZoom = (event) => {
    // viewModule?.zoomCanvas(event);
    updateVisualElements();
  };

  // -------------- 웹소켓 연결 및 구독 ---------------

  const initializeWebSocket = async (id) => {
    roomId.value = id;
    // if (!stompClient.connected) {
    //   stompClient.activate();
    // }
  };

  const subscribeToRoom = async (chatCallback) => {
    const subPath = `/sub/rooms/${roomId.value}`; // 동적으로 subPath 생성
    subscribe(roomId.value, receiveFurnitureEvent, chatCallback); // subscribe 호출
  }

  const unsubscribeFromRoom = () => {
    unsubscribe(roomId.value); // 구독 해제
  }

  const publishFurnitureEvent = (data) => {
    const pubPath = `/pub/rooms/${roomId.value}`; // pubPath 정의
    publish(pubPath, data); // publish 호출
  }
  

  // --------------- 가구 요청 및 업데이트 관련 ----------------

  const furnitureObjects = ref([]) // 가구 객체 목록
  const furnitureDataList = ref([]) // 가구 데이터 목록
  const selectedFurniture = reactive({ 
    id: null,
    furnitureId: null,
    furnitureName: null,
    imageUrl: null,
    roomId: null,

    xpos: null,
    ypos: null,
    width: null,
    height: null,
    rotation: null,

    layer: null,
    collapse: false,
    holderName: null,
    isDeleted: false,
    index: null
  })

  const resetSelectedVaues = () => {
    selectedFurniture.id = null,
    selectedFurniture.furnitureId = null
    selectedFurniture.furnitureName = null
    selectedFurniture.imageUrl = null
    selectedFurniture.roomId = null

    selectedFurniture.xpos = null
    selectedFurniture.ypos = null
    selectedFurniture.width = null
    selectedFurniture.height = null
    selectedFurniture.rotation = null

    selectedFurniture.layer = null
    selectedFurniture.collapse = false
    selectedFurniture.holderName = null
    selectedFurniture.isDeleted = false
    selectedFurniture.index = null
  }

  // 선택된 가구 정보 업데이트
  const updateSelectedValues = (furnObj) => {
    const furnSelection = furnObj.children()[0];
    selectedFurniture.xpos = furnObj.cx();
    selectedFurniture.ypos = furnObj.cy();
    selectedFurniture.width = furnSelection.width();
    selectedFurniture.height = furnSelection.height();
    selectedFurniture.rotation = Math.round(furnSelection.transform('rotate'))
  }

  // 가구 객체 업데이트
  const updateObjectValues = (furnObj, furniture) => {
    const furnSelection = furnObj.children()[0];
    const [image, rect] = furnSelection.children();
    furnSelection.transform({ rotate: furniture.rotation });
    image.size(furniture.width, furniture.height);
    rect.size(furniture.width - 10, furniture.height - 10);
    furnObj.center(furniture.xpos, furniture.ypos);
  }

  // HTTP List<furnitureEvent> 가져오기 (룸 입장 시)
  const fetchFurnitureList = async () => {
    furnitureObjects.value = [];
    furnitureDataList.value = [];
    try {
      // const apiClient = createApiClient();  
      const response = await apiClient.get(`/api/rooms/${roomId.value}/furnitures/fetch`);
      response.data.furnitureList.forEach(furnitureEvent => {
        receiveFurnitureEvent(furnitureEvent);
      });
    } catch (error) {
      console.error("가구 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  // HTTP 드래그 앤 드랍으로 가구 소환 시 가구 생성 요청
  const dropFurniture = (event) => {
    const furnitureId = event.dataTransfer.getData('furnitureId');
    const selectedLayer = parseInt(event.dataTransfer.getData('selectedLayer')) || 0;
    const {x, y} = coordinateUtils.roundPoint(getSVGCoordinates(event));
    createNewFurniture(furnitureId, x, y, selectedLayer);
  };

  const createNewFurniture = async (furnitureId, x, y, layer) => {
    try {
      
      const response = await apiClient.get(`/api/rooms/${roomId.value}/furnitures/${furnitureId}?xpos=${x}&ypos=${y}&layer=${layer}`);

      if (response.data && response.data.event === 'CREATE') {
        receiveFurnitureEvent(response.data);
      }
    } catch (error) {
      console.error("가구 생성 중 오류 발생:", error);
    }
  };

  // WS 가구 업데이트 이벤트 발행
  const updateFurniture = () => {
    // layer 값을 0~10 범위로 제한
    if (selectedFurniture.layer < 0) selectedFurniture.layer = 0;
    if (selectedFurniture.layer > 10) selectedFurniture.layer = 10;

    publishFurnitureEvent({
      event: "UPDATE",
      furniture: {...selectedFurniture},
    })
  }

  // WS 가구 삭제 이벤트 발행
  const deleteFurniture = () => {
    if(selectedFurniture.index === null) {
      return;
    }
    selectedFurniture.isDeleted = true;
    publishFurnitureEvent({
      event: 'DELETE',
      furniture: { ...selectedFurniture }
    });
    resetSelectedVaues();
  };

  // WS 가구 이벤트 구독
  const receiveFurnitureEvent = (furnitureEvent) => {
    const {event, furniture} = furnitureEvent;
    
    if (event === 'CREATE') {
      if (furniture.index !== undefined && furnitureDataList.value[furniture.index]) {
        furniture.layer = furnitureDataList.value[furniture.index].layer;
      }
      drawFurniture(furniture);
    } else if (event === 'UPDATE') {
      redrawFurniture(furniture);
    } else if (event === 'DELETE') {
      eraseFurniture(furniture);
    }
  };

  // 가구 레이어 업데이트 함수 수정
  const updateFurnitureLayer = (furnObj, layer) => {
    // 모든 가구를 레이어 순서대로 정렬
    const allFurniture = furnitureObjects.value
      .filter(obj => obj !== null)
      .sort((a, b) => {
        const indexA = parseInt(a.attr('id').split('-')[1]);
        const indexB = parseInt(b.attr('id').split('-')[1]);
        const layerA = furnitureDataList.value[indexA]?.layer || 0;
        const layerB = furnitureDataList.value[indexB]?.layer || 0;
        
        if (layerA === layerB) {
          return indexA - indexB;
        }
        return layerA - layerB;
      });

    // 레이어 0 이하의 가구는 벽 아래로, 1 이상은 벽 위로
    allFurniture.forEach(furn => {
      const furnIndex = parseInt(furn.attr('id').split('-')[1]);
      const furnLayer = furnitureDataList.value[furnIndex]?.layer || 0;
      
      if (furnLayer <= 0) {
        furn.before(wallLayer); // 벽 레이어 앞에 배치 (아래)
      } else {
        furn.after(wallLayer);  // 벽 레이어 뒤에 배치 (위)
      }
    });

    // 각 그룹 내에서 레이어 순서대로 정렬
    allFurniture.forEach(furn => {
      const furnIndex = parseInt(furn.attr('id').split('-')[1]);
      const furnLayer = furnitureDataList.value[furnIndex]?.layer || 0;
      
      if (furnLayer <= 0) {
        furn.back();  // 0 이하 그룹 내에서 정렬
      } else {
        furn.front(); // 1 이상 그룹 내에서 정렬
      }
    });
  }

  // 가구 렌더링
  const drawFurniture = (furniture) => {
    if (furniture.isDeleted === true) {
      return;
    }
    
    const furn = furnitureGroup.group();
    const furnSelection = furn.group();
    furnSelection.image(furniture.imageUrl).size(furniture.width, furniture.height)
        .attr('preserveAspectRatio', 'none')
        .attr('crossOrigin', 'anonymous');
    furnSelection.rect(furniture.width - 10, furniture.height - 10)
    .move(5, 5)
    .fill('none')
    .stroke({ color: '#F00', width: 0 });      
    furn.attr('id', `furniture-${furniture.index}`);  
    furn.draggable();                                 
    updateObjectValues(furn, furniture);
    
    // 가구 데이터 저장
    furnitureDataList.value[furniture.index] = furniture;
    
    // 레이어 값에 따라 z-index 설정
    updateFurnitureLayer(furn, furniture.layer);

    furn.on('dragstart', async (e) => {
      const currentFurn = furnitureObjects.value[selectedFurniture.index]
      if (currentFurn) {
        currentFurn.children()[0].children()[1].attr({'stroke-width': 0})
      }
      furn.front();  // 드래그 중에는 최상단에 표시
      furn.children()[0].children()[1].attr({'stroke-width': 10})
      Object.assign(selectedFurniture, furniture);
    });
    furn.on('dragmove', (e) => {
      updateSelectedValues(furn);
    })
    furn.on('dragend', (e) => {
      updateSelectedValues(furn);
      updateFurnitureLayer(furn, selectedFurniture.layer);  // 레이어 순서 재정렬
      updateFurniture();
    });
    furnitureObjects.value[furniture.index] = furn;
  }

  // 가구 재렌더링
  const redrawFurniture = (furniture) => {
    if (furniture.index === selectedFurniture.index) {
      Object.assign(selectedFurniture, furniture);
    }
    const furn = furnitureObjects.value[furniture.index];
    if (furn) {
      updateObjectValues(furn, furniture);
      // 레이어 변경 즉시 적용
      updateFurnitureLayer(furn, furniture.layer);
    }
  }
  // 가구 지우기
  const eraseFurniture = (furniture) => {
    const furn = furnitureObjects.value[furniture.index];
    if (furn) {
      furn.draggable(false);
      furn.remove();
    }
    furnitureObjects.value[furniture.index] = null;
  }

  // 레이어 변경 함수 추가
  const changeFurnitureLayer = (newLayer) => {
    // 0~10 범위로 제한
    const clampedLayer = Math.max(0, Math.min(10, newLayer));
    
    if (selectedFurniture.index !== null) {
      selectedFurniture.layer = clampedLayer;
      updateFurniture();
    }
  }
  // ------------------------------
  // 위치 조정 함수
  const adjustPosition = (axis, delta) => {
    if (selectedFurniture.index === null) return;
    
    if (axis === 'x') {
      selectedFurniture.xpos += delta;
    } else if (axis === 'y') {
      selectedFurniture.ypos += delta;
    }
    updateFurniture();
  };

  // 크기 조정 함수
  const adjustSize = (dimension, delta) => {
    if (selectedFurniture.index === null) return;
    
    if (dimension === 'width') {
      selectedFurniture.width = Math.max(10, selectedFurniture.width + delta);
    } else if (dimension === 'height') {
      selectedFurniture.height = Math.max(10, selectedFurniture.height + delta);
    }
    updateFurniture();
  };

  // 회전 조정 함수
  const adjustRotation = (delta) => {
    if (selectedFurniture.index === null) return;
    
    selectedFurniture.rotation = (selectedFurniture.rotation + delta + 360) % 360;
    updateFurniture();
  };

  // 레이어 조정 함수 수정
  const adjustLayer = (delta) => {
    if (selectedFurniture.index !== null) {
      const newLayer = Math.max(0, Math.min(10, selectedFurniture.layer + delta));
      selectedFurniture.layer = newLayer;
      furnitureDataList.value[selectedFurniture.index].layer = newLayer;
      
      const furn = furnitureObjects.value[selectedFurniture.index];
      if (furn) {
        updateFurnitureLayer(furn, newLayer);
      }
      
      updateFurniture();
    }
  };

  return {
    //----- 웹소켓 관련 -----
    initializeWebSocket,    // 웹소켓 초기화 및 roomId 초기화화
    subscribeToRoom,        // 채널 구독
    unsubscribeFromRoom,    // 채널 구독 해제
    publishFurnitureEvent,  // 이벤트 발행
    //----------------------
    selectedFurniture,      // 선택 된 가구 정보 저장
    fetchFurnitureList,     // 가구 배치 정보 리스트 가져오기
    dropFurniture,          // 가구 드롭 (생성)
    updateFurniture,        // 가구 업데이트
    deleteFurniture,        // 가구 삭제
    
    walls,
    roomId,
    fetchWalls,

    executeToolEvent,
    initializeCanvas,
    zoomCanvas: handleZoom,
    handleKeyDown,
    
    toggleLengthLabels,

    viewbox: computed(() => viewModule?.viewbox),
    changeFurnitureLayer,  // 레이어 변경 함수 export
    toggleGrid,
    showGrid,
    adjustLayer,  // 새로운 함수 export

    adjustPosition,
    adjustSize,
    adjustRotation,
  };
});