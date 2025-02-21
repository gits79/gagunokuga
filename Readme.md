# 가구놓구가 🛋️
# :clipboard: 목차

- :books: <a href="#outline">개요</a>
- 📌 <a href="#function">주요 기능</a>
- :wrench: <a href="#tech">기술 스택</a>
- 📝 <a href="#specification">요구사항 명세서</a>
- 💭 <a href="#erd">ERD(Entity-Relation Diagram)</a>
- 🎨 <a href="#frame">와이어프레임</a>
- 💁‍♂️ <a href="#team">프로젝트 팀원</a>
  

# :books: <a name="outline">개요</a>
<br/>
<img src="https://github.com/user-attachments/assets/09a0d908-bce8-4b56-9e88-b798a466525d" width=200/>

> - **프로젝트** : 가구 배치 실시간 협업 서비스
>
> - **기획 배경**
>   - 가구 배치에 대한 충분한 논의가 이루어지지 않으면, 이사 후 **재배치**해야 하는 **번거로움** 발생
>   - 거실, 부엌 등 **공용 공간**의 가구 배치를 위한 **소통 플랫폼 부재**
> - **서비스 설명**
>   - `가구놓구가`는 모든 가족 구성원이 공간 설계에 참여하여 **의견을 교환**하고, **가구 배치 시뮬레이션**을 할 수 있도록 도와주는 서비스입니다.
>    
> - **분류** : 팀 프로젝트
>
> - **제작 기간** : 2025.01.13 ~ 
>
> - **프로젝트 주제** : 가족 구성원이 실시간으로 가구 배치를 할 수 있는 웹 사이트 제작

<br/>

# 📌 <a name="function">주요 기능</a>
<h4>1. 2D 탑뷰 가구 배치</h4>

> - 사용자는 집의 평면도를 쉽게 제작할 수 있습니다. 각 공간의 크기와 모양을 설정하고, 그 위에 다양한 가구들을 배치할 수 있도록 도와줍니다.
> - 가구들은 드래그 앤 드롭 방식으로 자유롭게 배치할 수 있으며, 크기나 각도도 사용자가 조정할 수 있습니다.
> - 이를 통해, 사용자는 실제 공간에서 어떻게 가구가 배치될지 직관적으로 확인하고 조정할 수 있습니다.
<h4>2. 실시간 동시 편집(CRDT)</h4>

> - 여러 가족 구성원이 동시에 접속하여 각자의 가구 배치를 실시간으로 편집할 수 있습니다.
> - 사용자는 가구를 움직이거나 새롭게 추가하는 동시에, 다른 구성원이 변경한 사항을 즉시 확인할 수 있습니다.
> - 충돌을 최소화하는 방식으로, 모든 편집 사항이 실시간으로 반영되어 서로 간의 의견을 빠르게 조정하고 반영할 수 있습니다.
<h4>3. 실시간 채팅</h4>

> - 가구 배치와 관련된 의견을 실시간으로 주고받을 수 있는 채팅 기능이 제공됩니다.
> - 각 가족 구성원은 채팅을 통해 가구 배치에 대한 피드백을 주거나, 어떤 변경을 원하는지 간단히 소통할 수 있습니다.
> - 채팅 창을 통해 배치된 가구에 대한 자세한 설명을 추가하거나, 제안 및 의견을 나누면서 협업할 수 있습니다.
<br/>

# :wrench: <a name="tech">기술 스택</a>
<h4>데이터베이스</h4>
<div align="left">
   <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
   <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
</div> 
<h4>백엔드</h4>
<div align="left">
    <img src="https://img.shields.io/badge/JAVA-007396?style=for-the-badge&logo=Java&logoColor=white"/>
     <img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
    <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" />
    <img src="https://img.shields.io/badge/MyBatis-232F3E?style=for-the-badge&logo=mybatis&logoColor=white" />
</div>
</div> 
<h4>프론트엔드</h4>
<div align="left">
  <img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white">
   <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"/>
   <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"/>
     <img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"/>
   <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
     <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
</div>
<h4>API / Library</h4>

</div>
<h4>클라우드 스토리지</h4>

<h4>협업도구</h4>
<div align="left">
<img src="https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white" />
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jirasoftware&logoColor=white" />
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white" />

</div><br/>

# 📝 <a name="specification">요구사항 명세서</a>
<img src="https://github.com/user-attachments/assets/d4ee0a9c-df67-4d82-a8aa-bc84570cbff7"/>
<img src="https://github.com/user-attachments/assets/138ba78b-1382-4de0-8070-bd6296438460"/>
<br/>

# 💭 <a name="erd">ERD(Entity-Relation Diagram)</a>
<img src="https://github.com/user-attachments/assets/03b8d907-856f-4ecb-8ed4-66d718c11969"/>
<br/>

# 🎨 <a name="frame">와이어프레임</a>
<img src="https://github.com/user-attachments/assets/004adcef-ff3e-4ba3-a2c7-cfa7055f8d8b"/>

<br/>

# 💁‍♂️ <a name="team"> 프로젝트 팀원</a>
<div><br/>

|FullStack|FullStack|FullStack|FullStack|FullStack|FullStack|
|:---:|:---:|:---:|:---:|:---:|:---:|
| ![김예훈](https://github.com/user-attachments/assets/a3735474-3043-4f18-98b9-f97e77589522)| ![김민섭](https://github.com/user-attachments/assets/912a808c-b6e2-4f22-b0bd-124722e4b4d6)| ![김윤지](https://github.com/user-attachments/assets/583ab5ef-07a9-4ed6-88cc-e2fd716b4a08)| ![김지환](https://github.com/user-attachments/assets/0a4f1ed8-13fc-4769-9660-5a6bac571fb1)| ![송정호](https://github.com/user-attachments/assets/3bc00b58-28f6-427d-b3a1-e349d1a0a631)| ![장다은](https://github.com/user-attachments/assets/038d3b84-0757-48ba-935e-85bbec9573f6) |
|[김예훈](https://github.com/yhkimox)|[김민섭](https://github.com/TrexVsTank)|[김윤지](https://github.com/ximvamom)|[김지환](https://github.com/gits79)|[송정호](https://github.com/dynamite885)|[장다은](https://github.com/boriaegi)|
|**팀장**|팀원|팀원|팀원|팀원|팀원|

</div><br/>
