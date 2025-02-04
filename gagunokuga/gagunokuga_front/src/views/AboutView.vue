<template>
  <div class="house"> <!-- 메인 화면 꾸미기용 페이지 -->
    <!-- 방 사각형의 각 선들 -->
    <div class="room">
      <!-- 선 레이어: 검정색 선들 -->
      <div class="room-lines">
        <div class="top"></div>
        <div class="right"></div>
        <div class="bottom"></div>
        <div class="left"></div>
      </div>
      <!-- 배경 레이어: 붉은색 배경 -->
      <div class="inner-background"></div>
    </div>

    <!-- 가구들 -->
    <div
        v-for="(item, index) in furniture"
        :key="index"
        class="furniture"
        :style="getFurnitureStyle(item)"
    >
      <img :src="item.image" alt="furniture" />
    </div>
  </div>
</template>

<script>
// 이미지 경로를 import해서 처리
import catImage from '../assets/cat2.png';

export default {
  data() {
    return {
      furniture: [
        { image: catImage, x: 0, y: 0 },
        { image: catImage, x: 0, y: 0 },
        { image: catImage, x: 0, y: 0 },
        { image: catImage, x: 0, y: 0 },
      ]
    };
  },
  mounted() {
    this.initializeFurniturePositions();
  },
  methods: {
    // 랜덤 위치 생성 (방 안에 맞는 좌표)
    initializeFurniturePositions() {
      this.furniture.forEach((item) => {
        item.x = Math.random() * 400; // x: 0 ~ 400
        item.y = Math.random() * 300; // y: 0 ~ 300
      });
    },
    getFurnitureStyle(item) {
      return {
        position: 'absolute',
        left: `${item.x}px`,
        top: `${item.y}px`,
        transition: 'all 3s ease-out', // 애니메이션 적용
        animationDelay: `${Math.random() * 2}s`, // 가구 애니메이션 지연
      };
    }
  }
};
</script>

<style scoped>
.house {
  position: relative;
  width: 600px;
  height: 500px;
  border: 2px solid #000;
  overflow: hidden;
}

.room {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 500px;
  height: 400px;
  background-color: white; /* 기본 배경은 흰색 */
  z-index: 1;
  position: relative;
  overflow: hidden;
}

/* 선 레이어: 검정색 선, 굵기 증가 */
.room-lines div {
  position: absolute;
  background-color: #000000; /* 선을 검정색으로 설정 */
  opacity: 0; /* 처음에 선은 보이지 않음 */
  transition: opacity 1s ease-out; /* 선이 점차 나타나게 */
  z-index: 3; /* 선이 배경보다 앞에 오도록 설정 */
}

.room .top {
  width: 100%;
  height: 4px; /* 선의 굵기 증가 */
  top: 0;
  left: 0;
  animation: drawTop 3s forwards;
}

.room .right {
  width: 4px; /* 선의 굵기 증가 */
  height: 100%;
  top: 0;
  right: 0;
  animation: drawRight 3s forwards 3s; /* 3초 뒤에 그려지도록 지연 */
}

.room .bottom {
  width: 100%;
  height: 4px; /* 선의 굵기 증가 */
  bottom: 0;
  left: 0;
  animation: drawBottom 3s forwards 6s; /* 6초 뒤에 그려지도록 지연 */
}

.room .left {
  width: 4px; /* 선의 굵기 증가 */
  height: 100%;
  top: 0;
  left: 0;
  animation: drawLeft 3s forwards 9s; /* 9초 뒤에 그려지도록 지연 */
}

/* 선 그려지는 애니메이션 */
@keyframes drawTop {
  0% {
    width: 0;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

@keyframes drawRight {
  0% {
    height: 0;
    opacity: 1;
  }
  100% {
    height: 100%;
    opacity: 1;
  }
}

@keyframes drawBottom {
  0% {
    width: 0;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

@keyframes drawLeft {
  0% {
    height: 0;
    opacity: 1;
  }
  100% {
    height: 100%;
    opacity: 1;
  }
}

/* 배경 레이어: 붉은색 배경 */
.inner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: red; /* 붉은색 배경 */
  opacity: 0; /* 처음에는 보이지 않도록 */
  animation: fillBackground 0s forwards 12s; /* 12초 뒤에 색칠이 시작되며, 바로 칠해짐 */
  z-index: 2; /* 배경은 선보다 뒤에 오도록 설정 */
}

/* 가구 이미지 */
.furniture {
  width: 50px;
  height: 50px;
  z-index: 2;
  opacity: 0; /* 가구는 처음에 보이지 않음 */
  animation: appearFurniture 3s forwards; /* 가구 애니메이션 */
}

.furniture img {
  width: 100%;
  height: 100%;
}

/* 가구가 나타나는 애니메이션 */
@keyframes appearFurniture {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 붉은색 배경을 채우는 애니메이션 (12초 후 바로 칠해짐) */
@keyframes fillBackground {
  0% {
    opacity: 0; /* 초기에는 보이지 않음 */
  }
  100% {
    opacity: 1; /* 12초 뒤에 바로 붉은색 배경으로 채워짐 */
  }
}
</style>
