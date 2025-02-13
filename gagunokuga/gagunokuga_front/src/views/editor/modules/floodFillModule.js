export const createFloodFillModule = (draw, walls) => {
    const GRID_SIZE = 10;  // 계산용 그리드
    const EXPAND_SIZE = 50;  // 시각화 시 확장할 크기
    
    // 특정 좌표가 벽 안에 있는지 확인하는 함수
    const isPointInWall = (x, y) => {
        const key = `${Math.floor(x/GRID_SIZE)}:${Math.floor(y/GRID_SIZE)}`;
        if (wallGridCache.has(key)) return true;
        
        const isInWall = walls.some(wall => {
            const thickness = wall.thickness / 2;
            
            // 수직 벽
            if (Math.abs(wall.x1 - wall.x2) < 1) {
                const wallX = wall.x1;
                const minY = Math.min(wall.y1, wall.y2);
                const maxY = Math.max(wall.y1, wall.y2);
                
                // x 방향으로는 두께만큼, y 방향으로는 실제 벽 길이만 체크
                return Math.abs(x - wallX) <= thickness && 
                       y >= minY && 
                       y <= maxY;
            }
            
            // 수평 벽
            if (Math.abs(wall.y1 - wall.y2) < 1) {
                const wallY = wall.y1;
                const minX = Math.min(wall.x1, wall.x2);
                const maxX = Math.max(wall.x1, wall.x2);
                
                // y 방향으로는 두께만큼, x 방향으로는 실제 벽 길이만 체크
                return Math.abs(y - wallY) <= thickness && 
                       x >= minX && 
                       x <= maxX;
            }
        });

        if (isInWall) wallGridCache.add(key);
        return isInWall;
    };

    // 벽들의 경계 영역 계산
    const getWallsBoundingBox = () => {
        if (walls.length === 0) return null;
        
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        
        walls.forEach(wall => {
            // 벽의 두께를 고려
            const thickness = wall.thickness / 2;
            minX = Math.min(minX, wall.x1 - thickness, wall.x2 - thickness);
            minY = Math.min(minY, wall.y1 - thickness, wall.y2 - thickness);
            maxX = Math.max(maxX, wall.x1 + thickness, wall.x2 + thickness);
            maxY = Math.max(maxY, wall.y1 + thickness, wall.y2 + thickness);
        });
        
        // 여유 공간 추가 (100mm)
        return {
            minX: Math.floor(minX - 100),
            minY: Math.floor(minY - 100),
            maxX: Math.ceil(maxX + 100),
            maxY: Math.ceil(maxY + 100)
        };
    };

    const visualizeSpaces = (spaces) => {
        draw.find('.enclosed-space').remove();
        draw.find('.enclosed-space-text').remove();
        
        const spacesGroup = draw.group().addClass('enclosed-space');
        
        spaces.forEach((space, index) => {
            const color = '#dddddd0a';
            const spaceGroup = spacesGroup.group();
            
            space.forEach(key => {
                const [x, y] = key.split(',').map(Number);
                spaceGroup.rect(GRID_SIZE + EXPAND_SIZE, GRID_SIZE + EXPAND_SIZE)
                    .move(x - EXPAND_SIZE/2, y - EXPAND_SIZE/2)
                    .fill(color)
                    .stroke({ width: 0 });
            });

            // 중심점 계산
            const points = Array.from(space).map(key => key.split(',').map(Number));
            const bounds = points.reduce((acc, [x, y]) => ({
                minX: Math.min(acc.minX, x),
                minY: Math.min(acc.minY, y),
                maxX: Math.max(acc.maxX, x),
                maxY: Math.max(acc.maxY, y)
            }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;
            const area = space.size * GRID_SIZE * GRID_SIZE;

            // 텍스트를 draw에 직접 추가
            draw.text(`${(area / 1000000).toFixed(2)}m²`)
                .font({
                    family: 'Arial',
                    size: 20,
                    anchor: 'middle',
                    weight: 'bold'
                })
                .move(centerX, centerY)
                .fill('#000000')
                .addClass('enclosed-space-text');
        });
    };

    // 플러드필 알고리즘으로 닫힌 공간 찾기
    const findEnclosedSpaces = () => {
        const bounds = getWallsBoundingBox();
        if (!bounds) {
            return [];
        }

        // 벽 그리드 캐시 초기화
        wallGridCache = new Set();
        
        // 그리드 크기로 나누어 검사 포인트 줄이기
        const visited = new Set();
        const spaces = [];
        
        // 외부 공간 채우기
        const exteriorSpace = new Set();
        const queue = [];
        
        // 경계점 추가 (그리드 단위로)
        for (let x = bounds.minX; x <= bounds.maxX; x += GRID_SIZE) {
            queue.push([x, bounds.minY], [x, bounds.maxY]);
        }
        for (let y = bounds.minY; y <= bounds.maxY; y += GRID_SIZE) {
            queue.push([bounds.minX, y], [bounds.maxX, y]);
        }
        
        while (queue.length > 0) {
            const [cx, cy] = queue.pop();
            const key = `${cx},${cy}`;
            
            if (visited.has(key) || isPointInWall(cx, cy)) continue;
            if (cx < bounds.minX || cx > bounds.maxX || cy < bounds.minY || cy > bounds.maxY) continue;
            
            visited.add(key);
            exteriorSpace.add(key);
            
            queue.push(
                [cx + GRID_SIZE, cy],
                [cx - GRID_SIZE, cy],
                [cx, cy + GRID_SIZE],
                [cx, cy - GRID_SIZE]
            );
        }
        
        // 내부 공간 찾기 (그리드 단위로)
        for (let x = bounds.minX; x < bounds.maxX; x += GRID_SIZE) {
            for (let y = bounds.minY; y < bounds.maxY; y += GRID_SIZE) {
                const key = `${x},${y}`;
                
                if (visited.has(key) || isPointInWall(x, y) || exteriorSpace.has(key)) {
                    continue;
                }

                const currentSpace = new Set();
                const spaceQueue = [[x, y]];
                
                while (spaceQueue.length > 0) {
                    const [cx, cy] = spaceQueue.pop();
                    const currentKey = `${cx},${cy}`;
                    
                    if (visited.has(currentKey) || 
                        isPointInWall(cx, cy) || 
                        exteriorSpace.has(currentKey) ||
                        cx < bounds.minX || cx > bounds.maxX ||
                        cy < bounds.minY || cy > bounds.maxY) {
                        continue;
                    }
                    
                    visited.add(currentKey);
                    currentSpace.add(currentKey);
                    
                    spaceQueue.push(
                        [cx + GRID_SIZE, cy],
                        [cx - GRID_SIZE, cy],
                        [cx, cy + GRID_SIZE],
                        [cx, cy - GRID_SIZE]
                    );
                }
                
                if (currentSpace.size > 0) {
                    spaces.push(currentSpace);
                }
            }
        }

        // 공간 찾기가 완료된 후 시각화 실행
        visualizeSpaces(spaces);
        
        return spaces;
    };

    // 벽 그리드 캐시
    let wallGridCache = new Set();

    return {
        findEnclosedSpaces,
        visualizeSpaces
    };
}; 